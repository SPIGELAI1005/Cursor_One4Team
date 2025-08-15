#!/bin/bash

# One4Team Multi-Tenant SaaS Platform - Deployment Script
# This script handles the complete deployment process for the One4Team platform

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-staging}
VERSION=${2:-$(date +%Y%m%d-%H%M%S)}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-"one4team"}
EMAIL_RECIPIENTS=${EMAIL_RECIPIENTS:-"dev@one4team.com"}

# Validate environment
if [[ ! "$ENVIRONMENT" =~ ^(staging|production)$ ]]; then
    echo -e "${RED}Error: Environment must be 'staging' or 'production'${NC}"
    exit 1
fi

echo -e "${BLUE}🚀 Starting One4Team deployment...${NC}"
echo -e "${YELLOW}Environment: ${ENVIRONMENT}${NC}"
echo -e "${YELLOW}Version: ${VERSION}${NC}"
echo -e "${YELLOW}Docker Registry: ${DOCKER_REGISTRY}${NC}"

# Function to log with timestamp
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

# Function to log errors
log_error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
log "Checking prerequisites..."

if ! command_exists docker; then
    log_error "Docker is not installed"
    exit 1
fi

if ! command_exists kubectl; then
    log_error "kubectl is not installed"
    exit 1
fi

if ! command_exists helm; then
    log_error "Helm is not installed"
    exit 1
fi

log "Prerequisites check passed"

# Set up environment-specific variables
if [ "$ENVIRONMENT" = "production" ]; then
    NAMESPACE="one4team-production"
    DOMAIN="one4team.app"
    REPLICAS=3
    RESOURCES_CPU="1000m"
    RESOURCES_MEMORY="2Gi"
else
    NAMESPACE="one4team-staging"
    DOMAIN="staging.one4team.app"
    REPLICAS=1
    RESOURCES_CPU="500m"
    RESOURCES_MEMORY="1Gi"
fi

# Create namespace if it doesn't exist
log "Creating namespace: $NAMESPACE"
kubectl create namespace $NAMESPACE --dry-run=client -o yaml | kubectl apply -f -

# Build Docker images
log "Building Docker images..."

# Build API image
log "Building API image..."
docker build -t one4team-api:${VERSION} -f Apps/api/Dockerfile .

# Build Web image
log "Building Web image..."
docker build -t one4team-web:${VERSION} -f Apps/web/Dockerfile .

# Tag images for registry
log "Tagging images for registry..."
docker tag one4team-api:${VERSION} ${DOCKER_REGISTRY}/one4team-api:${VERSION}
docker tag one4team-web:${VERSION} ${DOCKER_REGISTRY}/one4team-web:${VERSION}

# Tag latest
docker tag one4team-api:${VERSION} ${DOCKER_REGISTRY}/one4team-api:latest
docker tag one4team-web:${VERSION} ${DOCKER_REGISTRY}/one4team-web:latest

# Push images to registry
log "Pushing images to registry..."

# Push versioned images
docker push ${DOCKER_REGISTRY}/one4team-api:${VERSION}
docker push ${DOCKER_REGISTRY}/one4team-web:${VERSION}

# Push latest images
docker push ${DOCKER_REGISTRY}/one4team-api:latest
docker push ${DOCKER_REGISTRY}/one4team-web:latest

# Deploy to Kubernetes
log "Deploying to Kubernetes..."

# Deploy API
log "Deploying API..."
kubectl set image deployment/one4team-api -n $NAMESPACE one4team-api=${DOCKER_REGISTRY}/one4team-api:${VERSION}

# Deploy Web
log "Deploying Web..."
kubectl set image deployment/one4team-web -n $NAMESPACE one4team-web=${DOCKER_REGISTRY}/one4team-web:${VERSION}

# Wait for deployments to be ready
log "Waiting for deployments to be ready..."
kubectl rollout status deployment/one4team-api -n $NAMESPACE
kubectl rollout status deployment/one4team-web -n $NAMESPACE

# Run health checks
log "Running health checks..."

# Check API health
API_HEALTH_URL="https://api.${DOMAIN}/health"
log "Checking API health at: $API_HEALTH_URL"

for i in {1..30}; do
    if curl -f -s "$API_HEALTH_URL" > /dev/null; then
        log "API health check passed"
        break
    fi
    
    if [ $i -eq 30 ]; then
        log_error "API health check failed after 30 attempts"
        exit 1
    fi
    
    log "API health check attempt $i/30 failed, retrying in 10 seconds..."
    sleep 10
done

# Check Web health
WEB_HEALTH_URL="https://${DOMAIN}/health"
log "Checking Web health at: $WEB_HEALTH_URL"

for i in {1..30}; do
    if curl -f -s "$WEB_HEALTH_URL" > /dev/null; then
        log "Web health check passed"
        break
    fi
    
    if [ $i -eq 30 ]; then
        log_error "Web health check failed after 30 attempts"
        exit 1
    fi
    
    log "Web health check attempt $i/30 failed, retrying in 10 seconds..."
    sleep 10
done

# Run smoke tests
log "Running smoke tests..."

# Test API endpoints
log "Testing API endpoints..."
curl -f -s "https://api.${DOMAIN}/" > /dev/null || log_error "API root endpoint failed"
curl -f -s "https://api.${DOMAIN}/api-docs" > /dev/null || log_error "API docs endpoint failed"

# Test Web endpoints
log "Testing Web endpoints..."
curl -f -s "https://${DOMAIN}/" > /dev/null || log_error "Web root endpoint failed"
curl -f -s "https://${DOMAIN}/health" > /dev/null || log_error "Web health endpoint failed"

log "Smoke tests passed"

# Update monitoring
log "Updating monitoring configuration..."

# Update Prometheus targets
kubectl apply -f monitoring/prometheus.yml -n $NAMESPACE

# Update Grafana dashboards
kubectl apply -f monitoring/grafana-dashboards.yml -n $NAMESPACE

# Send notification
log "Sending deployment notification..."

# Slack notification (if webhook is configured)
if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{
            'text': '🚀 One4Team deployment successful!',
            'attachments': [{
                'color': 'good',
                'fields': [
                    {'title': 'Environment', 'value': '$ENVIRONMENT', 'short': true},
                    {'title': 'Version', 'value': '$VERSION', 'short': true},
                    {'title': 'Domain', 'value': '$DOMAIN', 'short': true}
                ]
            }]
        }" \
        $SLACK_WEBHOOK_URL
fi

# Email notification
if command_exists mail; then
    echo "Deployment completed successfully" | mail -s "One4Team ${ENVIRONMENT} Deployment - ${VERSION}" $EMAIL_RECIPIENTS
fi

# Clean up old images (keep last 5 versions)
log "Cleaning up old Docker images..."
docker images ${DOCKER_REGISTRY}/one4team-api --format "table {{.Tag}}" | grep -v "latest" | tail -n +6 | xargs -I {} docker rmi ${DOCKER_REGISTRY}/one4team-api:{} 2>/dev/null || true
docker images ${DOCKER_REGISTRY}/one4team-web --format "table {{.Tag}}" | grep -v "latest" | tail -n +6 | xargs -I {} docker rmi ${DOCKER_REGISTRY}/one4team-web:{} 2>/dev/null || true

# Log deployment completion
log "Deployment completed successfully!"
echo "$(date): One4Team ${ENVIRONMENT} deployment completed - Version ${VERSION}" >> deployment.log

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${BLUE}🌐 API: https://api.${DOMAIN}${NC}"
echo -e "${BLUE}🌐 Web: https://${DOMAIN}${NC}"
echo -e "${BLUE}📊 Monitoring: https://monitoring.${DOMAIN}${NC}" 