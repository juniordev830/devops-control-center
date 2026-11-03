# Ambientes do laboratório

Este laboratório demonstra **configuração declarativa** sem provisionar recursos pagos.

| Ambiente | Uso | Exposição | Política |
|---|---|---|---|
| local | desenvolvimento e testes | 127.0.0.1:8080 | Docker Compose |
| staging | validação pré-produção | nenhuma por padrão | requer aprovação para deploy |
| production | referência de arquitetura | nenhuma por padrão | requer revisão, segredos externos e aprovação |

## Operação local

```sh
docker compose -f labs/hello-service/compose.yaml config --quiet
docker compose -f labs/hello-service/compose.yaml up --build -d
curl --fail http://127.0.0.1:8080/health
docker compose -f labs/hello-service/compose.yaml down
```

## Segurança

O container usa usuário não privilegiado, filesystem somente leitura, remoção de capabilities e healthcheck. Não coloque tokens em arquivos versionados. O laboratório não cria serviços AWS, Azure ou GCP automaticamente.
