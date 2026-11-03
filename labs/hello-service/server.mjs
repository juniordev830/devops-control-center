import { createServer } from 'node:http';
const server = createServer((request, response) => {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (request.url === '/health' && request.method === 'GET') {
    response.writeHead(200);
    response.end(JSON.stringify({ status: 'ok', service: 'cloud-devops-lab' }));
    return;
  }
  response.writeHead(404);
  response.end(JSON.stringify({ error: 'not_found' }));
});
server.listen(8080, '0.0.0.0');
