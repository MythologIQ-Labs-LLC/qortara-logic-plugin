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
    const body = (await read('skills/' + name + '/SKILL.md')).replace(/\r\n/g, '\n');
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

test('public README gives exact installation, authentication, update and platform boundaries', async () => {
  const readme = await read('README.md');
  const marketplace = JSON.parse(await read('.claude-plugin/marketplace.json'));
  const marketplaceName = marketplace.name;
  const pluginName = JSON.parse(await read('.claude-plugin/plugin.json')).name;
  assert.match(readme, new RegExp('\\/plugin install ' + pluginName + ' --marketplace MythologIQ-Labs-LLC\\/' + marketplaceName));
  assert.ok(readme.includes('claude plugin update ' + pluginName + '@' + marketplaceName));
  assert.ok(readme.includes('https://api.qortara.com/mcp'));
  assert.ok(readme.includes('qortara_capabilities'));
  assert.ok(readme.includes('codex mcp login qortara-logic'));
  assert.ok(readme.includes('node tools/skill-kit.mjs verify'));
  for (const skill of expected) assert.ok(readme.includes(skill));
  assert.match(readme, /do not automatically|not automatic/i);
  assert.match(readme, /not.*GitHub.*write authority|host.*separate.*authorization|needs separate authorization/i);
  assert.match(readme, /Streamable HTTP/);
});

test('hosted init handles throttling and locked governance without inventing completion', async () => {
  const govern = await read('skills/qortara-govern/SKILL.md');
  const bridge = await read('references/host-repository-bridge.md');
  assert.match(govern, /file="all"/);
  assert.match(govern, /retryAfterSeconds/);
  assert.match(govern, /managed_append_section_sha256/);
  assert.match(govern, /BLOCKED_NATIVE_EXECUTION/);
  assert.match(bridge, /template lock/);
  assert.match(bridge, /Capacity is not policy/);
  assert.match(bridge, /contains no local Qortara CLI/);
  const skills = (await readdir(path.join(root, 'skills'), {withFileTypes:true}))
    .filter(x => x.isDirectory()).map(x => x.name).sort();
  assert.deepEqual(skills, [...expected].sort());
});
