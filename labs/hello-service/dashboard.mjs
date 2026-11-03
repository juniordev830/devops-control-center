export const DASHBOARD_HTML = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Cloud DevOps Lab · Infraestrutura observável</title>
<style>
:root{color-scheme:dark;--bg:#0a1020;--panel:#111b30;--line:#26334c;--text:#edf3ff;--muted:#a7b7d2;--accent:#74d9c6}
*{box-sizing:border-box}body{margin:0;background:radial-gradient(ellipse at top right,#16344b 0,transparent 55%),var(--bg);color:var(--text);font:16px/1.6 system-ui,sans-serif}
main{max-width:1180px;margin:auto;padding:38px 28px 64px}a{color:#99c9ff;text-underline-offset:4px}button{font:inherit;color:var(--text);background:#1d3554;border:1px solid #4a729d;border-radius:10px;padding:10px 18px;cursor:pointer}button:disabled{opacity:.65;cursor:wait}button:focus-visible,a:focus-visible{outline:3px solid var(--accent);outline-offset:4px}
header{display:flex;justify-content:space-between;gap:24px;align-items:center;padding-bottom:28px;border-bottom:1px solid var(--line)}.eyebrow{color:var(--accent);font-size:12px;letter-spacing:.15em;font-weight:700;text-transform:uppercase}h1{font-size:clamp(28px,5vw,46px);line-height:1.2;margin:8px 0 12px;letter-spacing:-.035em}h2{font-size:21px;margin:0 0 8px}p{margin:0 0 12px}.muted{color:var(--muted)}.pill{display:inline-flex;border:1px solid #365570;border-radius:30px;padding:4px 12px;font-size:12px;color:#b6d6f6;white-space:nowrap}
.notice{margin:24px 0;border-left:3px solid var(--accent);padding:12px 18px;background:#102b33;border-radius:0 10px 10px 0}
.cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px;margin:24px 0}.card,.panel{background:linear-gradient(145deg,#15223a,#10192c);border:1px solid var(--line);border-radius:16px;padding:22px}.label{font-size:13px;color:var(--muted)}.value{font-size:27px;font-weight:700;margin:12px 0 4px;overflow-wrap:anywhere}.small{font-size:12px;color:var(--muted)}[data-state="ok"]{color:var(--accent)}[data-state="unknown"]{color:#ffd187}.columns{display:grid;grid-template-columns:1.35fr 1fr;gap:20px;margin:24px 0}.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:14px;margin-top:18px}th,td{text-align:left;padding:13px 6px;border-bottom:1px solid var(--line)}th{color:var(--muted);font-size:12px}code{font-size:12px;color:#bed5fa}.policy{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;margin:20px 0}.policy strong{font-size:22px;display:block}.policy div{background:#0c1628;border-radius:10px;padding:15px 10px}.steps{display:flex;flex-wrap:wrap;gap:10px;list-style:none;padding:0;margin:20px 0}.steps li{border:1px solid var(--line);border-radius:9px;padding:9px 12px;color:#bed5fa;font-size:13px}.links{display:flex;flex-wrap:wrap;gap:20px;margin-top:20px}footer{margin-top:30px;border-top:1px solid var(--line);padding-top:20px;font-size:13px;color:var(--muted)}
@media(max-width:850px){.cards{grid-template-columns:repeat(2,1fr)}.columns{grid-template-columns:1fr}}
@media(max-width:480px){main{padding:24px 16px}header{align-items:flex-start;flex-direction:column}.cards{grid-template-columns:1fr}.policy{grid-template-columns:1fr}.card,.panel{padding:18px}}
</style>
<script src="/dashboard.js" defer></script>
</head>
<body>
<main>
<header><div><div class="eyebrow">Engenharia de plataformas · Portfólio</div><h1>Cloud DevOps Lab</h1><p class="muted">Ambientes reproduzíveis. Evidências verificáveis.</p></div><span class="pill">Laboratório local · sem nuvem provisionada</span></header>
<div class="notice">As métricas abaixo vêm desta instância Node.js. Os outros perfis e a política Docker representam configuração declarada; seus estados não são consultados por este painel.</div>
<section aria-label="Métricas da instância" class="cards">
<article class="card"><div class="label">Saúde desta instância</div><div class="value" id="health" data-state="unknown" role="status">Consultando</div><div class="small" id="observed">Aguardando resposta do serviço</div></article>
<article class="card"><div class="label">Perfil desta instância</div><div class="value" id="environment">—</div><div class="small">Identidade retornada pelo serviço</div></article>
<article class="card"><div class="label">Memória do processo · RSS</div><div class="value" id="memory">—</div><div class="small">Uso atual do processo, sem incluir outros containers</div></article>
<article class="card"><div class="label">Tempo do processo</div><div class="value" id="uptime">—</div><div class="small" id="runtime">Runtime Node.js</div></article>
</section>
<div><button id="refresh" type="button">Atualizar métricas</button><span class="small"> · Consulta automática a cada 15 segundos</span></div>
<div class="columns">
<section class="panel"><h2>Perfis configurados</h2><p class="muted">Portas publicadas em loopback e recursos Compose separados.</p><div class="table-wrap"><table><caption class="small">Configuração do laboratório; sem leitura de saúde dos outros perfis.</caption><thead><tr><th scope="col">Ambiente</th><th scope="col">Porta no host</th><th scope="col">Tipo</th></tr></thead><tbody><tr><td>Local</td><td><code>127.0.0.1:8080</code></td><td>Desenvolvimento</td></tr><tr><td>Staging</td><td><code>127.0.0.1:8081</code></td><td>Homologação</td></tr><tr><td>Produção simulada</td><td><code>127.0.0.1:8082</code></td><td>Simulação</td></tr></tbody></table></div></section>
<section class="panel"><h2>Política declarada no Compose</h2><p class="muted">O CI verifica os valores reais com Docker inspect.</p><div class="policy"><div><strong>128 MiB</strong><span class="small">Memória máxima</span></div><div><strong>0,5</strong><span class="small">Núcleo de CPU</span></div><div><strong>100</strong><span class="small">Processos</span></div></div><p class="small">Usuário não privilegiado · filesystem somente leitura · capabilities removidas · no-new-privileges</p></section>
</div>
<section class="panel"><h2>Do código à evidência</h2><p class="muted">Validação automatizada em runners descartáveis do GitHub Actions.</p><ol class="steps"><li>1. Testes de contrato</li><li>2. Build Docker</li><li>3. Três ambientes simultâneos</li><li>4. Isolamento e limpeza</li></ol><p class="small">O teste desliga staging e confirma que os demais ambientes continuam respondendo. Consulte os logs para o resultado de cada execução.</p><div class="links"><a href="https://github.com/juniordev830/devops-control-center/actions">Ver execuções do CI</a><a href="https://github.com/juniordev830/devops-control-center/pull/3">Revisar implementação</a><a href="https://github.com/juniordev830/devops-control-center/blob/feature/cloud-devops-lab-rebuild/docs/environment-profiles.md">Ler arquitetura dos ambientes</a></div></section>
<footer>Projeto de João Junior · JavaScript, Node.js, Docker, CI/CD e engenharia de plataformas.<br>Sem credenciais no navegador, sem provisionamento de nuvem e sem telemetria inventada.</footer>
</main>
</body>
</html>`;

export const DASHBOARD_JS = `const byId = id => document.getElementById(id);
let loading = false;

async function refresh() {
  if (loading) return;
  loading = true;
  byId('refresh').disabled = true;
  try {
    const response = await fetch('/api/runtime', { cache: 'no-store', signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error('Não foi possível consultar a instância');
    const data = await response.json();
    if (data.status !== 'ok' || !Number.isFinite(data.memoryRssBytes) || data.memoryRssBytes <= 0 ||
        !Number.isFinite(data.uptimeSeconds) || data.uptimeSeconds < 0 ||
        typeof data.environment !== 'string' || typeof data.nodeVersion !== 'string' ||
        !Number.isFinite(Date.parse(data.observedAt))) {
      throw new Error('Resposta de métricas inválida');
    }
    byId('health').textContent = 'Respondendo';
    byId('health').dataset.state = 'ok';
    byId('environment').textContent = data.environment;
    byId('memory').textContent = (data.memoryRssBytes / 1048576).toFixed(1) + ' MiB';
    byId('uptime').textContent = Math.floor(data.uptimeSeconds / 60) + ' min ' + data.uptimeSeconds % 60 + ' s';
    byId('runtime').textContent = 'Node.js ' + data.nodeVersion;
    byId('observed').textContent = 'Consultado às ' + new Date(data.observedAt).toLocaleTimeString('pt-BR');
  } catch {
    byId('health').textContent = 'Sem confirmação';
    byId('health').dataset.state = 'unknown';
    for (const id of ['environment', 'memory', 'uptime']) byId(id).textContent = '—';
    byId('runtime').textContent = 'Runtime não confirmado';
    byId('observed').textContent = 'A consulta falhou. Tente atualizar as métricas.';
  } finally {
    loading = false;
    byId('refresh').disabled = false;
  }
}
byId('refresh').addEventListener('click', refresh);
refresh();
setInterval(refresh, 15000);
`;
