# Start local dev for the backup failover app.
# Run from repo root:  .\DEV-BACKUP.ps1
#
# First time: paste SUPABASE_SERVICE_ROLE_KEY into backup/.env.local
# (Supabase dashboard -> Project Settings -> API -> service_role secret)

param(
    [switch]$SkipInstall
)

$ErrorActionPreference = "Stop"
$Backup = Join-Path $PSScriptRoot "backup"

if (-not (Test-Path $Backup)) {
    Write-Error "Missing folder: backup"
}

if (-not (Test-Path (Join-Path $Backup ".env.local"))) {
    Copy-Item (Join-Path $Backup ".env.example") (Join-Path $Backup ".env.local")
    Write-Host ""
    Write-Host "Created backup/.env.local from .env.example" -ForegroundColor Yellow
    Write-Host "Fill in Supabase keys before signup/admin will work." -ForegroundColor Yellow
    Write-Host ""
}

$envFile = Join-Path $Backup ".env.local"
$serviceRole = Select-String -Path $envFile -Pattern '^SUPABASE_SERVICE_ROLE_KEY=(.+)$' | Select-Object -First 1
if ($serviceRole -and $serviceRole.Matches[0].Groups[1].Value -match 'PASTE_|^$|^""$') {
    Write-Host ""
    Write-Host "backup/.env.local still needs SUPABASE_SERVICE_ROLE_KEY." -ForegroundColor Yellow
    Write-Host "  Supabase -> Project Settings -> API -> service_role (secret)" -ForegroundColor Yellow
    Write-Host "  UI will load; signup/votes/admin need the key." -ForegroundColor Yellow
    Write-Host ""
}

Push-Location $Backup
try {
    if (-not $SkipInstall -and -not (Test-Path "node_modules")) {
        Write-Host "Installing dependencies..." -ForegroundColor Cyan
        npm install
    }

    # Free port 3000 if a dead node process is holding it (Next would silently use 3001)
    $stale = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
    if ($stale) {
        try {
            $probe = Invoke-WebRequest -Uri "http://127.0.0.1:3000" -UseBasicParsing -TimeoutSec 2
        } catch {
            foreach ($conn in $stale) {
                $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
                if ($proc -and $proc.ProcessName -eq "node") {
                    Write-Host "Stopping stale node on port 3000 (PID $($conn.OwningProcess))..." -ForegroundColor Yellow
                    Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
                }
            }
            Start-Sleep -Seconds 1
        }
    }

    if (Test-Path ".next") {
        Write-Host "Clearing stale .next cache..." -ForegroundColor DarkGray
        Remove-Item -Recurse -Force ".next"
    }

    Write-Host ""
    Write-Host "Starting backup dev server..." -ForegroundColor Green
    Write-Host "  Landing:    http://localhost:3000" -ForegroundColor White
    Write-Host "  Presenter:  http://localhost:3000/present" -ForegroundColor White
    Write-Host "  Admin:      http://localhost:3000/admin" -ForegroundColor White
    Write-Host "  Guest join: http://localhost:3000/join" -ForegroundColor White
    Write-Host ""
    Write-Host "Deployed backup: https://brisbane-ai-cfo-842x.vercel.app" -ForegroundColor DarkGray
    Write-Host ""

    npm run dev
} finally {
    Pop-Location
}
