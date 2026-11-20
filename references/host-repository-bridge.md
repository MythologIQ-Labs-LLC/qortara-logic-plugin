# Working with your own AI host and tools

The public Qortara Logic plugin has **exactly five entrypoint skills**: Orient, Govern, Deliver, Assure and Improve. Each orchestrates the same hosted MCP at https://api.qortara.com/mcp. The underlying tools and canonical workflows may expand independently. CI Guard, Repository Delivery Assessor, initialization and refactoring are backend capabilities, not extra public skills.

## Discovery, routing and execution contract for all five skills

1. Call the authenticated qortara_capabilities tool in the current host session, inspect advertised tool names and input schemas, and distinguish the running deployed service from repository source. A historical list of 12 evaluator tools is not a cap. A configured MCP connection is not a verified call.
2. Choose one of the five skills and a supported backend tool or canonical workflow resource; do not invent an unadvertised tool. Use a manifest-listed workflow_path and matching workflow_digest/revision when the service exposes typed resource retrieval. Refuse missing or stale resources instead of improvising an incomplete workflow.
3. Qortara Logic **never receives GitHub write authority**. Hosted MCP responses are guidance, bounded evaluations or canonical server-owned resources. The connected ChatGPT/Claude host separately reads and writes repository files, runs tests and merges changes using its own authorization, with exact source revision and readback evidence.
4. Keep governance source acceptance, actual host authority, independent review and execution receipts separate. A policy ALLOW, route preview, validated gate artifact or generated governance draft does not constitute an authorized change, accepted policy or successful outcome.
5. Fail closed on missing OAuth, unavailable tools, refused calls, unsupported contracts, stale digests, rate limits and missing evidence. Report what the host actually executed versus what the MCP proposed or validated.

These are **locally installed skill instructions**. Refresh them when orchestration rules change; a deployed backend-only tool update can be discovered through MCP without installing another skill.

- Before checking a change, have your host gather the current repository, branch and revision, the affected files, the governing manifest and any review rules, and pass the relevant parts to the tools.
- Tool results are deterministic readings of the supplied input. They are not a code review, proof of where the input came from, permission to write, or deployment approval.
- If you decide to make a change, your host's own tools make it. Work from the expected revision, check the result, and run tests on your own systems.
- Keep plans, review results and other records in your own repository. The tools do not store them and never create or promote records.
- After a restart, gather current inputs again. An earlier result or approval does not carry over.
- Typical order: **Orient checks repository governance first** and routes to INITIALIZE, REPAIR / MAINTAIN, MAINTAIN or BLOCKED; then Govern → Deliver → Assure → Improve. An MCP connection is not governance initialization.

## Orient repository governance initialization and maintenance

This is a workflow within **qortara-orient**, not an extra public skill. The hosted MCP never reads or writes repository files; **ChatGPT/Claude/Codex or another independently authorized host does that work**, including exact revision readback. The native Qortara initializer already exists and is preferred when the host has a trusted installed CLI.

**Inspect before doing other work:** root `GOVERNANCE.md`, `SECURITY.md`, `ARCHITECTURE_INDEX.md`, canonical architecture owner register (normally `docs/README.md`), `.qortara/.gitignore`, `.qortara/ledger.jsonl`, `.qortara/shadow.jsonl`, optional `.qortara/config.json`, existing ADR/architecture pages, active governed sessions, GitHub branch/reviewer rules. Read **content**, not just paths. An absent store or journal is not accepted empty history. Corrupted events cannot be replaced by an empty genesis. A valid empty genesis proves no past approvals or work.

**If required files are missing:** collect owner facts: maintainers `solo|team`; intended visibility `private|public`; contributions `closed|invited|open`; accountable decision authority and governance amendment owner; actual review rules; confidential security reporting mechanism or explicitly accepted solo/private/closed internal-only handling; triage owner, supported-version and disclosure policy. Never infer them from a Git account or invent a public security mailbox or license. If a native CLI is installed, run:
```sh
qortara repository inspect
qortara repository init
qortara architecture init
# Owner supplies the *actual* three profile values; example flags are not defaults:
qortara repository init --maintainers solo --visibility private --contributions closed
# With explicit owner approval for the exact paths and an independently authorized host:
qortara repository init --write --maintainers solo --visibility private --contributions closed
qortara architecture init --write
qortara repository inspect
qortara check repository-documents
qortara check architecture-index
qortara check evidence
```
Both initializers preview without writes; `--write` creates **only missing files** and leaves incomplete policy drafts unresolved. The architecture initializer must not be invoked to overwrite an existing owner register or competing legacy architecture document. Review any active governed session's audited plan scope before adding files. A structural PASS is not owner acceptance.

**Without native CLI, using host repository tools (e.g. ChatGPT with GitHub):** the agent can perform the same **file-creation** steps, not claim native verification. Pin a source revision, inventory existing paths and safety, preview the exact additions, confirm owner authorization, create only missing files on an isolated branch with a no-overwrite/exact-parent commit, then re-read/compare changed bytes. Preserve every existing file, especially governance, history, ADRs and security policy. The minimal canonical genesis is:
- `GOVERNANCE.md`: owner-specific Roles, Decisions and Amendments sections; draft placeholders must be marked `NOT_ESTABLISHED` until the owner supplies and accepts actual policy.
- `SECURITY.md`: Reporting vulnerabilities, Response and Supported versions sections; never invent a reporting channel, deadline, supported version or external contact.
- `.qortara/.gitignore`: exact newline-delimited entries `keys/`, `session`, `*.lock`, `*.tmp`, `hooks.jsonl`.
- `.qortara/ledger.jsonl`: **zero bytes** if genuinely absent; `.qortara/shadow.jsonl`: **zero bytes** if genuinely absent. These are unverified event genesis, not fabricated events. Event-driven journals are created by their actual writer.
- `ARCHITECTURE_INDEX.md` plus the configured owner register: the canonical root entrypoint points to exactly one owner register, normally `docs/README.md`. Create the **native-style incomplete owner register** only for a repository without existing architecture pages, ADRs, alternate owner register or conflicting docs. Never replace an existing `docs/README.md` or silently select a new register. An incomplete architecture register is not an accepted design.

The host can populate these with owner-confirmed text, but must not assert exact native-template parity if the native templates were not inspected. Optional `LICENSE`, `CONTRIBUTING.md` and `CODE_OF_CONDUCT.md` require separate owner selection. For solo owners, an explicitly accepted adversarial review may be appropriate; never waive team/code-owner requirements for other repositories. If the host cannot run the native reader, return `STRUCTURE_NOT_NATIVE_VERIFIED`, not a fabricated check PASS. The host must verify exact file bytes and no unplanned changes before any owner-authorized commit.

**If files exist:** do **not** bootstrap again. Inspect their actual sections, architecture ownership, all required store paths, verified journal chains, current revision, owner acceptance and host/review authority. If missing or invalid, route `REPAIR / MAINTAIN` with exact findings; only the relevant path can be repaired under authority, never reset a historical journal. If baseline is valid, route `MAINTAIN` to Govern with current source-bound rules and recheck on policy drift or branch changes. No refactor is authorized merely because these files exist. Do not use a remote MCP evaluation to impersonate repository readback, native check, signature or consent.

## Customer-tested edge cases for hosted initialization

- **Bulk versus parallel reads:** use a preview-advertised `file="all"` request when the running MCP supports it. Otherwise fetch only necessary paths with a bounded number of calls. Older deployments may not yet support the selector. All returned body bytes must be verified against their own manifest digest; the tool does no host write.
- **Capacity is not policy:** for `error.code="concurrency"` or an explicit capacity refusal, respect `retryAfterSeconds` and `retryable` and retry at low concurrency. There is no governance decision in that response. Genuine policy refusals must still block the governed operation.
- **Externally locked instructions:** a detected template lock, generated-file contract or byte-for-byte invariant on existing AGENTS.md/Claude instructions prevents append until that governing contract is amended and independently verified. Owner intent alone does not dissolve a repository's existing check. Do not silently create a sidecar and claim it is loaded.
- **Append verification:** use the section-specific SHA-256, size and separator rule returned by the current kit. For an existing file, verify the original prefix bytes unchanged, the appended suffix bytes exactly and the resulting revision. A hash for a newly created whole-file template does not validate an append.
- **Qualification and runtime dependency:** the public Claude plugin contains no local Qortara CLI. If native `qortara check` is required and no separately verified runtime is available, mark native qualification BLOCKED_NATIVE_EXECUTION even when all files match their SHA-256. A future hosted verifier must be explicitly advertised and tested; do not invent one.
- **Architecture precedence:** do not overwrite an existing `docs/README.md`, documented architecture model or registered ADR/owner system. Reconcile collisions with the repository owner and accepted upstream governance before writing a replacement placeholder.
