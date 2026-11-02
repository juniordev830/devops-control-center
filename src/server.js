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
    if (url.pathname === '/api/pipelines') {
      const status = url.searchParams.get('status');
      if (status && !['success', 'failure', 'running'].includes(status)) {
        res.writeHead(400); res.end(JSON.stringify({ error: 'invalid status' })); return;
      }
      const entries = status ? pipelines.filter(item => item.status === status) : pipelines;
      res.end(JSON.stringify({ demo: true, pipelines: entries })); return;
    }
    res.writeHead(404); res.end(JSON.stringify({ error: 'not found' }));
  });
}
if (process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href) {
  createApp().listen(3000, '127.0.0.1', () => console.log('Demo API em http://127.0.0.1:3000'));
}
