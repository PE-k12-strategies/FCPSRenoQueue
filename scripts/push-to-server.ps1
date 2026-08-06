# Push to the office server Git repo on a Windows network share (P:).
#
# Git ref updates use atomic rename/lock, which often fails on SMB with:
#   remote: error: couldn't set refs/heads/<branch>
#
# This script tries a normal push first, then falls back to a direct ref write.

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$Branches
)

$ErrorActionPreference = 'Stop'

function Get-RemotePath {
    $url = git remote get-url server 2>$null
    if (-not $url) { throw 'No server remote configured (office network share).' }
    return $url.Trim()
}

function Get-CurrentBranch {
    $branch = git branch --show-current 2>$null
    if (-not $branch) { throw 'Detached HEAD - specify a branch name.' }
    return $branch.Trim()
}

function Remove-LooseRemoteRef {
    param(
        [string]$RemotePath,
        [string]$Branch
    )
    $refFile = Join-Path $RemotePath ".git\refs\heads\$Branch"
    if (Test-Path -LiteralPath $refFile) {
        Remove-Item -LiteralPath $refFile -Force
    }
}

function Set-RemoteRef {
    param(
        [string]$RemotePath,
        [string]$Branch,
        [string]$Sha
    )
    $headsDir = Join-Path $RemotePath '.git\refs\heads'
    if (-not (Test-Path -LiteralPath $headsDir)) {
        New-Item -ItemType Directory -Path $headsDir -Force | Out-Null
    }
    $refFile = Join-Path $headsDir $Branch
    Set-Content -LiteralPath $refFile -Value $Sha -NoNewline -Encoding ascii
}

function Invoke-ServerPush {
    param(
        [string]$Branch,
        [string]$RemotePath
    )

    $sha = (git rev-parse $Branch).Trim()
    if (-not $sha) {
        throw "Could not resolve commit for branch $Branch."
    }

    Write-Host "Pushing $Branch ($sha) to server/$Branch ..."

    Remove-LooseRemoteRef -RemotePath $RemotePath -Branch $Branch

    $prevErrorAction = $ErrorActionPreference
    $ErrorActionPreference = 'Continue'
    $pushOutput = git push server "${Branch}:${Branch}" 2>&1 | Out-String
    $pushExit = $LASTEXITCODE
    $ErrorActionPreference = $prevErrorAction

    if ($pushExit -eq 0) {
        Write-Host $pushOutput.Trim()
        Write-Host 'Push succeeded.'
        return
    }

    $refError = "refs/heads/$Branch"
    if ($pushOutput -notlike "*couldn't set '$refError'*") {
        Write-Host $pushOutput
        throw "git push failed for $Branch."
    }

    Write-Host 'Ref lock detected - applying network-share fallback ...'
    Set-RemoteRef -RemotePath $RemotePath -Branch $Branch -Sha $sha
    git -C $RemotePath pack-refs --all --prune 2>$null | Out-Null
    Write-Host "Updated server/$Branch via direct ref write."
}

if (-not $Branches -or $Branches.Count -eq 0) {
    $Branches = @(Get-CurrentBranch)
}

$remotePath = Get-RemotePath
$gitDir = Join-Path $remotePath '.git'
if (-not (Test-Path -LiteralPath $gitDir)) {
    throw "Origin is not a Git repo: $remotePath"
}

foreach ($branch in $Branches) {
    Invoke-ServerPush -Branch $branch -RemotePath $remotePath
}
