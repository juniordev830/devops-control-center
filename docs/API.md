# API — src/server.js monta o servidor com rotas de saúde e consulta de execuções. O conjunto demonstrativo permite exercitar os filtros sem acesso a uma integração externa.

A API usa uma amostra congelada de execuções. O processo iniciado pelo arquivo escuta apenas em 127.0.0.1:3000. As respostas de negócio incluem o campo demo com valor true.

| Recurso | Comportamento |
| --- | --- |
| `GET /health` | Retorna o estado básico do servidor. |
| `GET /api/pipelines` | Filtra por status e por parte do nome do repositório. Aceita limit de 1 a 100 e offset de 0 a 100.000. |
| `GET /api/pipelines/{id}` | Consulta um identificador inteiro positivo. A resposta é 404 quando o registro está ausente. |
| `GET /api/summary` | Conta execuções por estado. Calcula a taxa de sucesso entre as finalizadas e usa null quando ainda não há execuções concluídas. |

```bash
curl 'http://127.0.0.1:3000/api/pipelines?status=success&limit=5'
```

Os filtros e identificadores inválidos produzem 400. Métodos diferentes de GET produzem 405.

Implementação em [src/server.js](../src/server.js). [Guia do código](ENGENHARIA_REVERSA.md).
