.PHONY: dev dev-logs build deploy health rollback

# Start all services locally with hot reload
dev:
	docker-compose up -d

# Tail logs for all local services
dev-logs:
	docker-compose logs -f

# Build production Docker images
build:
	docker build -t textile-ai/web:latest apps/web/
	docker build -t textile-ai/api:latest apps/api/
	docker build -t textile-ai/ai:latest apps/ai/

# Deploy to Kubernetes (applies all manifests via kustomize, then waits for rollouts)
deploy:
	kubectl apply -k k8s/
	kubectl rollout status deployment/web -n textile-ai
	kubectl rollout status deployment/api -n textile-ai
	kubectl rollout status deployment/ai -n textile-ai

# Run health checks against all services
health:
	bash scripts/health-check.sh

# Roll back all deployments one revision
rollback:
	kubectl rollout undo deployment/web -n textile-ai
	kubectl rollout undo deployment/api -n textile-ai
