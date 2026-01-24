$content = Get-Content 'C:\Users\TAH\.gemini\antigravity\brain\d2f6bb21-1629-41f5-9e7c-bef2bb6506ac\draft_post.md' -Raw
$content = $content -replace '# Draft: .*?(\r\n|\n)', ''
$content = $content -replace '\*\*Title\*\*: .*?(\r\n|\n)', ''

# Simple Markdown to HTML conversion
$content = $content -replace '^### (.*)', '<h3>$1</h3>'
$content = $content -replace '\*\*(.*?)\*\*', '<strong>$1</strong>'
$content = $content -replace '\[(.*?)\]\((.*?)\)', '<a href="$2">$1</a>'

$paragraphs = $content -split "`r`n`r`n"
$htmlContent = ""
foreach ($p in $paragraphs) {
    if ($p.Trim() -ne "") {
        if ($p.StartsWith("<h")) {
            $htmlContent += $p.Trim() + "`n"
        } else {
            $htmlContent += "<p>" + $p.Trim().Replace("`r`n", "<br>") + "</p>`n"
        }
    }
}

$user = "dave"
$pass = "Gw8S Pmcg U5rQ FdBc 66M4 hcD4"
$pair = "$($user):$($pass)"
$bytes = [System.Text.Encoding]::ASCII.GetBytes($pair)
$base64 = [Convert]::ToBase64String($bytes)
$basicAuthValue = "Basic $base64"

$headers = @{
    Authorization = $basicAuthValue
    "Content-Type" = "application/json; charset=utf-8"
}

$bodyMap = @{
    title   = "🚗⚡💸 The Great Debate: Gas Car vs. EV vs. JUST UBERING – Which Saves You More?"
    content = $htmlContent
    status  = "publish"
}

# Save to a temporary JSON file with UTF8 encoding to ensure characters are preserved
$bodyJson = $bodyMap | ConvertTo-Json -Depth 20
[System.IO.File]::WriteAllText("d:\work\Tar\PROJECTS\CALCULATOR\web-app\temp_payload.json", $bodyJson, [System.Text.Encoding]::UTF8)

$payload = Get-Content "d:\work\Tar\PROJECTS\CALCULATOR\web-app\temp_payload.json" -Raw
Invoke-RestMethod -Uri "https://blog.docket.one/wp-json/wp/v2/posts/9" -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($payload))

Remove-Item "d:\work\Tar\PROJECTS\CALCULATOR\web-app\temp_payload.json"
