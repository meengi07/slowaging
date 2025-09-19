Param(
    [Parameter(Position = 0)]
    [string]$Message = "",
    [string]$Branch = ""
)

# Ensure this is a git repository
git rev-parse --is-inside-work-tree | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Error "Not a git repository."
    exit 1
}

# Determine current branch if not provided
if (-not $Branch) {
    $Branch = (git branch --show-current).Trim()
    if (-not $Branch) { $Branch = "main" }
}

# Stage all changes
git add -A

# Check if there is anything to commit
$changes = git status --porcelain
if (-not $changes) {
    Write-Output "No changes to commit."
    exit 0
}

# Default commit message
if (-not $Message) {
    $Message = "chore: task update"
}

# Commit
git commit -m $Message
if ($LASTEXITCODE -ne 0) {
    Write-Error "Commit failed."
    exit 1
}

# Ensure remote exists
$remotes = (git remote).Trim()
if (-not $remotes) {
    Write-Error "No git remote configured. Run: git remote add origin <url>"
    exit 1
}

# Push
git push -u origin $Branch
if ($LASTEXITCODE -ne 0) {
    Write-Error "Push failed."
    exit 1
}

Write-Output "Pushed to origin/$Branch successfully."


