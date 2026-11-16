Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$script = Join-Path $PSScriptRoot 'Get-DeploymentHealth.ps1'
$fixture = Join-Path $PSScriptRoot 'services.example.json'
$result = & $script -InputPath $fixture | ConvertFrom-Json
if ($result.Total -ne 3 -or $result.Healthy -ne 1 -or
    $result.Slow -ne 1 -or $result.Down -ne 1) {
    throw 'Deployment health totals are incorrect.'
}
Write-Output 'PowerShell health checks passed'
