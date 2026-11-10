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
    assert.equal(result.pagination.total, 1);
    const first = await (await fetch(`${url}/api/pipelines?limit=1&offset=0`)).json();
    assert.deepEqual(first.pipelines.map(item => item.id), [101]);
    assert.deepEqual(first.pagination, { total: 3, offset: 0, limit: 1, hasNext: true });
    const second = await (await fetch(`${url}/api/pipelines?limit=1&offset=1`)).json();
    assert.deepEqual(second.pipelines.map(item => item.id), [102]);
    const empty = await (await fetch(`${url}/api/pipelines?limit=2&offset=99`)).json();
    assert.deepEqual(empty.pipelines, []);
    assert.equal(empty.pagination.total, 3);
    for (const query of ['limit=0', 'limit=101', 'limit=1.5', 'limit=abc', 'offset=-1', 'offset=100001', 'offset=2e1']) {
      assert.equal((await fetch(`${url}/api/pipelines?${query}`)).status, 400, query);
    }
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
