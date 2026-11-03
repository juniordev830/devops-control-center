import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';

const environments = new Set(['local', 'staging', 'production-simulation']);

export function createLabServer({ environment = 'local' } = {}) {
  if (!environments.has(environment)) throw new Error('Invalid lab environment');
  return createServer((request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    if (request.method !== 'GET') {
      response.writeHead(405, { Allow: 'GET' });
      response.end(JSON.stringify({ error: 'method_not_allowed' }));
      return;
    }
    if (request.url === '/health') {
      response.writeHead(200);
      response.end(JSON.stringify({ status: 'ok', service: 'cloud-devops-lab', environment }));
      return;
    }
    response.writeHead(404);
    response.end(JSON.stringify({ error: 'not_found' }));
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  createLabServer({ environment: process.env.LAB_ENVIRONMENT || 'local' })
    .listen(8080, process.env.LAB_HOST || '127.0.0.1');
}
