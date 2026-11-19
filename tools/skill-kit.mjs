#!/usr/bin/env node
// Explicit, offline installation of the public hosted-only Qortara workflow skills.
// No network, subprocesses, automatic host detection, OAuth, hooks or credential access.
// The selected root must be the PARENT of the host's "skills" directory.
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, lstat, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const PACKAGE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = Object.freeze(['qortara-orient', 'qortara-govern', 'qortara-deliver', 'qortara-assure', 'qortara-improve']);
const REFERENCES = Object.freeze([
  'host-repository-bridge.md', 'evaluator-applicability.md', 'evaluator-policy.md',
  'evaluator-audit-verdict.md', 'evaluator-evidence-integrity.md',
  'evaluator-compliance.md', 'evaluator-remediation.md',
]);
const HASH = bytes => createHash('sha256').update(bytes).digest('hex');

async function probe(file) {
  try { return await lstat(file); }
  catch (error) { if (error.code === 'ENOENT') return null; throw error; }
}
function assertPath(root, relative) {
  const target = path.resolve(root, relative);
  const within = path.relative(root, target);
  if (within === '' || within === '..' || within.startsWith('..' + path.sep) || path.isAbsolute(within))
    throw new Error('path escapes the selected skill root: ' + relative);
  return target;
}
async function ensurePlainFile(file) {
  const st = await probe(file);
  if (!st || !st.isFile() || st.isSymbolicLink()) throw new Error('required source file missing or non-regular: ' + file);
  if (st.size > 128 * 1024) throw new Error('unexpectedly large source file: ' + file);
  return readFile(file);
}
async function checkParentChain(root, target) {
  for (let here = root; ; here = path.dirname(here)) {
    const stat = await probe(here);
    if (stat && (!stat.isDirectory() || stat.isSymbolicLink()))
      throw new Error('unsafe non-directory or symlink in selected destination: ' + here);
    if (here === path.dirname(here)) break;
  }
  const relative = path.relative(root, path.dirname(target));
  const segments = relative === '' ? [] : relative.split(path.sep);
  let here = root;
  for (const segment of segments) {
    here = path.join(here, segment);
    const stat = await probe(here);
    if (stat && (!stat.isDirectory() || stat.isSymbolicLink()))
      throw new Error('unsafe destination directory: ' + here);
  }
}
async function sourceEntries(sourceRoot) {
  const entries = [];
  const referenced = new Set();
  for (const name of SKILLS) {
    const relative = 'skills/' + name + '/SKILL.md';
    const bytes = await ensurePlainFile(path.join(sourceRoot, relative));
    // Git may check Markdown out with CRLF on Windows. Parse normalized text
    // while installing and verifying the original bytes unchanged.
    const text = bytes.toString('utf8').replace(/\r\n/g, '\n');
    if (!text.startsWith('---\n') || !text.includes('\nname: ' + name + '\n'))
      throw new Error('invalid skill identity: ' + name);
    for (const match of text.matchAll(/\.\.\/\.\.\/references\/([a-z0-9-]+\.md)/g)) {
      if (!REFERENCES.includes(match[1])) throw new Error('undeclared skill reference: ' + match[1]);
      referenced.add(match[1]);
    }
    entries.push({ relative, bytes, sha256: HASH(bytes) });
  }
  for (const name of REFERENCES) {
    if (!referenced.has(name)) throw new Error('unreferenced public support file: ' + name);
    const relative = 'references/' + name;
    const bytes = await ensurePlainFile(path.join(sourceRoot, relative));
    entries.push({ relative, bytes, sha256: HASH(bytes) });
  }
  return entries;
}

export async function runSkillKit(action, root, { sourceRoot = PACKAGE } = {}) {
  if (!['plan', 'install', 'verify'].includes(action)) throw new Error('unknown action: ' + action);
  if (typeof root !== 'string' || !path.isAbsolute(root))
    throw new Error('an explicit absolute --root path is required; do not point at the skills folder itself');
  const destination = path.resolve(root);
  const entries = await sourceEntries(sourceRoot);
  let present = 0, missing = 0;
  // Preflight all paths before the first write: never overwrite another skill,
  // a modified file, a dangling symlink or an unrelated reference note.
  for (const entry of entries) {
    const target = assertPath(destination, entry.relative);
    await checkParentChain(destination, target);
    const st = await probe(target);
    if (st) {
      if (!st.isFile() || st.isSymbolicLink()) throw new Error('unsafe destination file: ' + target);
      if (!(await readFile(target)).equals(entry.bytes))
        throw new Error('existing content differs; refusing overwrite: ' + target);
      present++;
    } else missing++;
  }
  if (action === 'verify' && missing) throw new Error('skill kit incomplete: ' + missing + ' expected files missing');
  if (action === 'install') {
    await mkdir(destination, { recursive: true });
    if ((await probe(destination))?.isSymbolicLink()) throw new Error('destination root is a symlink');
    const canonicalRoot = await realpath(destination);
    for (const entry of entries) {
      const target = assertPath(destination, entry.relative);
      await checkParentChain(destination, target);
      await mkdir(path.dirname(target), { recursive: true });
      const parent = await realpath(path.dirname(target));
      const within = path.relative(canonicalRoot, parent);
      if (within === '..' || within.startsWith('..' + path.sep) || path.isAbsolute(within))
        throw new Error('destination parent escaped selected root: ' + parent);
      const existing = await probe(target);
      if (existing) continue; // byte equality already required during preflight
      try { await writeFile(target, entry.bytes, { flag: 'wx', mode: 0o600 }); }
      catch (error) {
        // Concurrent installs may create an identical file; never overwrite.
        const st = await probe(target);
        if (!st?.isFile() || st.isSymbolicLink() || !(await readFile(target)).equals(entry.bytes))
          throw error;
      }
    }
    return runSkillKit('verify', destination, { sourceRoot });
  }
  return {
    action, root: destination, skills: [...SKILLS], files: entries.length,
    present, missing, sourceSha256: HASH(Buffer.from(entries.map(e => e.relative + ':' + e.sha256).join('\n'))),
  };
}
function usage() {
  return 'Usage: node tools/skill-kit.mjs <plan|install|verify> --root ABSOLUTE_DIRECTORY\n' +
    'Root is the parent of skills/; examples: $HOME/.agents or a project .agents directory.\n' +
    'Runs offline; no MCP or OAuth connection is created. Install never overwrites modified files.';
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [action, option, root, ...rest] = process.argv.slice(2);
  if (action === '--help' || action === 'help') {
    console.log(usage());
  } else if (option !== '--root' || rest.length || !root) {
    console.error(usage());
    process.exitCode = 2;
  } else {
    runSkillKit(action, root).then(result => console.log(JSON.stringify(result, null, 2)),
      error => { console.error('Qortara skill-kit: ' + error.message); process.exitCode = 1; });
  }
}
