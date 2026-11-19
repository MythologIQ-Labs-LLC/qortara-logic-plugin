---
name: qortara-assure
description: "Check supplied verdicts, evidence chains, gate artifacts and compliance-mapping coverage for internal consistency."
metadata:
  qortara_requires_remote_tools: "qortara_capabilities,qortara_route_preview,qortara_chain_verify,qortara_gate_validate,qortara_verdict_parse,qortara_compliance_controls,qortara_compliance_report"
---

# Assure: check supplied evidence for consistency

Assure uses hosted Qortara Logic tools actually discovered through authenticated qortara_capabilities. Apply the shared discovery and authority contract in ../../references/host-repository-bridge.md to supplied reports, evidence chains, gate artifacts and compliance facts. The checks cover the internal consistency of that supplied material. They do not review code, run tests, confirm who did the work or certify anything. Read `../../references/host-repository-bridge.md` and the references below.

1. For a supplied audit report, call `qortara_verdict_parse` with the exact report text. Missing, contradictory, unreadable or ambiguous verdicts block; do not edit the report to produce a PASS. If a separate audit gate artifact is supplied, call `qortara_gate_validate({phase:'audit', artifact})`.
2. For a supplied event chain, call `qortara_chain_verify` with the actual events (and an `id_prefix` only if one was provided). Report missing links and hash mismatches. A consistent chain shows the supplied events fit together; it does not show who created them or that they match a repository.
3. For supplied gate artifacts, call `qortara_gate_validate` with the actual phase and artifact. This checks structure only. It does not record a gate, approve a transition or review the code.
4. For compliance, call `qortara_compliance_controls` for the relevant framework references (EU AI Act, NIST AI RMF, SSDF). Only with facts the user actually supplied, call `qortara_compliance_report` and label where each fact came from and which coverage is missing. The mappings are an alignment aid, not a compliance determination, certification or legal opinion.
5. If useful, call `qortara_route_preview` with a supplied route policy to list the review and test steps the policy expects. Whether those steps happened, at which revision and by whom, is for the user and their own systems to confirm.
6. Report caller-supplied, inferred and missing evidence separately. Anything the tools cannot do, such as code scanning, running tests or approving a release, is reported as not done.

See `../../references/evaluator-audit-verdict.md`, `../../references/evaluator-evidence-integrity.md` and `../../references/evaluator-compliance.md`.

### CI Guard and Repository Delivery Assessor are backend capabilities, not extra skills

For CI failures, use CI Guard through this existing **Assure** entrypoint only if its executable tool or canonical resource workflow is advertised by the **running** MCP. Otherwise inspect exact CI run/job logs with the independently authorized host, redact secrets, reproduce the failure and label that diagnostic work host-performed. For PR/release readiness, use the backend Repository Delivery Assessor only if deployed and callable; otherwise use actual revision-bound host evidence. In either path, separate source tests, green CI, independent review, user acceptance and merge/deployment receipts. A generated verdict or a static skill file proves none of those outcomes. Route recurring findings to Improve.
