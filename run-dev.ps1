# run-dev.ps1
# Starts both the SkillSwap Spring Boot Backend and React Frontend for local development
# Run: .\run-dev.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Starting SkillSwap Full Stack Dev Server" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Start Backend in a new window
Write-Host "[1/2] Starting Spring Boot Backend (Port 8080)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptDir'; .\run-backend.ps1"

# 2. Wait a moment for backend to initialize
Start-Sleep -Seconds 3

# 3. Start Frontend
Write-Host "[2/2] Starting React Frontend (Port 5173)..." -ForegroundColor Green
Set-Location (Join-Path $scriptDir "frontend")
npm run dev
