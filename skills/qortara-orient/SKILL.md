---
name: qortara-orient
description: "Clarify an engineering goal and check which of the governance sources you supply apply to it, before your own AI host and tools do any work."
metadata:
  qortara_requires_remote_tools: "qortara_capabilities,qortara_route_preview,qortara_applicability_resolve,qortara_context_select"
---

# Orient: goal, applicable rules and context

Orient is one of five Qortara Logic skills (Orient, Govern, Deliver, Assure, Improve). Each one calls the same hosted, read-only Qortara Logic tools. The tools evaluate only what is sent to them in a tool call; they do not read files or repositories, run commands or take actions. Any work on the user's project is done by the user's own AI host and tools, under the user's permissions. Read `../../references/host-repository-bridge.md`.

1. Restate the user's goal and what the user has actually supplied: repository or workspace details, revisions, governance documents and any earlier decisions. Do not invent paths, files, permissions or prior decisions. A URL alone is not source content.
2. Call `qortara_capabilities` when it matters which tools and versions the hosted service offers. It describes the 12 hosted tools; it does not describe the user's environment.
3. With a complete request built from supplied sources, revisions, precedence and status, call `qortara_applicability_resolve`. Report which sources it returns as required, advisory, optional, excluded, stale, superseded or ambiguous. If sources conflict at equal precedence or a required fact is missing, say so and ask the user; do not pick a source silently.
4. When a governance packet and candidate paths or prior artifacts are supplied, call `qortara_context_select` to get a minimal read set. The tool reads no files and its output is not permission to read or change anything. See `../../references/evaluator-applicability.md`.
5. For multi-step work, call `qortara_route_preview` with a route policy the user supplied. The result is a proposed ordering of steps and checks, not execution and not an approval.

Return the goal, where each source and policy came from, which tools were used, missing inputs or permissions, the proposed route and its risks, and a concrete next step the user or the user's own tools can take. Do not describe research, browsing or repository discovery as done unless the user's host actually did it.
