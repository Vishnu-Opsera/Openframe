helm dependency update deploy/helm/canvas
helm upgrade --install canvas deploy/helm/canvas -f deploy/helm/canvas/values.self-hosted.yaml
kubectl rollout undo deployment/api-gateway
