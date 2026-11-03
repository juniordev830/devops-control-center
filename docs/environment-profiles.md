# Perfis de ambiente

Os três perfis executam no mesmo host Docker. Nenhum recurso de nuvem é provisionado.

| Perfil | Projeto Compose manual | LAB_ENVIRONMENT | Porta no host |
| --- | --- | --- | --- |
| Desenvolvimento | devops-local | local | 127.0.0.1:8080 |
| Homologação | devops-staging | staging | 127.0.0.1:8081 |
| Produção simulada | devops-production | production-simulation | 127.0.0.1:8082 |

Exemplo para homologação, a partir da raiz do repositório:

```sh
COMPOSE_PROJECT_NAME=devops-staging LAB_PORT=8081 LAB_ENVIRONMENT=staging docker compose -f labs/hello-service/compose.yaml up --build -d --wait
curl --fail http://127.0.0.1:8081/health
COMPOSE_PROJECT_NAME=devops-staging LAB_PORT=8081 LAB_ENVIRONMENT=staging docker compose -f labs/hello-service/compose.yaml down
```

A resposta de saúde identifica o ambiente: `{"status":"ok","service":"cloud-devops-lab","environment":"staging"}`.
Troque as três variáveis conforme a tabela para os outros perfis.

## Verificação automática de isolamento

```sh
node scripts/verify-environments.mjs
```

Esse comando constrói e inicia os três ambientes simultaneamente; reserve as portas 8080–8082. Ele verifica:

- Identidade de cada ambiente no JSON de saúde.
- Containers e redes diferentes, com porta publicada somente em loopback.
- Usuário não privilegiado, filesystem somente leitura, capacidades removidas e proibição de novos privilégios.
- Limites reais de 128 MiB, 0,5 CPU e 100 processos no Docker.
- Desligamento de homologação sem interromper os outros dois ambientes.
- Remoção dos containers e das redes do teste, inclusive após falhas.

Os projetos de teste recebem um sufixo exclusivo por execução. Isso evita remover projetos manuais com os nomes da tabela. Uma porta já ocupada faz a verificação falhar; ela não é liberada à força. A saída JSON contém as evidências de execução e fica disponível nos logs do CI.

Somente produção simulada: `node scripts/verify-environments.mjs production-simulation`. Esse modo não executa o teste de desligamento de homologação.

## Limites

As redes Compose são diferentes, mas os containers ainda podem acessar portas publicadas no host e sair para a internet. Isso demonstra separação de recursos, não uma fronteira de segurança entre tenants. Os perfis não oferecem implantação em nuvem, alta disponibilidade, gestão de segredos nem aprovação de produção. O script deve ser executado em uma máquina de laboratório ou runner descartável.
