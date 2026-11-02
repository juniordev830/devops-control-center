import test from 'node:test';
import assert from 'node:assert/strict';
import { createApp } from '../src/server.js';

test('summarizes runs and combines repository and status filters', async () => {
  const pipelines = [
    { id: 1, repository: 'team/WEB', status: 'success', durationSeconds: 3 },
    { id: 2, repository: 'team/web', status: 'failure', durationSeconds: 2 },
    { id: 3, repository: 'team/api', status: 'running', durationSeconds: 1 },
  ];
  const server = createApp(pipelines).listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const base = `http://127.0.0.1:${server.address().port}`;
    const summary = await (await fetch(`${base}/api/summary`)).json();
    assert.deepEqual(summary, {
      demo: true, total: 3, counts: { success: 1, failure: 1, running: 1 }, successRate: 50,
    });
    const filtered = await (await fetch(`${base}/api/pipelines?status=failure&repository=WEB`)).json();
    assert.deepEqual(filtered.pipelines.map(item => item.id), [2]);
    assert.equal((await fetch(`${base}/api/pipelines?repository=${'x'.repeat(101)}`)).status, 400);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});

test('returns a null success rate when no runs are complete', async () => {
  const server = createApp([]).listen(0, '127.0.0.1');
  try {
    await new Promise(resolve => server.once('listening', resolve));
    const summary = await (await fetch(`http://127.0.0.1:${server.address().port}/api/summary`)).json();
    assert.equal(summary.total, 0);
    assert.equal(summary.successRate, null);
  } finally {
    await new Promise(resolve => server.close(resolve));
  }
});
