# Qortara Logic capability surface

One product: Qortara Logic. The icon is the **Qortara Logic product mark** (silver Q, blue diamond of four nodes around a red center), distinct from the Qortara parent mark.

## Skills

Five skills: Orient, Govern, Deliver, Assure and Improve. Each is a set of instructions to your AI host about when to call the hosted tools below and how to report their results. The skills do not add any capability beyond those tools.

## Hosted tools

The hosted MCP server serves 12 deterministic, read-only tools. Each evaluates only the caller-supplied input in the tool call and reads no files.

| Tool | What it does |
|---|---|
| `qortara_capabilities` | Describes the hosted service: versions, the tools it serves and the schemas they accept. |
| `qortara_applicability_resolve` | Decides which supplied governance sources apply to an operation: required, advisory, optional, excluded, stale, superseded or ambiguous. |
| `qortara_route_preview` | Proposes an ordered, dependency-complete list of steps and checks from a supplied route policy. A proposal, not execution or approval. |
| `qortara_remediation_report` | Groups supplied failure (shadow) events, classifies recurring patterns, collapses severity and proposes candidate remedies. Reporting only. |
| `qortara_policy_evaluate` | Evaluates one request against supplied Cedar-subset policies. Default deny; forbid wins. Returns allow or block with reasons. |
| `qortara_manifest_resolve` | Merges supplied organization defaults and a repository governance manifest; undeclared divergence blocks. |
| `qortara_chain_verify` | Checks the integrity and ordering of supplied chained evidence events. Does not confirm who created them. |
| `qortara_gate_validate` | Checks a supplied lifecycle or hardening gate artifact against published JSON schemas. Does not record or promote the gate. |
| `qortara_verdict_parse` | Reads the verdict in supplied audit report text. Missing, contradictory or unreadable verdicts block. |
| `qortara_context_select` | Computes a minimal read set from a supplied governance packet and paths. Reads no files. |
| `qortara_compliance_controls` | Returns bundled mappings to EU AI Act, NIST AI RMF and SSDF references. An alignment aid, not a compliance determination. |
| `qortara_compliance_report` | Computes coverage over supplied facts. Unverified facts are not attested evidence or a certification. |

## Limits

- The tools do not read repositories, edit code, run tests, review code, record approvals, deploy or act.
- Results are information about the supplied input. They are not permission to act. Your AI host, your tools and your permission settings decide what happens in your project.
- If a tool refuses or is unavailable, report the check as not done. Never report a missing result as a pass.

Qortara Logic evaluates the policies, artifacts and evidence you supply. Its results and framework mappings are informational and do not constitute legal advice, an independent audit, regulatory certification, or authorization to act.
