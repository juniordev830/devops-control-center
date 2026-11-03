import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

test('health and filtering demo pipelines', async () => {
  const server = createApp().listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const url = `http://127.0.0.1:${server.address().port}`;
    const health = await (await fetch(`${url}/health`)).json();
    assert.equal(health.status, 'ok');
    const result = await (await fetch(`${url}/api/pipelines?status=failure`)).json();
    assert.equal(result.demo, true);
    assert.equal(result.pipelines.length, 1);
    const detailResponse = await fetch(`${url}/api/pipelines/102`);
    const detail = await detailResponse.json();
    assert.equal(detail.pipeline.repository, 'sample-web');
    assert.equal((await fetch(`${url}/api/pipelines/999`)).status, 404);
    assert.equal((await fetch(`${url}/api/pipelines/nope`)).status, 400);
    assert.equal((await fetch(`${url}/api/pipelines?status=unknown`)).status, 400);
    assert.equal((await fetch(`${url}/not-found`)).status, 404);
    assert.equal((await fetch(`${url}/health`, { method: 'POST' })).status, 405);
  } finally { await new Promise(resolve => server.close(resolve)); }
});
