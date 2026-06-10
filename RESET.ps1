# Reset live/ from live-scaffold-snapshot (pristine scaffold).
# Run from the repo root:
#   .\RESET.ps1
# Or skip npm install:
#   .\RESET.ps1 -SkipInstall

param(
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot
$Live = Join-Path $RepoRoot "live"
$Snapshot = Join-Path $RepoRoot "live-scaffold-snapshot"

if (-not (Test-Path $Snapshot)) {
    Write-Error "Missing folder: live-scaffold-snapshot"
}

Write-Host ""
Write-Host "Resetting live/ from live-scaffold-snapshot..." -ForegroundColor Cyan

if (Test-Path $Live) {
    Write-Host "  Removing live/..."
    Remove-Item -LiteralPath $Live -Recurse -Force
}

Write-Host "  Copying live-scaffold-snapshot -> live/..."
$robocopyArgs = @(
    $Snapshot,
    $Live,
    "/E",
    "/XD", "node_modules", ".next", ".vercel",
    "/NFL", "/NDL", "/NJH", "/NJS", "/NC", "/NS"
)
& robocopy @robocopyArgs | Out-Null
if ($LASTEXITCODE -ge 8) {
    Write-Error "robocopy failed with exit code $LASTEXITCODE"
}

if (-not $SkipInstall) {
    Write-Host "  Running npm install..."
    Push-Location $Live
    try {
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Error "npm install failed"
        }
    } finally {
        Pop-Location
    }
}

Write-Host ""
Write-Host "Done. live/ is reset." -ForegroundColor Green
Write-Host "  cd live"
Write-Host "  npm run dev"
Write-Host ""
