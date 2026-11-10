# Qortara Logic: what this plugin is

**Product.** Qortara Logic, by MythologIQ Labs, LLC, is a hosted, read-only MCP service. This plugin connects your AI host to it and adds five skills that tell the host when and how to call its tools.

**Service.** The plugin connects to one MCP server, `https://api.qortara.com/mcp`, which serves 12 deterministic, read-only tools: qortara_capabilities, qortara_applicability_resolve, qortara_route_preview, qortara_remediation_report, qortara_policy_evaluate, qortara_manifest_resolve, qortara_chain_verify, qortara_gate_validate, qortara_verdict_parse, qortara_context_select, qortara_compliance_controls, qortara_compliance_report. See `canonical-capability-surface.md` for what each one does.

**What the tools do.** Each tool evaluates only what the AI host sends it in the tool call: policies, governance manifests and sources, route policies, gate artifacts, audit report text, evidence events, failure events or compliance facts. It returns a decision, findings or a refusal with reasons. The same input always gives the same result.

**What the tools do not do.** They do not read your files or repositories, edit code, run tests, record or approve gates, review code, deploy or take any other action. A result such as `allow` or `PASS` is information about the supplied input, not permission to act.

**Who acts.** Any change to your project is made by your own AI host and tools, under your permissions and your host's approval settings. The skills ask the host to check the inputs with Qortara Logic first and to report the results plainly.

**Five skills.** Orient (goal and applicable rules), Govern (policy and manifest evaluation), Deliver (checks before your tools make a change), Assure (consistency checks on supplied evidence) and Improve (failure patterns and remediation proposals). They share the same 12 tools.

**Sign-in.** The first time the host connects, you sign in with your email address and a one-time code at `https://auth.qortara.com` (OAuth).

**Identity and brand.** The product is shown as Qortara Logic by MythologIQ Labs, LLC, with the owner-approved Qortara Logic product mark (silver Q, blue diamond of four nodes around a red center), which is distinct from the Qortara parent mark.

**Disclaimer.** Qortara Logic evaluates the policies, artifacts and evidence you supply. Its results and framework mappings are informational and do not constitute legal advice, an independent audit, regulatory certification, or authorization to act.
