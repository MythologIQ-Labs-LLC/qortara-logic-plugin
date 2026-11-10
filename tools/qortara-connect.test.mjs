import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseSetupArgs, claudeMcpArgs, createClaudeInvocation, runSetup,
  QORTARA_MCP_URL,
} from './qortara-connect.mjs';

function withRunner(argv, { result = { status: 0 }, platform = 'linux' } = {}) {
  const calls = [], out = [], err = [];
  const status = runSetup(argv, {
    run: (...args) => { calls.push(args); return result; },
    stdout: line => { out.push(line); },
    stderr: line => { err.push(line); },
    platform,
  });
  return { status, calls, stdout: out.join(''), stderr: err.join('') };
}

test('default and help are read-only and never invoke Claude CLI', () => {
  for (const argv of [[], ['--help']]) {
    const response = withRunner(argv);
    assert.equal(response.status, 0);
    assert.equal(response.calls.length, 0);
    assert.match(response.stdout, /No writes, connections or OAuth/);
  }
  assert.match(withRunner([]).stdout, /claude mcp add --transport http/);
});

test('explicit --install invokes only the official remote HTTP MCP CLI', () => {
  const { status, calls, stdout } = withRunner(['--install']);
  assert.equal(status, 0);
  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], 'claude');
  assert.deepEqual(calls[0][1], [
    'mcp', 'add', '--transport', 'http', '--scope', 'local',
    'qortara-logic', QORTARA_MCP_URL,
  ]);
  assert.deepEqual(calls[0][2], { shell: false, stdio: 'inherit' });
  assert.match(stdout, /Open \/mcp to authorize/);
});

test('explicit global user scope requires --install and does not alter server URL', () => {
  for (const args of [
    ['--scope=user','--install'],
    ['--install','--scope','user'],
  ]) {
    const { status, calls } = withRunner(args);
    assert.equal(status, 0);
    assert.equal(calls[0][1].join(' '),
      'mcp add --transport http --scope user qortara-logic ' + QORTARA_MCP_URL);
  }
  assert.equal(withRunner(['--scope=user']).status, 2);
});

test('Windows invokes safe hardcoded command under cmd.exe without shell expansion', () => {
  const result = withRunner(['--install', '--scope', 'user'], {platform:'win32'});
  assert.equal(result.status, 0);
  assert.equal(result.calls[0][0], 'cmd.exe');
  assert.deepEqual(result.calls[0][1], [
    '/d', '/s', '/c',
    'claude mcp add --transport http --scope user qortara-logic ' + QORTARA_MCP_URL,
  ]);
  assert.equal(result.calls[0][2].shell, false);
});

test('arbitrary flags and injection-like values never reach a subprocess', () => {
  const bad = [
    ['--install','--scope=project'],
    ['--install','--scope','project'],
    ['--install','--scope=user;del C:\\*'],
    ['--install','--url=https://evil.example/mcp'],
    ['--install','--install'],
    ['--install','--scope','user','--scope','local'],
    ['--install','&&','curl','evil.example'],
    ['--help','--install'],
  ];
  for (const argv of bad) {
    const result = withRunner(argv);
    assert.equal(result.status, 2, argv.join(' '));
    assert.deepEqual(result.calls, []);
  }
});

test('invalid scopes rejected at argument generation', () => {
  assert.throws(() => claudeMcpArgs('project'), /Unsupported/);
  assert.throws(() => createClaudeInvocation('not-valid', 'win32'), /Unsupported/);
  assert.deepEqual(parseSetupArgs(['--install','--scope=local']), {action:'install',scope:'local'});
});

test('failed Claude CLI emits bounded failure and does not retry or claim installation', () => {
  for (const response of [{ status: 1 }, { error: new Error('missing'), status: null }, null]) {
    const result = withRunner(['--install'], {result:response});
    assert.notEqual(result.status, 0);
    assert.equal(result.calls.length, 1);
    assert.doesNotMatch(result.stdout, /The MCP server was added/);
    assert.match(result.stderr, /did not confirm/);
  }
});

test('a synchronous process spawn exception is a single refusal without secret output', () => {
  const messages = [], calls = [];
  const status = runSetup(['--install'], {
    run: (...args) => { calls.push(args); throw new Error('private machine path'); },
    stdout: value => messages.push(value),
    stderr: value => messages.push(value),
    platform:'win32',
  });
  assert.equal(status, 1);
  assert.equal(calls.length, 1);
  assert.doesNotMatch(messages.join(''), /private machine path/);
});

test('endpoint and command contain no local engine, arbitrary token or external downloads', () => {
  const output = withRunner([]).stdout;
  assert.match(output, /https:\/\/api\.qortara\.com\/mcp/);
  assert.doesNotMatch(output, /Bearer |TOKEN=|npm install |curl |git clone /);
  assert.ok(!claudeMcpArgs().includes('--dangerously-skip-permissions'));
});
