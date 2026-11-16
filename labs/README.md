# Laboratorios opcionais de automacao

Os exemplos sao independentes do servidor Node existente. Nao modificam rotas ou configuracao de producao.

- PowerShell: diagnostico de observacoes JSON com validacao de entrada e classificacao de indisponibilidade/latencia. Teste: pwsh -File labs/powershell/Test-DeploymentHealth.ps1
- Groovy: politica deterministica de alertas por taxa de falhas e P95. Teste: groovy -cp labs/groovy labs/groovy/TestHealthPolicy.groovy

Execute os comandos a partir da raiz deste repositorio. Requer PowerShell 7+ e Groovy 4+ respectivamente.
