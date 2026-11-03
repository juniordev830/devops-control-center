import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';

const root = new URL('../labs/hello-service/server.mjs', import.meta.url);

test('lab responds with health and rejects unknown routes', async () => {
  const child = spawn(process.execPath, [root.pathname], { stdio: 'ignore' });
  try {
    let ready = false;
    for (let attempt = 0; attempt < 40; attempt++) {
      if (child.exitCode !== null) throw new Error('lab exited unexpectedly');
      try {
        const response = await fetch('http://127.0.0.1:8080/health');
        if (response.ok) { ready = true; break; }
      } catch {}
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(ready, 'health endpoint did not start');
    const health = await fetch('http://127.0.0.1:8080/health');
    assert.deepEqual(await health.json(), { status: 'ok', service: 'cloud-devops-lab' });
    assert.equal((await fetch('http://127.0.0.1:8080/unknown')).status, 404);
  } finally {
    child.kill('SIGTERM');
  }
});
