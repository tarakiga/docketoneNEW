# deploy_build.ps1
# Publishes the static export in out/ to the build repo (docketoneBUILD).
#
# Key invariant: each deploy creates ONE commit that descends from the CURRENT
# remote main. The Hostinger host deploys via `git pull`, which requires a
# fast-forward -- so the new commit must be a descendant of what the host has.
# Basing every deploy on the fetched remote main guarantees this and prevents
# the "divergent branches / Need to specify how to reconcile" deploy failure.

$targetRepo = "https://github.com/tarakiga/docketoneBUILD.git"
$outDir     = "out"
$branch     = "main"
$gitName    = "DocketOne Deploy"
$gitEmail   = "tar112@gmail.com"

if (-not (Test-Path $outDir)) {
    Write-Error "Build directory '$outDir' not found. Run 'npm run build' first."
    exit 1
}

Push-Location $outDir

# Initialise the publish repo if next build wiped it (or this is the first deploy).
if (-not (Test-Path ".git")) {
    git init -q
}

# Local identity so `git commit` never fails on a freshly-initialised repo.
git config user.name  $gitName
git config user.email $gitEmail

# Point the 'target' remote at the build repo.
if ((git remote) -notcontains "target") {
    git remote add target $targetRepo
} else {
    git remote set-url target $targetRepo
}

# Work on a clean 'main' branch.
git checkout -qB $branch

# If the remote branch already exists, base this deploy on it so the new commit
# is a fast-forward descendant -> the host's `git pull` always fast-forwards.
# (If it doesn't exist yet, this is the first deploy: we create a root commit.)
$remoteHead = git ls-remote target $branch
if ($remoteHead) {
    git fetch -q target $branch
    git reset --mixed FETCH_HEAD | Out-Null
}

# Stage the freshly built output (adds, modifies, and deletes stale pages).
git add -A
$date = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
git commit -q -m "Auto-build: $date"
if ($LASTEXITCODE -ne 0) {
    Write-Host "Nothing to deploy - build output matches the live site."
    Pop-Location
    exit 0
}

# Fast-forward push. No --force needed: we descend from the current remote main.
Write-Host "Pushing to $targetRepo ($branch)..."
git push target $branch
$pushCode = $LASTEXITCODE

Pop-Location

if ($pushCode -ne 0) {
    Write-Error "Push failed. The remote may have moved; re-run the deploy to rebase on the latest remote main."
    exit 1
}

Write-Host "Deploy complete."
