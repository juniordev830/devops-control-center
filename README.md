# Cloud DevOps Lab

Laboratório prático de engenharia de plataformas: ambientes reproduzíveis, containers e automação de validação. **Não é um monitor de GitHub Actions**: o Codax concentra o monitoramento de repositórios.

## Objetivos
- Construir ambientes de desenvolvimento locais isolados com Docker Compose.
- Validar infraestrutura e aplicações com pipelines CI.
- Demonstrar boas práticas de health checks, configuração e documentação.

## Primeiro laboratório: serviço de demonstração

```bash
docker compose -f labs/hello-service/compose.yaml up --build
curl http://127.0.0.1:8080/health
docker compose -f labs/hello-service/compose.yaml down
```

Requisitos: Docker Engine e Compose v2. A porta publicada fica vinculada a 127.0.0.1; nenhuma chave é necessária.

## Estrutura de migração

O projeto original tinha uma API de pipelines com dados demonstrativos. Esta branch inicia sua substituição por um laboratório de infraestrutura. Os arquivos legados ainda podem existir durante a migração; **não representam o produto final**. Não há implantação em nuvem ativa nem custos provisionados.

## Próximas entregas

Testes automatizados dos manifestos, matriz de ambientes e templates de infraestrutura como código. Toda implantação remota exigirá credenciais e autorização específicas.
