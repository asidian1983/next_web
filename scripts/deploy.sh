#!/bin/bash
# Usage: ./scripts/deploy.sh [environment] [image-tag]
# environment: dev|staging|prod
# image-tag: git SHA or 'latest'
#
# Make executable: chmod +x scripts/deploy.sh
set -euo pipefail

ENVIRONMENT=${1:-dev}
IMAGE_TAG=${2:-latest}
NAMESPACE="textile-ai"
REGISTRY_URL="${REGISTRY_URL:-}"

echo "Deploying to $ENVIRONMENT with tag $IMAGE_TAG"

# Validate environment
if [[ "$ENVIRONMENT" != "dev" && "$ENVIRONMENT" != "staging" && "$ENVIRONMENT" != "prod" ]]; then
  echo "Error: environment must be one of: dev, staging, prod"
  exit 1
fi

# Update image tags in manifests if a registry URL is provided
if [[ -n "$REGISTRY_URL" ]]; then
  echo "Updating image tags to $REGISTRY_URL/textile-ai/*:$IMAGE_TAG ..."
  sed -i.bak "s|image: textile-ai/web:.*|image: $REGISTRY_URL/textile-ai/web:$IMAGE_TAG|g" k8s/web/deployment.yaml
  sed -i.bak "s|image: textile-ai/api:.*|image: $REGISTRY_URL/textile-ai/api:$IMAGE_TAG|g" k8s/api/deployment.yaml
  sed -i.bak "s|image: textile-ai/ai:.*|image: $REGISTRY_URL/textile-ai/ai:$IMAGE_TAG|g" k8s/ai/deployment.yaml
  # Clean up backup files created by sed -i.bak
  rm -f k8s/web/deployment.yaml.bak k8s/api/deployment.yaml.bak k8s/ai/deployment.yaml.bak
fi

echo "Applying manifests in order..."

# 1. Namespace
kubectl apply -f k8s/namespace.yaml

# 2. ConfigMaps
kubectl apply -f k8s/api/configmap.yaml
kubectl apply -f k8s/web/configmap.yaml

# 3. Secrets (must exist before deployments; skip if already present to avoid overwriting)
kubectl apply -f k8s/api/deployment.yaml --dry-run=client -o name | grep -q secret && true

# 4. Storage
kubectl apply -f k8s/postgres/pvc.yaml
kubectl apply -f k8s/api/uploads-pvc.yaml

# 5. Postgres
kubectl apply -f k8s/postgres/deployment.yaml
kubectl apply -f k8s/postgres/service.yaml

echo "Waiting for postgres to be ready..."
kubectl rollout status deployment/postgres -n "$NAMESPACE" --timeout=120s

# 6. Redis
kubectl apply -f k8s/redis/deployment.yaml
kubectl apply -f k8s/redis/service.yaml

echo "Waiting for redis to be ready..."
kubectl rollout status deployment/redis -n "$NAMESPACE" --timeout=60s

# 7. AI service
kubectl apply -f k8s/ai/deployment.yaml
kubectl apply -f k8s/ai/service.yaml

echo "Waiting for ai to be ready..."
kubectl rollout status deployment/ai -n "$NAMESPACE" --timeout=300s

# 8. API
kubectl apply -f k8s/api/deployment.yaml
kubectl apply -f k8s/api/service.yaml
kubectl apply -f k8s/api/ingress.yaml
kubectl apply -f k8s/api/uploads-pvc.yaml
kubectl apply -f k8s/api/hpa.yaml
kubectl apply -f k8s/api/pdb.yaml

echo "Waiting for api to be ready..."
kubectl rollout status deployment/api -n "$NAMESPACE" --timeout=300s

# 9. Web
kubectl apply -f k8s/web/deployment.yaml
kubectl apply -f k8s/web/service.yaml
kubectl apply -f k8s/web/ingress.yaml
kubectl apply -f k8s/web/hpa.yaml
kubectl apply -f k8s/web/pdb.yaml

echo "Waiting for web to be ready..."
kubectl rollout status deployment/web -n "$NAMESPACE" --timeout=300s

echo ""
echo "Deploy complete. Running smoke tests..."
bash "$(dirname "$0")/health-check.sh"

echo ""
echo "Deployment to $ENVIRONMENT succeeded with tag $IMAGE_TAG."
