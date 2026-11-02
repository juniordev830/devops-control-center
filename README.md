# DevOps Control Center

API local para consultar e filtrar execuções de pipelines. O conjunto de dados atual é **demonstrativo**, não consulta GitHub Actions em tempo real. Endpoints: `GET /health` e `GET /api/pipelines?status=success|failure|running`.

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
