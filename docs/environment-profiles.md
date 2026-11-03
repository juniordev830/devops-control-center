# Environment profiles

These profiles demonstrate environment-specific configuration without provisioning cloud resources.

| Profile | Compose project | Host port | Purpose |
| --- | --- | --- | --- |
| Development | devops-local | 8080 | Local iteration |
| Staging | devops-staging | 8081 | Pre-release validation |
| Production simulation | devops-production | 8082 | Production-like smoke tests, **not a real deployment** |

Run one profile at a time from the repository root:

```sh
COMPOSE_PROJECT_NAME=devops-local LAB_PORT=8080 docker compose -f labs/hello-service/compose.yaml up --build -d
curl --fail http://127.0.0.1:8080/health
COMPOSE_PROJECT_NAME=devops-local LAB_PORT=8080 docker compose -f labs/hello-service/compose.yaml down
```

Replace the project name and port with the staging or production-simulation values above. Different project names isolate Docker Compose resources. All ports bind to localhost only; these profiles do not provide cloud deployment, secrets management, or production-grade availability.
