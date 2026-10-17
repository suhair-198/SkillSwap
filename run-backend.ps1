# run-backend.ps1
# Starts the SkillSwap Spring Boot backend with Supabase environment variables
# Run from the project root: .\run-backend.ps1

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
$envFile = Join-Path $backendDir ".env"

if (-Not (Test-Path $envFile)) {
    Write-Error "❌ .env file not found at: $envFile"
    Write-Host "Please create backend/.env with your Supabase credentials."
    exit 1
}

# Load .env file
Write-Host "📦 Loading environment from backend/.env ..." -ForegroundColor Cyan
Get-Content $envFile | ForEach-Object {
    $line = $_.Trim()
    if ($line -and -not $line.StartsWith('#')) {
        $parts = $line -split '=', 2
        if ($parts.Length -eq 2) {
            $key = $parts[0].Trim()
            $value = $parts[1].Trim()
            [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
            Write-Host "  ✓ $key" -ForegroundColor Green
        }
    }
}

# Validate the password was actually set
$pwd = [System.Environment]::GetEnvironmentVariable('SPRING_DATASOURCE_PASSWORD', 'Process')
if (-not $pwd -or $pwd -eq 'YOUR_SUPABASE_DB_PASSWORD_HERE') {
    Write-Error "❌ SPRING_DATASOURCE_PASSWORD is not set or still a placeholder!"
    Write-Host "Please open backend/.env and replace YOUR_SUPABASE_DB_PASSWORD_HERE with your real Supabase database password."
    Write-Host "(Find it at: https://supabase.com/dashboard/project/bitfwvrvuffbrsrgzirk/settings/database)"
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting SkillSwap backend with Supabase (project: bitfwvrvuffbrsrgzirk)..." -ForegroundColor Cyan
Write-Host "   Database: db.bitfwvrvuffbrsrgzirk.supabase.co" -ForegroundColor Gray
Write-Host "   Profile: supabase" -ForegroundColor Gray
Write-Host ""

# Run Spring Boot
Set-Location $backendDir
& "$scriptDir\maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run `-Dspring-boot.run.profiles=supabase
