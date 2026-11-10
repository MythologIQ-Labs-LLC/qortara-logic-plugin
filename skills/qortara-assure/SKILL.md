---
name: qortara-assure
description: "Check supplied verdicts, evidence chains, gate artifacts and compliance-mapping coverage for internal consistency."
metadata:
  qortara_requires_remote_tools: "qortara_capabilities,qortara_route_preview,qortara_chain_verify,qortara_gate_validate,qortara_verdict_parse,qortara_compliance_controls,qortara_compliance_report"
---

# Assure: check supplied evidence for consistency

Assure uses the hosted, read-only Qortara Logic tools to check the audit reports, evidence chains, gate artifacts and compliance facts the user supplies. The checks cover the internal consistency of that supplied material. They do not review code, run tests, confirm who did the work or certify anything. Read `../../references/host-repository-bridge.md` and the references below.

1. For a supplied audit report, call `qortara_verdict_parse` with the exact report text. Missing, contradictory, unreadable or ambiguous verdicts block; do not edit the report to produce a PASS. If a separate audit gate artifact is supplied, call `qortara_gate_validate({phase:'audit', artifact})`.
2. For a supplied event chain, call `qortara_chain_verify` with the actual events (and an `id_prefix` only if one was provided). Report missing links and hash mismatches. A consistent chain shows the supplied events fit together; it does not show who created them or that they match a repository.
3. For supplied gate artifacts, call `qortara_gate_validate` with the actual phase and artifact. This checks structure only. It does not record a gate, approve a transition or review the code.
4. For compliance, call `qortara_compliance_controls` for the relevant framework references (EU AI Act, NIST AI RMF, SSDF). Only with facts the user actually supplied, call `qortara_compliance_report` and label where each fact came from and which coverage is missing. The mappings are an alignment aid, not a compliance determination, certification or legal opinion.
5. If useful, call `qortara_route_preview` with a supplied route policy to list the review and test steps the policy expects. Whether those steps happened, at which revision and by whom, is for the user and their own systems to confirm.
6. Report caller-supplied, inferred and missing evidence separately. Anything the tools cannot do, such as code scanning, running tests or approving a release, is reported as not done.

See `../../references/evaluator-audit-verdict.md`, `../../references/evaluator-evidence-integrity.md` and `../../references/evaluator-compliance.md`.
