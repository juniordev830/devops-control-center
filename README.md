# Cloud DevOps Lab

Laboratório prático de engenharia de plataformas: ambientes reproduzíveis, containers e automação de validação. **Não é um monitor de GitHub Actions**: o Codax concentra o monitoramento de repositórios.

## Visão para recrutadores

Este repositório demonstra competências práticas em **DevOps, engenharia de plataformas e automação de infraestrutura**. Cada funcionalidade tem evidências verificáveis no código e no GitHub Actions; o projeto não afirma possuir implantação em nuvem quando ela ainda não existe.

| Competência | Evidência verificável |
| --- | --- |
| Containers e Docker Compose | `labs/hello-service/Dockerfile` e `labs/hello-service/compose.yaml` |
| Segurança básica de containers | Usuário não-root, filesystem somente leitura, capacidades removidas e `no-new-privileges` |
| Controle de recursos | Limites de 128 MiB, 0,5 CPU e 100 PIDs, conferidos no CI |
| Integração contínua | `.github/workflows/ci.yml`: testes Node, build, execução e health checks |
| Observabilidade inicial | Endpoint HTTP `GET /health`, validado automaticamente |

**Como avaliar em cinco minutos:** execute `npm test`; depois, com Docker instalado, execute os comandos do primeiro laboratório abaixo. Consulte a aba **Actions** para ver os testes em execução e o histórico de resultados. As etapas de múltiplos ambientes, painel de infraestrutura e Terraform estão planejadas, mas ainda não devem ser tratadas como entregues.

## Objetivos
- Construir ambientes de desenvolvimento locais isolados com Docker Compose.
- Validar infraestrutura e aplicações com pipelines CI.
- Demonstrar boas práticas de health checks, configuração e documentação.

## Primeiro laboratório: serviço de demonstração

Execução sem Docker: `npm start` (porta 8080). Testes locais: `npm test`. O comando padrão agora executa o laboratório novo, não a antiga API de pipelines.

```bash
docker compose -f labs/hello-service/compose.yaml up --build
curl http://127.0.0.1:8080/health
docker compose -f labs/hello-service/compose.yaml down
```

Requisitos: Docker Engine e Compose v2. A porta publicada fica vinculada a 127.0.0.1; nenhuma chave é necessária.

## Estrutura de migração

O projeto original tinha uma API de pipelines com dados demonstrativos. Esta branch inicia sua substituição por um laboratório de infraestrutura. A API legada de pipelines e seus testes foram removidos nesta branch. O histórico Git permanece disponível. Não há implantação em nuvem ativa nem custos provisionados.

## Próximas entregas

Testes automatizados dos manifestos, matriz de ambientes e templates de infraestrutura como código. Toda implantação remota exigirá credenciais e autorização específicas.
