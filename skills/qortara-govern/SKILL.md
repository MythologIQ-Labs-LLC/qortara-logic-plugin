---
name: qortara-govern
description: "Evaluate the policies, governance manifests, plans and gate artifacts you supply and explain each decision; your own AI host and tools decide what happens next."
metadata:
  qortara_requires_remote_tools: "qortara_capabilities,qortara_route_preview,qortara_applicability_resolve,qortara_manifest_resolve,qortara_policy_evaluate,qortara_gate_validate,qortara_context_select"
---

# Govern: evaluate supplied policies, manifests and gates

Govern uses the hosted, read-only Qortara Logic tools to evaluate rules the user supplies. The tools return decisions and findings; they do not enforce rules, change files, record approvals or grant permission to act. Read `../../references/host-repository-bridge.md`.

1. Collect the governance inputs the user supplies: repository and branch details, changed paths, governance revision and the governing documents. Treat each input as supplied by the caller; the tools cannot confirm where it came from.
2. Call `qortara_manifest_resolve` with the supplied organization defaults and repository manifest. Missing overrides, stale sources or undeclared divergence come back as a block, not as permitted.
3. Call `qortara_applicability_resolve` and `qortara_context_select` to see which supplied sources apply and which inputs matter. See `../../references/evaluator-applicability.md`.
4. For policies, call `qortara_policy_evaluate` with the supplied Cedar-subset `policies` and a complete `request` (principal, action, resource, context). Default deny; any matching forbid wins, including a forbid whose inputs cannot be resolved. Explain the decision and its reasons. An `allow` is a statement about the supplied policy, not permission to change files. Never report an invalid, unavailable or missing result as `allow`. See `../../references/evaluator-policy.md`.
5. With a supplied route policy, call `qortara_route_preview` to list the steps and checks the policy requires. Call `qortara_gate_validate` on gate JSON the user actually supplied; it checks structure only and does not record, promote or approve a gate.
6. Remind the user that their own host permissions, owners and review rules decide whether any change may proceed, whatever the policy result. If the inputs change, evaluate them again.

Return each decision with its reasons, the inputs it was based on, and anything missing. Saving plans, decisions or gate artifacts is a task for the user's own tools.
