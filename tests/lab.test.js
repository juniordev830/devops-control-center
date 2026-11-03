import test from 'node:test';
import assert from 'node:assert/strict';
import { once } from 'node:events';
import { createLabServer } from '../labs/hello-service/server.mjs';

async function start(environment) {
  const server = createLabServer({ environment });
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  return { server, url: `http://127.0.0.1:${server.address().port}` };
}

async function stop(server) {
  const closed = new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  server.closeAllConnections();
  await closed;
}

test('health identifies the environment and unknown routes return JSON', async () => {
  const { server, url } = await start('staging');
  try {
    const health = await fetch(`${url}/health`);
    assert.equal(health.status, 200);
    assert.match(health.headers.get('content-type'), /application\/json/);
    assert.equal(health.headers.get('cache-control'), 'no-store');
    assert.deepEqual(await health.json(), { status: 'ok', service: 'cloud-devops-lab', environment: 'staging' });
    const missing = await fetch(`${url}/unknown`);
    assert.equal(missing.status, 404);
    assert.deepEqual(await missing.json(), { error: 'not_found' });
  } finally { await stop(server); }
});

test('write methods are rejected without changing health', async () => {
  const { server, url } = await start('local');
  try {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
      const response = await fetch(`${url}/health`, { method });
      assert.equal(response.status, 405);
      assert.equal(response.headers.get('allow'), 'GET');
      assert.deepEqual(await response.json(), { error: 'method_not_allowed' });
    }
    assert.equal((await fetch(`${url}/health`)).status, 200);
  } finally { await stop(server); }
});

test('stopping staging leaves local and production simulation healthy', async () => {
  const entries = [];
  try {
    for (const environment of ['local', 'staging', 'production-simulation']) {
      entries.push({ environment, ...await start(environment) });
    }
    assert.equal(new Set(entries.map(entry => entry.url)).size, 3);
    for (const entry of entries) {
      assert.equal((await (await fetch(`${entry.url}/health`)).json()).environment, entry.environment);
    }
    await stop(entries[1].server);
    await assert.rejects(fetch(`${entries[1].url}/health`));
    for (const entry of [entries[0], entries[2]]) {
      assert.equal((await (await fetch(`${entry.url}/health`)).json()).environment, entry.environment);
    }
  } finally {
    for (const entry of entries) if (entry.server.listening) await stop(entry.server);
  }
});

test('invalid environment names fail before opening a listener', () => {
  for (const environment of ['', 'production', 'invalid', null]) {
    assert.throws(() => createLabServer({ environment }), /Invalid lab environment/);
  }
});
