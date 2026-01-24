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

$body = @{
    content = "<p>Hey there! 🚗 testing emoji and formatting. <strong>Bold text</strong></p>"
} | ConvertTo-Json

# Use -Body $body and ensure it's sent as a string
Invoke-RestMethod -Uri "https://blog.docket.one/wp-json/wp/v2/posts/9" -Method Post -Headers $headers -Body ([System.Text.Encoding]::UTF8.GetBytes($body))
