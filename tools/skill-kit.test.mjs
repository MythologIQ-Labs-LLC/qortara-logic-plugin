import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, lstat, symlink, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runSkillKit } from './skill-kit.mjs';

async function fixture(fn) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'qortara-kit-'));
  try { return await fn(path.join(dir, '.agents'), dir); }
  finally { await rm(dir, { recursive: true, force: true }); }
}
async function exists(file) {
  try { await lstat(file); return true; }
  catch (error) { if (error.code === 'ENOENT') return false; throw error; }
}
test('plan is read-only; explicit root is required and no host or OAuth is assumed', async () => {
  await fixture(async root => {
    const plan = await runSkillKit('plan', root);
    assert.equal(plan.files, 12);
    assert.equal(plan.missing, 12);
    assert.deepEqual(plan.skills, ['qortara-orient', 'qortara-govern', 'qortara-deliver', 'qortara-assure', 'qortara-improve']);
    assert.equal(plan.sourceSha256.length, 64);
    assert.equal(await exists(root), false);
    await assert.rejects(() => runSkillKit('install', './.agents'), /absolute --root/);
  });
});
test('offline installation preserves five skill identities and all seven relative references', async () => {
  await fixture(async root => {
    const first = await runSkillKit('install', root);
    assert.equal(first.action, 'verify');
    assert.equal(first.present, 12);
    assert.equal(first.missing, 0);
    const text = await readFile(path.join(root, 'skills/qortara-orient/SKILL.md'), 'utf8');
    assert.match(text, /name: qortara-orient/);
    assert.match(text, /\.\.\/\.\.\/references\/host-repository-bridge.md/);
    assert.match(await readFile(path.join(root, 'references/host-repository-bridge.md'), 'utf8'),
      /Working with your own AI host and tools/);
    assert.equal((await runSkillKit('verify', root)).present, 12);
    assert.equal((await runSkillKit('install', root)).present, 12);
  });
});
test('a modified installed file is refused without overwriting it or adding later missing files', async () => {
  await fixture(async root => {
    await runSkillKit('install', root);
    const changed = path.join(root, 'skills/qortara-assure/SKILL.md');
    await writeFile(changed, '# local modification\n');
    const missing = path.join(root, 'references/evaluator-remediation.md');
    await rm(missing);
    await assert.rejects(() => runSkillKit('install', root), /refusing overwrite/);
    assert.equal(await readFile(changed, 'utf8'), '# local modification\n');
    assert.equal(await exists(missing), false);
    await assert.rejects(() => runSkillKit('verify', root), /refusing overwrite/);
  });
});
test('a missing installed reference fails verification, and install restores only missing content', async () => {
  await fixture(async root => {
    await runSkillKit('install', root);
    const missing = path.join(root, 'references/evaluator-compliance.md');
    await rm(missing);
    await assert.rejects(() => runSkillKit('verify', root), /incomplete/);
    assert.equal((await runSkillKit('install', root)).present, 12);
    assert.equal(await exists(missing), true);
  });
});
test('destination symlinks are refused instead of traversed', async () => {
  await fixture(async (root, dir) => {
    await mkdir(root);
    const outside = path.join(dir, 'outside');
    await mkdir(outside);
    await symlink(outside, path.join(root, 'skills'), process.platform === 'win32' ? 'junction' : 'dir');
    await assert.rejects(() => runSkillKit('install', root), /symlink|unsafe destination/);
    assert.equal(await exists(path.join(outside, 'qortara-orient')), false);
  });
});
test('preexisting unrelated file in references cannot be replaced', async () => {
  await fixture(async root => {
    await mkdir(path.join(root, 'references'), { recursive: true });
    const existing = path.join(root, 'references/evaluator-policy.md');
    await writeFile(existing, 'Not a Qortara reference');
    await assert.rejects(() => runSkillKit('install', root), /refusing overwrite/);
    assert.equal(await exists(path.join(root, 'skills/qortara-orient/SKILL.md')), false);
  });
});
