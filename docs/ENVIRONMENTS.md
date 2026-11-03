# Ambientes do laboratório

Este laboratório executa três perfis Docker no host local, sem provisionar recursos pagos.

| Ambiente | Uso | Exposição |
| --- | --- | --- |
| local | desenvolvimento e testes | 127.0.0.1:8080 |
| staging | homologação simulada | 127.0.0.1:8081 |
| production-simulation | produção simulada | 127.0.0.1:8082 |

Consulte [perfis e comandos completos](environment-profiles.md) para iniciar, verificar e remover cada ambiente.

## Operação local

```sh
docker compose -f labs/hello-service/compose.yaml config --quiet
docker compose -f labs/hello-service/compose.yaml up --build -d --wait
curl --fail http://127.0.0.1:8080/health
docker compose -f labs/hello-service/compose.yaml down
```

Sem Docker, `npm start` escuta somente em 127.0.0.1:8080. Dentro do container, o serviço escuta em 0.0.0.0 para permitir o encaminhamento da porta, publicada no host apenas em loopback.

## Segurança e recursos

O container usa usuário não privilegiado, filesystem somente leitura, remoção de capabilities, `no-new-privileges` e healthcheck. O Compose limita memória a **128 MiB**, CPU a **0,5 núcleo** e processos a **100**. A política de reinício é `unless-stopped`. São valores de demonstração, não um dimensionamento de produção.

Não coloque tokens em arquivos versionados. O laboratório não cria serviços AWS, Azure ou GCP. Não há implantação pública, aprovação obrigatória ou isolamento de rede absoluto entre perfis. Os limites e a separação de recursos são verificados por `scripts/verify-environments.mjs`.
