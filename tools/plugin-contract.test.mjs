import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = relative => readFile(path.join(root, relative), 'utf8');
const expected = ['qortara-orient', 'qortara-govern', 'qortara-deliver', 'qortara-assure', 'qortara-improve'];

test('one public Claude plugin exposes exactly five Qortara orchestration skills', async () => {
  const found = (await readdir(path.join(root, 'skills'), { withFileTypes: true }))
    .filter(item => item.isDirectory()).map(item => item.name).sort();
  assert.deepEqual(found, [...expected].sort());
  for (const name of expected) {
    const body = await read('skills/' + name + '/SKILL.md');
    assert.ok(body.startsWith('---\nname: ' + name + '\n'));
    assert.match(body, /qortara_capabilities/);
    assert.match(body, /\.\.\/\.\.\/references\/host-repository-bridge\.md/);
    assert.doesNotMatch(body, /12-tool hosted evaluations|offers 12 read-only evaluation tools/);
  }
  const plugin = JSON.parse(await read('.claude-plugin/plugin.json'));
  assert.equal(plugin.name, 'qortara-logic');
  const mcp = JSON.parse(await read('.mcp.json'));
  assert.deepEqual(Object.keys(mcp.mcpServers), ['qortara-logic']);
  assert.equal(mcp.mcpServers['qortara-logic'].url, 'https://api.qortara.com/mcp');
});

test('backend capabilities are routed through existing five skills, with host-only writes', async () => {
  assert.match(await read('skills/qortara-govern/SKILL.md'), /qortara_repository_init/);
  const deliver = await read('skills/qortara-deliver/SKILL.md');
  assert.match(deliver, /repository-refactor/);
  assert.match(deliver, /workflow_digest/);
  assert.match(await read('skills/qortara-assure/SKILL.md'), /CI Guard/);
  assert.match(await read('skills/qortara-improve/SKILL.md'), /Repository Delivery Assessor/);
  const bridge = await read('references/host-repository-bridge.md');
  assert.match(bridge, /never receives GitHub write authority/);
  assert.match(bridge, /12 evaluator tools is not a cap/);
});
