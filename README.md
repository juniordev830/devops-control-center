# DevOps Control Center

API local para consultar e filtrar execuções de pipelines. O conjunto de dados atual é **demonstrativo**, não consulta GitHub Actions em tempo real. Endpoints: `GET /health` e `GET /api/pipelines?status=success|failure|running`.

O filtro opcional `repository` busca parte do nome sem diferenciar maiúsculas de minúsculas e pode ser combinado com `status`. O endpoint `GET /api/summary` informa o total, as contagens por estado e a taxa de sucesso das execuções concluídas. Quando não há execuções concluídas, `successRate` é `null`.

```bash
curl 'http://127.0.0.1:3000/api/pipelines?status=failure&repository=web'
curl http://127.0.0.1:3000/api/summary
```

## Estado

**MVP funcional / projeto inicial de portfólio.** Implementa o núcleo descrito abaixo, mas não é produto pronto para produção.

## Como executar

```bash
npm start
```

## Testes

```bash
npm test
```

O GitHub Actions executa os testes automaticamente em pushes e pull requests.

## Segurança e limitações

Escuta somente em `127.0.0.1`. Nenhuma credencial GitHub é solicitada; dados são fictícios. Ainda sem frontend, autenticação ou banco de dados.

## Evolução planejada

Adicionar cliente GitHub Actions de leitura com token de escopo mínimo, autenticação e painel React/TypeScript.

---
Projeto de Engenharia de Software mantido na conta [juniordev830](https://github.com/juniordev830).

## Paginação de pipelines

`GET /api/pipelines` aceita `limit` (1 a 100) e `offset` (0 a 100.000), após aplicar os filtros `repository` e `status`. O retorno continua incluindo `pipelines` e agora traz `pagination: { total, offset, limit, hasNext }`. Sem parâmetros de paginação, o comportamento anterior de retornar todos os itens filtrados é preservado e `limit` no metadado é `null`.

Exemplo: `GET /api/pipelines?status=success&limit=10&offset=0`. Valores malformados ou fora dos limites retornam HTTP 400.
