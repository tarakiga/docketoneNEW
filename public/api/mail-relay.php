<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["success" => false, "error" => "Method not allowed"]);
    exit;
}

$input = json_decode(file_get_contents('php://input'), true);
$type = $_GET['type'] ?? 'contact';

// SMTP Configuration
$smtp_host = "smtp.titan.email";
$smtp_port = 465;
$smtp_user = "support@docket.one";
$smtp_pass = "Galvatron101!";
$smtp_from = "support@docket.one";

// Format the email content
$subject = "";
$body = "";

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
} else {
    $subject = "New Contact Submission from " . ($input['name'] ?? 'Visitor');
    $body = "Contact Form Message\n--------------------\n" .
            "Name: " . ($input['name'] ?? 'N/A') . "\n" .
            "Email: " . ($input['email'] ?? 'N/A') . "\n\n" .
            "Message:\n" . ($input['message'] ?? '');
}

// Hostinger usually allows mail() if configured, but for authenticated SMTP 
// in a single file without libraries, we'll try a clean mail() call with 
// proper headers first, as many shared hosts intercept this. 
// If specific SMTP is required, PHPMailer is usually recommended, but 
// for a single-file static bridge, we'll use the native mail() with 
// the user's return-path.

$headers = "From: " . $smtp_from . "\r\n";
$headers .= "Reply-To: " . ($input['email'] ?? $smtp_from) . "\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Note: For authenticated SMTP in raw PHP without a library like PHPMailer,
// it requires a lot of socket code. On Hostinger, as long as the 'From' 
// matches the account email, mail() works through their relays.

if (mail($smtp_from, $subject, $body, $headers)) {
    echo json_encode(["success" => true, "message" => "Portal message delivered"]);
} else {
    echo json_encode(["success" => false, "error" => "Relay failure"]);
}
?>
