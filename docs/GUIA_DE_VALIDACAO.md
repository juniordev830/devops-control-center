# Operação e qualidade — DevOps Control Center

## Escopo existente

API Node.js de pipelines demonstrativos, sem integração de execução real com GitHub Actions.

## Código e testes

`src/server.js`, `tests/server.test.js`, `tests/summary.test.js`, `package.json`.

## Reprodução local

`npm test` e script de início previsto em `package.json`; conferir `/health`, `/api/pipelines` e `/api/summary` em instância local.

Ao alterar funcionalidade, registrar no PR os comandos executados e os resultados; não tratar verificações não executadas como aprovadas.

## Cenários a incluir na regressão

Filtrar por status e repositório com resultados vazios; confirmar que successRate é null sem runs concluídos e que filtros não alteram os dados brutos.

## Riscos e evolução

Para integração real, implementar cliente autenticado, paginação, cache e rotulagem da origem. Não anunciar dados simulados como dados ao vivo.

### Checklist de entrega

- [ ] Novo comportamento ligado a caso de uso real.
- [ ] Testes e exemplo documentados, quando aplicável.
- [ ] Nenhum segredo ou dado de cliente adicionado.
- [ ] Código revisado em branch, sem merge automático.
