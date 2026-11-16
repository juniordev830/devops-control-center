<#
.SYNOPSIS
Summarizes deployment health from a JSON array of service observations.
.EXAMPLE
pwsh -File Get-DeploymentHealth.ps1 -InputPath services.json
#>
[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)]
    [ValidateScript({ Test-Path -LiteralPath $_ -PathType Leaf })]
    [string] $InputPath
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Get-HealthSummary {
    [CmdletBinding()]
    param([Parameter(Mandatory = $true)][object[]] $Services)

    $results = foreach ($service in $Services) {
        if ([string]::IsNullOrWhiteSpace([string]$service.name)) {
            throw 'Service name cannot be empty.'
        }
        if ($null -eq $service.latencyMs -or [double]$service.latencyMs -lt 0) {
            throw "Invalid latency for service $($service.name)."
        }
        $up = $service.up -eq $true
        $status = if (-not $up) { 'down' } elseif ([double]$service.latencyMs -gt 500) { 'slow' } else { 'healthy' }
        [pscustomobject]@{
            Name = [string]$service.name
            Status = $status
            LatencyMs = [double]$service.latencyMs
        }
    }
    $results = @($results)
    [pscustomobject]@{
        Total = $results.Count
        Healthy = @($results | Where-Object Status -eq 'healthy').Count
        Slow = @($results | Where-Object Status -eq 'slow').Count
        Down = @($results | Where-Object Status -eq 'down').Count
        Services = $results
    }
}

try {
    $observations = @(Get-Content -LiteralPath $InputPath -Raw | ConvertFrom-Json)
    Get-HealthSummary -Services $observations | ConvertTo-Json -Depth 5
} catch {
    [Console]::Error.WriteLine($_.Exception.Message)
    exit 1
}
