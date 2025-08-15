# One4Team Multi-Tenant SaaS Platform - PowerShell Deployment Script
# This script handles the complete deployment process for the One4Team platform

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("staging", "production")]
    [string]$Environment = "staging",
    
    [Parameter(Mandatory=$false)]
    [string]$Version = (Get-Date -Format "yyyyMMdd-HHmmss"),
    
    [Parameter(Mandatory=$false)]
    [string]$DockerRegistry = "one4team",
    
    [Parameter(Mandatory=$false)]
    [string]$EmailRecipients = "dev@one4team.com"
)

# Error handling
$ErrorActionPreference = "Stop"

# Function to write colored output
function Write-ColorOutput {
    param(
        [string]$Message,
        [string]$Color = "White"
    )
    Write-Host $Message -ForegroundColor $Color
}

# Function to log with timestamp
function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-ColorOutput "[$timestamp] $Message" "Green"
}

# Function to log errors
function Write-ErrorLog {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-ColorOutput "[$timestamp] ERROR: $Message" "Red"
}

# Function to check if command exists
function Test-Command {
    param([string]$Command)
    try {
        Get-Command $Command -ErrorAction Stop | Out-Null
        return $true
    }
    catch {
        return $false
    }
}

Write-ColorOutput "🚀 Starting One4Team deployment..." "Blue"
Write-ColorOutput "Environment: $Environment" "Yellow"
Write-ColorOutput "Version: $Version" "Yellow"
Write-ColorOutput "Docker Registry: $DockerRegistry" "Yellow"

# Check prerequisites
Write-Log "Checking prerequisites..."

if (-not (Test-Command "docker")) {
    Write-ErrorLog "Docker is not installed"
    exit 1
}

if (-not (Test-Command "kubectl")) {
    Write-ErrorLog "kubectl is not installed"
    exit 1
}

if (-not (Test-Command "helm")) {
    Write-ErrorLog "Helm is not installed"
    exit 1
}

Write-Log "Prerequisites check passed"

# Set up environment-specific variables
if ($Environment -eq "production") {
    $Namespace = "one4team-production"
    $Domain = "one4team.app"
    $Replicas = 3
    $ResourcesCpu = "1000m"
    $ResourcesMemory = "2Gi"
}
else {
    $Namespace = "one4team-staging"
    $Domain = "staging.one4team.app"
    $Replicas = 1
    $ResourcesCpu = "500m"
    $ResourcesMemory = "1Gi"
}

# Create namespace if it doesn't exist
Write-Log "Creating namespace: $Namespace"
kubectl create namespace $Namespace --dry-run=client -o yaml | kubectl apply -f -

# Build Docker images
Write-Log "Building Docker images..."

# Build API image
Write-Log "Building API image..."
docker build -t one4team-api:$Version -f Apps/api/Dockerfile .

# Build Web image
Write-Log "Building Web image..."
docker build -t one4team-web:$Version -f Apps/web/Dockerfile .

# Tag images for registry
Write-Log "Tagging images for registry..."
docker tag one4team-api:$Version ${dockerRegistry}/one4team-api:$Version
docker tag one4team-web:$Version ${dockerRegistry}/one4team-web:$Version

# Tag latest
docker tag one4team-api:$Version ${dockerRegistry}/one4team-api:latest
docker tag one4team-web:$Version ${dockerRegistry}/one4team-web:latest

# Push images to registry
Write-Log "Pushing images to registry..."

# Push versioned images
docker push ${dockerRegistry}/one4team-api:$Version
docker push ${dockerRegistry}/one4team-web:$Version

# Push latest images
docker push ${dockerRegistry}/one4team-api:latest
docker push ${dockerRegistry}/one4team-web:latest

# Deploy to Kubernetes
Write-Log "Deploying to Kubernetes..."

# Deploy API
Write-Log "Deploying API..."
kubectl set image deployment/one4team-api -n $Namespace one4team-api=${dockerRegistry}/one4team-api:$Version

# Deploy Web
Write-Log "Deploying Web..."
kubectl set image deployment/one4team-web -n $Namespace one4team-web=${dockerRegistry}/one4team-web:$Version

# Wait for deployments to be ready
Write-Log "Waiting for deployments to be ready..."
kubectl rollout status deployment/one4team-api -n $Namespace
kubectl rollout status deployment/one4team-web -n $Namespace

# Run health checks
Write-Log "Running health checks..."

# Check API health
$ApiHealthUrl = "https://api.$Domain/health"
Write-Log "Checking API health at: $ApiHealthUrl"

for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri $ApiHealthUrl -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Log "API health check passed"
            break
        }
    }
    catch {
        if ($i -eq 30) {
            Write-ErrorLog "API health check failed after 30 attempts"
            exit 1
        }
        Write-Log "API health check attempt $i/30 failed, retrying in 10 seconds..."
        Start-Sleep -Seconds 10
    }
}

# Check Web health
$WebHealthUrl = "https://$Domain/health"
Write-Log "Checking Web health at: $WebHealthUrl"

for ($i = 1; $i -le 30; $i++) {
    try {
        $response = Invoke-WebRequest -Uri $WebHealthUrl -UseBasicParsing -TimeoutSec 10
        if ($response.StatusCode -eq 200) {
            Write-Log "Web health check passed"
            break
        }
    }
    catch {
        if ($i -eq 30) {
            Write-ErrorLog "Web health check failed after 30 attempts"
            exit 1
        }
        Write-Log "Web health check attempt $i/30 failed, retrying in 10 seconds..."
        Start-Sleep -Seconds 10
    }
}

# Run smoke tests
Write-Log "Running smoke tests..."

# Test API endpoints
Write-Log "Testing API endpoints..."
try {
    Invoke-WebRequest -Uri "https://api.$Domain/" -UseBasicParsing -TimeoutSec 10 | Out-Null
    Invoke-WebRequest -Uri "https://api.$Domain/api-docs" -UseBasicParsing -TimeoutSec 10 | Out-Null
}
catch {
    Write-ErrorLog "API endpoints test failed"
    exit 1
}

# Test Web endpoints
Write-Log "Testing Web endpoints..."
try {
    Invoke-WebRequest -Uri "https://$Domain/" -UseBasicParsing -TimeoutSec 10 | Out-Null
    Invoke-WebRequest -Uri "https://$Domain/health" -UseBasicParsing -TimeoutSec 10 | Out-Null
}
catch {
    Write-ErrorLog "Web endpoints test failed"
    exit 1
}

Write-Log "Smoke tests passed"

# Update monitoring
Write-Log "Updating monitoring configuration..."

# Update Prometheus targets
kubectl apply -f monitoring/prometheus.yml -n $Namespace

# Update Grafana dashboards
kubectl apply -f monitoring/grafana-dashboards.yml -n $Namespace

# Send notification
Write-Log "Sending deployment notification..."

# Slack notification (if webhook is configured)
if ($env:SLACK_WEBHOOK_URL) {
    $slackPayload = @{
        text = "🚀 One4Team deployment successful!"
        attachments = @(
            @{
                color = "good"
                fields = @(
                    @{ title = "Environment"; value = $Environment; short = $true },
                    @{ title = "Version"; value = $Version; short = $true },
                    @{ title = "Domain"; value = $Domain; short = $true }
                )
            }
        )
    } | ConvertTo-Json -Depth 10

    try {
        Invoke-RestMethod -Uri $env:SLACK_WEBHOOK_URL -Method Post -Body $slackPayload -ContentType "application/json"
    }
    catch {
        Write-ErrorLog "Failed to send Slack notification"
    }
}

# Email notification
if (Test-Command "Send-MailMessage") {
    try {
        Send-MailMessage -To $emailRecipients -Subject "One4Team $Environment Deployment - $Version" -Body "Deployment completed successfully" -From "noreply@one4team.com"
    }
    catch {
        Write-ErrorLog "Failed to send email notification"
    }
}

# Clean up old images (keep last 5 versions)
Write-Log "Cleaning up old Docker images..."
try {
    $oldApiImages = docker images ${dockerRegistry}/one4team-api --format "table {{.Tag}}" | Select-String -NotMatch "latest" | Select-Object -Skip 5
    foreach ($image in $oldApiImages) {
        docker rmi "${dockerRegistry}/one4team-api:$($image.Line.Trim())" 2>$null
    }

    $oldWebImages = docker images ${dockerRegistry}/one4team-web --format "table {{.Tag}}" | Select-String -NotMatch "latest" | Select-Object -Skip 5
    foreach ($image in $oldWebImages) {
        docker rmi "${dockerRegistry}/one4team-web:$($image.Line.Trim())" 2>$null
    }
}
catch {
    Write-Log "Cleanup completed (some images may not exist)"
}

# Log deployment completion
Write-Log "Deployment completed successfully!"
$logEntry = "$(Get-Date): One4Team $Environment deployment completed - Version $Version"
Add-Content -Path "deployment.log" -Value $logEntry

Write-ColorOutput "✅ Deployment completed successfully!" "Green"
Write-ColorOutput "🌐 API: https://api.$Domain" "Blue"
Write-ColorOutput "🌐 Web: https://$Domain" "Blue"
Write-ColorOutput "📊 Monitoring: https://monitoring.$Domain" "Blue" 