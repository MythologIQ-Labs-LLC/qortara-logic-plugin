---
name: qortara-improve
description: "Summarize supplied failure records into recurring patterns and proposed remediation steps that you and your own tools can act on."
metadata:
  qortara_requires_remote_tools: "qortara_capabilities,qortara_route_preview,qortara_remediation_report,qortara_chain_verify,qortara_gate_validate,qortara_verdict_parse"
---

# Improve: failure patterns and remediation proposals

Improve uses the tools and canonical workflow resources **actually advertised** by the authenticated hosted Qortara Logic MCP to analyze supplied failure records. Apply ../../references/host-repository-bridge.md rather than assuming a frozen tool inventory. The tools report patterns and proposals; they do not debug, patch, test, file issues or close anything. Any fix is made by the user's own AI host and tools. Read `../../references/host-repository-bridge.md`.

1. Start from the failure the user describes or supplies: environment, commands, source revision, expected and actual results, severity and owner. A narrative or made-up report is not evidence.
2. For supplied failure events in the Qortara shadow-event format, call `qortara_remediation_report`. It groups unresolved events, classifies recurring patterns, collapses severity and proposes candidate remedies. Do not invent events that were not supplied. **No events means not enough evidence, not a clean result.** See `../../references/evaluator-remediation.md`.
3. When related evidence is supplied, use `qortara_chain_verify`, `qortara_gate_validate` or `qortara_verdict_parse` to check chain consistency, gate structure and verdict wording. None of them reads a repository or confirms who ran a test.
4. With a supplied route policy, call `qortara_route_preview` to list remediation, review and follow-up steps. A proposal is not a fix, an approval, an issue or a closed record.
5. Investigating source, patching, testing and keeping records are tasks for the user's own tools. Report remaining uncertainty and what would be needed to close each item.

### Recurring CI and delivery failures

Use backend CI Guard or Repository Delivery Assessor assessments only when those tools/workflows are confirmed available in the running MCP. Otherwise have the authorized host retrieve real failing-run, source-revision, issue, PR and Shadow evidence; distinguish verified failures from proposals and route a bounded corrective action back through Deliver and Assure. Don't claim any fix, closed issue, completed test or persisted Shadow record without actual host execution and proof. Improve is the **fifth** and final public plugin skill, not a bundle of new skill entrypoints.
