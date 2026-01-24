$targetRepo = "https://github.com/tarakiga/docketoneBUILD"
$outDir = "out"

if (-not (Test-Path $outDir)) {
    Write-Error "Build directory 'out' not found. Run 'npm run build' first."
    exit 1
}

Push-Location $outDir

if (-not (Test-Path .git)) {
    git init
}

# Ensure we are on main branch
git checkout -B main

# Check if target remote exists
$remotes = git remote
if ($remotes -notcontains "target") {
    git remote add target $targetRepo
} else {
    git remote set-url target $targetRepo
}

git add .
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -m "Auto-build (normalization fix): $date"

Write-Host "Pushing to $targetRepo..."
git push target main --force

Pop-Location
