#!/usr/bin/env node
// Optional local setup helper. NOT part of the Claude or OpenAI plugin
// manifests. No private Qortara engine, OAuth tokens, host hooks or scripts
// run during plugin install. This script runs only when invoked explicitly.
import { spawnSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

export const QORTARA_MCP_URL = 'https://api.qortara.com/mcp';
export const QORTARA_SERVER_NAME = 'qortara-logic';
export const SETUP_HELPER_VERSION = '0.1.0';

const USAGE = `Qortara Logic: optional remote MCP setup for Claude Code

Usage:
  node tools/qortara-connect.mjs
  node tools/qortara-connect.mjs --install [--scope local|user]
  node tools/qortara-connect.mjs --help

Default: print a copyable command. No writes, connections or OAuth.
--install: invoke the official Claude Code CLI once to add the remote server.
--scope: local (default, this working directory) or user (all projects).

This adds only the hosted read-only MCP server. It never installs the
private Qortara Logic engine or automatically authorizes any partner app.
After adding the server, open Claude Code's /mcp interface and use the
Qortara email-code OAuth sign-in. To add the five workflow skills, use
the separate official Claude Code plugin marketplace.
`;

const SCOPES = new Set(['local', 'user']);

export function parseSetupArgs(args) {
  if (!Array.isArray(args) || args.some(x => typeof x !== 'string')) {
    return { error: 'Invalid setup arguments' };
  }
  if (args.length === 0 || (args.length === 1 && args[0] === '--help')) {
    return { action: args.length ? 'help' : 'preview', scope: 'local' };
  }
  let install = false, scope = 'local';
  const seen = new Set();
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--install' && !seen.has('install')) {
      install = true; seen.add('install');
    } else if (arg === '--scope' && !seen.has('scope')) {
      if (++i >= args.length || !SCOPES.has(args[i])) return { error: 'Scope must be local or user' };
      scope = args[i]; seen.add('scope');
    } else if (arg.startsWith('--scope=') && !seen.has('scope')) {
      scope = arg.slice('--scope='.length);
      if (!SCOPES.has(scope)) return { error: 'Scope must be local or user' };
      seen.add('scope');
    } else {
      return { error: 'Unsupported or repeated argument: ' + arg };
    }
  }
  if (!install) return { error: 'Scope requires explicit --install' };
  return { action: 'install', scope };
}

export function claudeMcpArgs(scope = 'local') {
  if (!SCOPES.has(scope)) throw new TypeError('Unsupported installation scope');
  return ['mcp', 'add', '--transport', 'http', '--scope', scope,
    QORTARA_SERVER_NAME, QORTARA_MCP_URL];
}

export function createClaudeInvocation(scope = 'local', platform = process.platform) {
  const args = claudeMcpArgs(scope);
  if (platform === 'win32') {
    // The Windows .cmd shim cannot be spawned without a shell in recent Node.
    // All interpolated values here are constants or from the fixed SCOPES set.
    // Do not ever add free-form user arguments to this cmd.exe invocation.
    return {
      file: 'cmd.exe',
      args: ['/d', '/s', '/c', 'claude ' + args.join(' ')],
      options: { shell: false, stdio: 'inherit', windowsHide: false },
    };
  }
  return { file: 'claude', args, options: { shell: false, stdio: 'inherit' } };
}

/**
 * Dependency-injected for exact invocation testing. Never prints tokens or
 * reads local configuration directly. CLI errors do not trigger retries,
 * alternate network endpoints or silent configuration edits.
 */
export function runSetup(args, {
  run = spawnSync,
  stdout = message => process.stdout.write(message),
  stderr = message => process.stderr.write(message),
  platform = process.platform,
} = {}) {
  const parsed = parseSetupArgs(args);
  if (parsed.error) {
    stderr(parsed.error + '\n\n' + USAGE);
    return 2;
  }
  if (parsed.action === 'help') {
    stdout(USAGE);
    return 0;
  }
  if (parsed.action === 'preview') {
    stdout(USAGE + '\nCopy this command into a terminal with Claude Code installed:\n' +
      'claude ' + claudeMcpArgs('local').join(' ') + '\n');
    return 0;
  }
  const { file, args: safeArgs, options } = createClaudeInvocation(parsed.scope, platform);
  stdout('Adding hosted Qortara Logic to Claude Code at scope ' + parsed.scope +
    ' using the official Claude CLI. No OAuth tokens are handled here.\n');
  let result;
  try {
    result = run(file, safeArgs, options);
  } catch {
    stderr('Claude Code CLI could not be started. No retry was attempted.\n');
    return 1;
  }
  if (result?.error || !Number.isInteger(result?.status) || result.status !== 0) {
    stderr('Claude Code did not confirm a successful MCP configuration. Review its output.\n');
    return result?.status > 0 ? result.status : 1;
  }
  stdout('The MCP server was added by Claude Code. Open /mcp to authorize Qortara with your email code.\n');
  return 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = runSetup(process.argv.slice(2));
}
