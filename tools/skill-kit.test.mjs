import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, writeFile, lstat, symlink, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { runSkillKit } from './skill-kit.mjs';
import { fileURLToPath } from 'node:url';

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


test('CRLF checkout keeps original installed skill and reference bytes', async () => {
  await fixture(async (root, dir) => {
    const sourceRoot = path.join(dir, 'public-package');
    const original = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
    const names = ['orient', 'govern', 'deliver', 'assure', 'improve'].map(n => 'skills/qortara-' + n + '/SKILL.md')
      .concat(['host-repository-bridge', 'evaluator-applicability', 'evaluator-policy',
        'evaluator-audit-verdict', 'evaluator-evidence-integrity', 'evaluator-compliance',
        'evaluator-remediation'].map(n => 'references/' + n + '.md'));
    for (const name of names) {
      const destination = path.join(sourceRoot, name);
      await mkdir(path.dirname(destination), { recursive: true });
      const originalText = (await readFile(path.join(original, name), 'utf8')).replace(/\r\n/g, '\n');
      await writeFile(destination, originalText.replace(/\n/g, '\r\n'));
    }
    assert.equal((await runSkillKit('install', root, { sourceRoot })).present, 12);
    assert.equal((await runSkillKit('verify', root, { sourceRoot })).missing, 0);
    const installed = await readFile(path.join(root, 'skills/qortara-orient/SKILL.md'), 'utf8');
    assert.match(installed, /\r\nname: qortara-orient\r\n/);
  });
});

test('Orient routes governance initialization and maintenance within five distributed skills', async () => {
  await fixture(async root => {
    const result = await runSkillKit('install', root);
    assert.equal(result.files, 12);
    assert.deepEqual(result.skills, ['qortara-orient','qortara-govern','qortara-deliver','qortara-assure','qortara-improve']);
    const orient = await readFile(path.join(root, 'skills/qortara-orient/SKILL.md'), 'utf8');
    const guide = await readFile(path.join(root, 'references/host-repository-bridge.md'), 'utf8');
    for (const label of ['INITIALIZE', 'REPAIR / MAINTAIN', 'MAINTAIN', 'BLOCKED']) {
      assert.ok(orient.includes(label), 'Orient missing route: ' + label);
    }
    for (const pathName of ['GOVERNANCE.md', 'SECURITY.md', 'ARCHITECTURE_INDEX.md',
      '.qortara/ledger.jsonl', '.qortara/shadow.jsonl', '.qortara/.gitignore']) {
      assert.ok(guide.includes(pathName), 'missing canonical bootstrap path: ' + pathName);
    }
    assert.match(guide, /qortara repository init/);
    assert.match(guide, /qortara architecture init/);
    assert.match(guide, /qortara repository inspect/);
    assert.match(guide, /STRUCTURE_NOT_NATIVE_VERIFIED/);
    assert.match(guide, /zero bytes/);
    assert.match(guide, /exact-parent commit/);
    assert.equal((await runSkillKit('verify', root)).missing, 0);
  });
});
