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
    title   = "Test Humanized Title"
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://blog.docket.one/wp-json/wp/v2/posts/9" -Method Post -Headers $headers -Body $body
