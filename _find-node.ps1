$j = Get-Content "$env:TEMP\node-index.json" -Raw | ConvertFrom-Json
$lts = $j | Where-Object { $_.lts -is [string] } | Select-Object -First 1
Write-Output $lts.version
Write-Output $lts.lts
