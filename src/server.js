import { createServer } from 'node:http';

const samplePipelines = Object.freeze([
  { id: 101, repository: 'sample-api', status: 'success', durationSeconds: 92 },
  { id: 102, repository: 'sample-web', status: 'failure', durationSeconds: 18 },
  { id: 103, repository: 'sample-worker', status: 'running', durationSeconds: 12 },
]);

export function createApp(pipelines = samplePipelines) {
  return createServer((req, res) => {
    const url = new URL(req.url ?? '/', 'http://127.0.0.1');
    res.setHeader('content-type', 'application/json; charset=utf-8');
    if (req.method !== 'GET') {
      res.writeHead(405); res.end(JSON.stringify({ error: 'method not allowed' })); return;
    }
    if (url.pathname === '/health') {
      res.end(JSON.stringify({ status: 'ok' })); return;
    }
    if (url.pathname.startsWith('/api/pipelines/')) {
      const rawId = url.pathname.slice('/api/pipelines/'.length);
      if (!/^[1-9]\d*$/.test(rawId)) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'invalid pipeline id' })); return;
      }
      const pipeline = pipelines.find(item => item.id === Number(rawId));
      if (!pipeline) {
        res.writeHead(404); res.end(JSON.stringify({ error: 'pipeline not found' })); return;
      }
      res.end(JSON.stringify({ demo: true, pipeline })); return;
    }
    if (url.pathname === '/api/pipelines') {
      const status = url.searchParams.get('status');
      const repository = (url.searchParams.get('repository') ?? '').trim().toLowerCase();
      if (status && !['success', 'failure', 'running'].includes(status)) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'invalid status' })); return;
      }
      if (repository.length > 100) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'repository filter too long' })); return;
      }
      const limitRaw = url.searchParams.get('limit');
      const offsetRaw = url.searchParams.get('offset');
      if (limitRaw !== null && (!/^[1-9]\d*$/.test(limitRaw) || Number(limitRaw) > 100)) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'limit must be between 1 and 100' })); return;
      }
      if (offsetRaw !== null && (!/^(0|[1-9]\d*)$/.test(offsetRaw) || Number(offsetRaw) > 100000)) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'offset must be between 0 and 100000' })); return;
      }
      const entries = pipelines.filter(item =>
        (!status || item.status === status) &&
        (!repository || item.repository.toLowerCase().includes(repository))
      );
      const offset = offsetRaw === null ? 0 : Number(offsetRaw);
      const limit = limitRaw === null ? entries.length : Number(limitRaw);
      const page = entries.slice(offset, offset + limit);
      res.end(JSON.stringify({
        demo: true,
        pipelines: page,
        pagination: { total: entries.length, offset, limit: limitRaw === null ? null : limit, hasNext: offset + page.length < entries.length },
      })); return;
    }
    if (url.pathname === '/api/summary') {
      const counts = { success: 0, failure: 0, running: 0 };
      for (const pipeline of pipelines) {
        if (Object.hasOwn(counts, pipeline.status)) counts[pipeline.status]++;
      }
      const completed = counts.success + counts.failure;
      const successRate = completed ? Math.round((counts.success / completed) * 10000) / 100 : null;
      res.end(JSON.stringify({ demo: true, total: pipelines.length, counts, successRate })); return;
    }
    res.writeHead(404); res.end(JSON.stringify({ error: 'not found' }));
  });
}
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  createApp().listen(3000, '127.0.0.1', () => console.log('Demo API em http://127.0.0.1:3000'));
}
