# Reset "live test" from "live test backup" (pristine scaffold).
# Run from the repo root:
#   .\RESET.ps1
# Or skip npm install:
#   .\RESET.ps1 -SkipInstall

param(
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
$RepoRoot = $PSScriptRoot
$LiveTest = Join-Path $RepoRoot "live test"
$Backup = Join-Path $RepoRoot "live test backup"

if (-not (Test-Path $Backup)) {
    Write-Error "Missing folder: live test backup"
}

Write-Host ""
Write-Host "Resetting live test from live test backup..." -ForegroundColor Cyan

if (Test-Path $LiveTest) {
    Write-Host "  Removing live test..."
    Remove-Item -LiteralPath $LiveTest -Recurse -Force
}

Write-Host "  Copying live test backup -> live test..."
$robocopyArgs = @(
    $Backup,
    $LiveTest,
    "/E",
    "/XD", "node_modules", ".next", ".vercel",
    "/NFL", "/NDL", "/NJH", "/NJS", "/NC", "/NS"
)
& robocopy @robocopyArgs | Out-Null
# robocopy exit codes 0-7 mean success; 8+ is a real error.
if ($LASTEXITCODE -ge 8) {
    Write-Error "robocopy failed with exit code $LASTEXITCODE"
}

if (-not $SkipInstall) {
    Write-Host "  Running npm install..."
    Push-Location $LiveTest
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
Write-Host "Done. live test is reset." -ForegroundColor Green
Write-Host "  cd `"live test`""
Write-Host "  npm run dev"
Write-Host ""
