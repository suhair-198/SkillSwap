param (
    [string]$Profile = ""
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$backendDir = Join-Path $scriptDir "backend"
$envFile = Join-Path $backendDir ".env"

if (Test-Path $envFile) {
    Write-Host "[ENV] Loading environment from backend/.env ..." -ForegroundColor Cyan
    Get-Content $envFile | ForEach-Object {
        $line = $_.Trim()
        if ($line -and -not $line.StartsWith('#')) {
            $parts = $line -split '=', 2
            if ($parts.Length -eq 2) {
                $key = $parts[0].Trim()
                $value = $parts[1].Trim()
                [System.Environment]::SetEnvironmentVariable($key, $value, 'Process')
                Write-Host "  - $key" -ForegroundColor Green
            }
        }
    }
}

if (-not $Profile) {
    $Profile = [System.Environment]::GetEnvironmentVariable('SPRING_PROFILES_ACTIVE', 'Process')
    if (-not $Profile) {
        $Profile = "default"
    }
}

if ($Profile -eq "supabase") {
    $pwd = [System.Environment]::GetEnvironmentVariable('SUPABASE_DB_PASSWORD', 'Process')
    if (-not $pwd) {
        $pwd = [System.Environment]::GetEnvironmentVariable('SPRING_DATASOURCE_PASSWORD', 'Process')
    }
    if (-not $pwd -or $pwd -eq 'YOUR_SUPABASE_DB_PASSWORD_HERE' -or $pwd -eq 'YOUR_SUPABASE_PASSWORD') {
        Write-Warning "SUPABASE_DB_PASSWORD is not set or still a placeholder in backend/.env!"
        Write-Host "Falling back to local persistent database (profile: default)..." -ForegroundColor Yellow
        $Profile = "default"
    }
}

if ($Profile -eq "default") {
    # Ensure no leftover external datasource environment variables interfere with local H2
    [System.Environment]::SetEnvironmentVariable('SPRING_DATASOURCE_URL', $null, 'Process')
    [System.Environment]::SetEnvironmentVariable('SPRING_DATASOURCE_USERNAME', $null, 'Process')
    [System.Environment]::SetEnvironmentVariable('SPRING_DATASOURCE_PASSWORD', $null, 'Process')
    [System.Environment]::SetEnvironmentVariable('SPRING_JPA_DATABASE_PLATFORM', $null, 'Process')
    [System.Environment]::SetEnvironmentVariable('SPRING_DATASOURCE_DRIVER_CLASS_NAME', $null, 'Process')
}

Write-Host ""
Write-Host "Starting SkillSwap backend (profile: $Profile)..." -ForegroundColor Cyan
if ($Profile -eq "supabase") {
    Write-Host "   Database: Supabase IPv4 Pooler (aws-0-ap-northeast-2.pooler.supabase.com:5432)" -ForegroundColor Gray
} else {
    Write-Host "   Database: Local persistent H2 (backend/data/skillswapdb.mv.db)" -ForegroundColor Gray
}
Write-Host "   Port: 8080" -ForegroundColor Gray
Write-Host ""

Set-Location $backendDir
& "$scriptDir\maven\apache-maven-3.9.6\bin\mvn.cmd" spring-boot:run "-Dspring-boot.run.profiles=$Profile"
