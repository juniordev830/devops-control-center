import { createServer } from 'node:http';
import { pathToFileURL } from 'node:url';
import { DASHBOARD_HTML, DASHBOARD_JS } from './dashboard.mjs';

const environments = new Set(['local', 'staging', 'production-simulation']);

export function createLabServer({ environment = 'local' } = {}) {
  if (!environments.has(environment)) throw new Error('Invalid lab environment');
  return createServer((request, response) => {
    response.setHeader('Content-Type', 'application/json; charset=utf-8');
    response.setHeader('Cache-Control', 'no-store');
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
    if (request.method !== 'GET') {
      response.writeHead(405, { Allow: 'GET' });
      response.end(JSON.stringify({ error: 'method_not_allowed' }));
      return;
    }
    if (request.url === '/') {
      response.setHeader('Content-Type', 'text/html; charset=utf-8');
      response.end(DASHBOARD_HTML);
      return;
    }
    if (request.url === '/dashboard.js') {
      response.setHeader('Content-Type', 'text/javascript; charset=utf-8');
      response.end(DASHBOARD_JS);
      return;
    }
    if (request.url === '/api/runtime') {
      response.end(JSON.stringify({
        status: 'ok', service: 'cloud-devops-lab', environment,
        observedAt: new Date().toISOString(),
        nodeVersion: process.versions.node,
        uptimeSeconds: Math.floor(process.uptime()),
        memoryRssBytes: process.memoryUsage().rss,
      }));
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
