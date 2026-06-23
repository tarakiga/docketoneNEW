<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

/*
 * Credentials live OUTSIDE public_html so they are never web-accessible
 * and never committed to the (public) repo. Create the file by hand in
 * Hostinger File Manager one level above public_html. It must `return`
 * an array — see the mail-config.php template provided with this change.
 */
$config = null;
$candidates = [
    dirname($_SERVER['DOCUMENT_ROOT']) . '/mail-config.php',
    $_SERVER['DOCUMENT_ROOT'] . '/../mail-config.php',
    dirname(dirname($_SERVER['DOCUMENT_ROOT'])) . '/mail-config.php',
];
foreach ($candidates as $path) {
    if (is_file($path)) { $config = require $path; break; }
}
if (!is_array($config)) {
    error_log("mail-relay: config not found. Looked in: " . implode(', ', $candidates));
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Mailer not configured"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true) ?: [];
$type  = $_GET['type'] ?? 'contact';

// Strip CR/LF from any value used in a header to prevent header injection.
$clean = function ($v) { return trim(str_replace(["\r", "\n"], '', (string)$v)); };
$replyTo = filter_var($input['email'] ?? '', FILTER_VALIDATE_EMAIL) ? $clean($input['email']) : '';

if ($type === 'bug') {
    $subject = "🐛 Bug Report: " . ($input['location'] ?? 'Unknown');
    $body = "Bug Report\n----------\n" .
            "Reporter: " . ($input['name'] ?? 'Anonymous') . "\n" .
            "Email: " . ($input['email'] ?? 'N/A') . "\n" .
            "Location: " . ($input['location'] ?? 'N/A') . "\n" .
            "Browser: " . ($input['browser'] ?? 'N/A') . "\n\n" .
            "Description:\n" . ($input['description'] ?? '');
} elseif ($type === 'request') {
    $subject = "🚀 Calculator Request: " . ($input['title'] ?? 'New Idea');
    $body = "New Calculator Request\n---------------------\n" .
            "From: " . ($input['name'] ?? 'N/A') . "\n" .
            "Email: " . ($input['email'] ?? 'N/A') . "\n" .
            "Type: " . ($input['type'] ?? 'N/A') . "\n" .
            "Title: " . ($input['title'] ?? 'N/A') . "\n" .
            "Priority: " . ($input['priority'] ?? 'N/A') . "\n\n" .
            "Details:\n" . ($input['description'] ?? '');
} elseif ($type === 'newsletter') {
    $subject = "📬 Newsletter signup: " . ($input['email'] ?? 'unknown');
    $body = "New newsletter subscriber\n-------------------------\n" .
            "Email: " . ($input['email'] ?? 'N/A') . "\n" .
            "Source: " . ($input['source'] ?? 'website');
} else {
    $subject = "New Contact Submission from " . ($input['name'] ?? 'Visitor');
    $body = "Contact Form Message\n--------------------\n" .
            "Name: " . ($input['name'] ?? 'N/A') . "\n" .
            "Email: " . ($input['email'] ?? 'N/A') . "\n\n" .
            "Message:\n" . ($input['message'] ?? '');
}

/* ---- Authenticated SMTP over implicit TLS (port 465), no external library ---- */
function smtp_read($fp) {
    $data = '';
    while (($line = fgets($fp, 515)) !== false) {
        $data .= $line;
        // last line of a reply has a space (not '-') as the 4th character
        if (isset($line[3]) && $line[3] === ' ') break;
    }
    return $data;
}
function smtp_cmd($fp, $cmd, $expect) {
    if ($cmd !== null) fwrite($fp, $cmd . "\r\n");
    $resp = smtp_read($fp);
    return [((int)substr($resp, 0, 3)) === $expect, $resp];
}

$host = $config['smtp_host'] ?? 'smtp.titan.email';
$port = (int)($config['smtp_port'] ?? 465);
$user = $config['smtp_user'] ?? '';
$pass = $config['smtp_pass'] ?? '';
$from = $config['from_email'] ?? $user;
$fromName = $config['from_name'] ?? 'Docket One';
$to = $config['to_email'] ?? $user;

$fp = @stream_socket_client(($port === 465 ? "ssl://" : "tcp://") . $host . ":" . $port, $errno, $errstr, 20);
if (!$fp) {
    error_log("mail-relay: connect failed $errno $errstr");
    http_response_code(502);
    echo json_encode(["success" => false, "error" => "Relay connection failed"]);
    exit;
}
stream_set_timeout($fp, 20);

$ok = true;
list($r) = smtp_cmd($fp, null, 220);                  $ok = $ok && $r;   // greeting
list($r) = smtp_cmd($fp, "EHLO docket.one", 250);     $ok = $ok && $r;
list($r) = smtp_cmd($fp, "AUTH LOGIN", 334);          $ok = $ok && $r;
list($r) = smtp_cmd($fp, base64_encode($user), 334);  $ok = $ok && $r;
list($r) = smtp_cmd($fp, base64_encode($pass), 235);  $ok = $ok && $r;
list($r) = smtp_cmd($fp, "MAIL FROM:<{$from}>", 250); $ok = $ok && $r;
list($r) = smtp_cmd($fp, "RCPT TO:<{$to}>", 250);     $ok = $ok && $r;

if ($ok) { list($r) = smtp_cmd($fp, "DATA", 354); $ok = $ok && $r; }

if ($ok) {
    $encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
    $headers  = "Date: " . date('r') . "\r\n";
    $headers .= "From: \"{$fromName}\" <{$from}>\r\n";
    if ($replyTo) $headers .= "Reply-To: <{$replyTo}>\r\n";
    $headers .= "To: <{$to}>\r\n";
    $headers .= "Subject: {$encodedSubject}\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
    $headers .= "Content-Transfer-Encoding: 8bit\r\n";

    // Normalise newlines to CRLF and dot-stuff lines beginning with '.'
    $message = str_replace("\n", "\r\n", str_replace("\r\n", "\n", $body));
    $message = preg_replace('/^\./m', '..', $message);

    fwrite($fp, $headers . "\r\n" . $message . "\r\n.\r\n");
    list($r) = smtp_cmd($fp, null, 250); $ok = $ok && $r;
}

@fwrite($fp, "QUIT\r\n");
@fclose($fp);

if ($ok) {
    echo json_encode(["success" => true, "message" => "Message delivered"]);
} else {
    error_log("mail-relay: SMTP send failed for type=$type");
    http_response_code(502);
    echo json_encode(["success" => false, "error" => "Relay failure"]);
}
