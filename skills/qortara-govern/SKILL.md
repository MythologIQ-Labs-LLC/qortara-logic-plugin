---
name: qortara-govern
description: "Evaluate the policies, governance manifests, plans and gate artifacts you supply and explain each decision; your own AI host and tools decide what happens next."
metadata:
  qortara_requires_remote_tools: "qortara_capabilities,qortara_route_preview,qortara_applicability_resolve,qortara_manifest_resolve,qortara_policy_evaluate,qortara_gate_validate,qortara_context_select"
---

# Govern: evaluate supplied policies, manifests and gates

Govern routes rule evaluation and canonical governance initialization through the authenticated hosted MCP, using the shared discovery and authority contract in ../../references/host-repository-bridge.md. The tools return decisions and findings; they do not enforce rules, change files, record approvals or grant permission to act. Read `../../references/host-repository-bridge.md`.

1. Collect the governance inputs the user supplies: repository and branch details, changed paths, governance revision and the governing documents. Treat each input as supplied by the caller; the tools cannot confirm where it came from.
2. Call `qortara_manifest_resolve` with the supplied organization defaults and repository manifest. Missing overrides, stale sources or undeclared divergence come back as a block, not as permitted.
3. Call `qortara_applicability_resolve` and `qortara_context_select` to see which supplied sources apply and which inputs matter. See `../../references/evaluator-applicability.md`.
4. For policies, call `qortara_policy_evaluate` with the supplied Cedar-subset `policies` and a complete `request` (principal, action, resource, context). Default deny; any matching forbid wins, including a forbid whose inputs cannot be resolved. Explain the decision and its reasons. An `allow` is a statement about the supplied policy, not permission to change files. Never report an invalid, unavailable or missing result as `allow`. See `../../references/evaluator-policy.md`.
5. With a supplied route policy, call `qortara_route_preview` to list the steps and checks the policy requires. Call `qortara_gate_validate` on gate JSON the user actually supplied; it checks structure only and does not record, promote or approve a gate.
6. Remind the user that their own host permissions, owners and review rules decide whether any change may proceed, whatever the policy result. If the inputs change, evaluate them again.

Return each decision with its reasons, the inputs it was based on, and anything missing. Saving plans, decisions or gate artifacts is a task for the user's own tools.


## Canonical repository initialization

When the running MCP actually advertises qortara_repository_init, call it **without file** for the canonical manifest and owner questions. When the preview explicitly advertises `bulk_retrieval`, prefer **one** `file="all"` call for all canonical default bodies. Otherwise fetch only manifest-listed missing paths, **serially or at the documented concurrency limit**, not in a burst of nine parallel calls. Independently hash and length-check every body. The nested Claude instruction path remains a conditional separate choice; never create both layouts blindly. Ask the owner separately for maintainers (solo/team), visibility (private/public), and contributions (closed/invited/open), rather than assuming them. The connected AI host, **not Qortara MCP**, inspects the pinned repository, creates only missing drafts and genesis files under independently granted permissions, then reads back content and revision. Preserve any existing GOVERNANCE.md, SECURITY.md, AGENTS.md, CLAUDE.md, .claude/CLAUDE.md and ledger/Shadow histories; append only permitted Qortara-managed instructions and do not create duplicate Claude entrypoints. Generated drafts and structural checks require separate owner policy acceptance and real native host check receipts before qualification or refactoring. If the tool or native checks are absent, report NOT_ESTABLISHED or BLOCKED_NATIVE_EXECUTION rather than inventing success. Backend capabilities do not add a sixth skill.

### Real-world onboarding gates and refusal classification

A concurrency or quota error with `refusalType: "capacity"`, `retryable: true` and `retryAfterSeconds` means **no policy decision was produced**; retry only after the delay, with bounded concurrency. Do not treat capacity throttling as an ALLOW or as a governance denial. An actual governance refusal remains binding. Older deployments may use ambiguous error wording: distinguish `error.code: "concurrency"` from policy codes before interpreting the result.

An existing `AGENTS.md` or `CLAUDE.md` may be byte-locked by `template.lock`, a generator or another governance gate. **Do not append** if the host discovers such a lock. Require accepted upstream template/lock reconciliation; an unreferenced `.qortara/AGENTS.section.md` is not an installed host instruction. For any approved append, require a pinned original digest, the independent `managed_append_section_sha256` (when provided), exact separator bytes and readback. A whole-file **create** hash is not an append verification hash.

If the hosted kit requires the local `qortara check` binary and the customer does **not** have an independently verified installation route, return `BLOCKED_NATIVE_EXECUTION`. Do **not** claim that a public hosted-only Claude plugin includes a local runtime or instruct customers to install an unverified package. Confirm any future remote verification tool actually exists before using it. Matching template digests proves file integrity, **not** policy acceptance or full initialization.
