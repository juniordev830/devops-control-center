import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { randomUUID } from 'node:crypto';

const exec = promisify(execFile);
const profiles = [
  { name: 'local', project: 'local', port: 8080 },
  { name: 'staging', project: 'staging', port: 8081 },
  { name: 'production-simulation', project: 'production', port: 8082 },
];
const selection = process.argv[2] || 'all';
if (!['all', 'production-simulation'].includes(selection)) {
  throw new Error('Use all or production-simulation; this script only runs local Docker simulations.');
}
const selected = selection === 'all' ? profiles : profiles.filter(profile => profile.name === selection);
const suffix = process.env.GITHUB_RUN_ID
  ? `${process.env.GITHUB_RUN_ID}-${process.env.GITHUB_RUN_ATTEMPT || '1'}`
  : randomUUID().slice(0, 8);
const entries = selected.map(profile => ({ ...profile, project: `devops-${profile.project}-${suffix}` }));
const file = 'labs/hello-service/compose.yaml';

async function compose(entry, ...args) {
  return exec('docker', ['compose', '-p', entry.project, '-f', file, ...args], {
    env: { ...process.env, LAB_PORT: String(entry.port), LAB_ENVIRONMENT: entry.name },
    timeout: 180000, maxBuffer: 4 * 1024 * 1024,
  });
}

async function health(entry) {
  const response = await fetch(`http://127.0.0.1:${entry.port}/health`, { signal: AbortSignal.timeout(2000) });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', service: 'cloud-devops-lab', environment: entry.name });
}

async function waitForHealth(entry) {
  let lastError;
  for (let attempt = 0; attempt < 30; attempt++) {
    try { await health(entry); return; } catch (error) { lastError = error; }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error(`${entry.name} did not become healthy`, { cause: lastError });
}

async function inspect(entry) {
  const id = (await compose(entry, 'ps', '-q', 'hello')).stdout.trim();
  assert.ok(id, `Missing container for ${entry.name}`);
  const [container] = JSON.parse((await exec('docker', ['inspect', id])).stdout);
  const config = container.HostConfig;
  assert.equal(config.Memory, 134217728);
  assert.equal(config.NanoCpus, 500000000);
  assert.equal(config.PidsLimit, 100);
  assert.equal(config.ReadonlyRootfs, true);
  assert.ok(config.CapDrop.includes('ALL'));
  assert.ok(config.SecurityOpt.includes('no-new-privileges:true'));
  assert.equal(container.Config.User, 'node');
  assert.equal(container.Config.Labels['com.docker.compose.project'], entry.project);
  const binding = config.PortBindings['8080/tcp'];
  assert.equal(binding.length, 1);
  assert.equal(binding[0].HostIp, '127.0.0.1');
  assert.equal(binding[0].HostPort, String(entry.port));
  return { environment: entry.name, project: entry.project, container: id,
    networks: Object.keys(container.NetworkSettings.Networks), port: entry.port };
}

async function down(entry) {
  await compose(entry, 'down', '--remove-orphans');
  assert.equal((await compose(entry, 'ps', '-a', '-q')).stdout.trim(), '');
  const networks = await exec('docker', ['network', 'ls', '--filter',
    `label=com.docker.compose.project=${entry.project}`, '--quiet']);
  assert.equal(networks.stdout.trim(), '', `Network leaked for ${entry.name}`);
}

let failure;
try {
  for (const entry of entries) {
    await compose(entry, 'config', '--quiet');
    await compose(entry, 'up', '--build', '-d', '--wait', '--wait-timeout', '60');
    await waitForHealth(entry);
  }
  const evidence = [];
  for (const entry of entries) evidence.push(await inspect(entry));
  assert.equal(new Set(evidence.map(item => item.container)).size, entries.length);
  const networks = evidence.flatMap(item => item.networks);
  assert.equal(new Set(networks).size, networks.length, 'Environments must not share networks');
  if (selection === 'all') {
    await down(entries[1]);
    await assert.rejects(fetch(`http://127.0.0.1:${entries[1].port}/health`, { signal: AbortSignal.timeout(2000) }));
    await health(entries[0]);
    await health(entries[2]);
  }
  console.log(JSON.stringify({ simulation: true, verified: evidence,
    stagingShutdownIsolation: selection === 'all' ? 'passed' : 'not-run' }, null, 2));
} catch (error) {
  failure = error;
  for (const entry of entries) {
    try { console.error((await compose(entry, 'logs', '--no-color', '--tail', '60')).stdout); } catch {}
  }
} finally {
  for (const entry of entries) {
    try { await down(entry); } catch (error) { failure ||= error; console.error(error.message); }
  }
}
if (failure) throw failure;
console.log('All simulation containers and networks removed.');
