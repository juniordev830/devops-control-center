# Simulação manual de produção

O workflow [Manual production simulation](../.github/workflows/production-simulation.yml) executa somente um container local no runner do GitHub Actions. Não provisiona nuvem, não publica imagens e não faz release.

## Acionamento

Depois que o workflow estiver registrado na branch padrão, abra **Actions → Manual production simulation → Run workflow**, escolha a branch a testar e marque a confirmação de simulação. A confirmação desmarcada interrompe o job inicial.

Enquanto a implementação estiver apenas na PR #3 em rascunho, o botão pode não estar disponível. A inclusão na branch padrão não é realizada automaticamente por esta entrega.

O job de execução referencia o GitHub Environment `production-simulation`. Regras de proteção e revisores obrigatórios, **se configurados nesse Environment**, são aplicados pelo GitHub. Esta entrega não inspecionou nem alterou regras de proteção; portanto, não afirma que exista aprovação humana obrigatória. Marcar a confirmação do workflow é uma escolha de execução, não substitui revisão ou regras do Environment.

## O que é verificado

- Testes de contrato do serviço Node.js.
- Identidade `production-simulation` no endpoint de saúde.
- Porta 8082 publicada somente em loopback.
- Usuário não privilegiado, filesystem somente leitura, capabilities removidas e `no-new-privileges`.
- Limites reais de memória, CPU e processos.
- Remoção dos containers e redes após o teste.

A lógica Docker é a mesma de `node scripts/verify-environments.mjs production-simulation`, também executada pelo CI automático. O CI valida a rotina de simulação; ele não comprova o acionamento manual nem as políticas de aprovação do Environment.

## Evidência

Uma execução manual bem-sucedida registra um resumo na página do job. Os logs mostram os IDs dos recursos locais, os testes e a limpeza. Consulte a aba Actions para o resultado de cada execução; a existência deste arquivo não é prova de deploy ou aprovação de produção.
