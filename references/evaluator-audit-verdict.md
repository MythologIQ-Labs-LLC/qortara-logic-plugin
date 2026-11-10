# Audit-verdict interpretation
Used by Assure and Improve.
1. Call `qortara_verdict_parse` on the exact supplied report text. Never infer a verdict from tone or headings.
2. If a separate audit gate artifact is supplied, call `qortara_gate_validate` with phase `audit`.
3. A parsed PASS describes the wording of the supplied report. It is not a code audit, a reviewer's sign-off, a test result or deployment approval. Missing, contradictory or unreadable verdicts block.
4. For failure patterns and remediation proposals, see Improve and `evaluator-remediation.md`.
