---
name: qortara-deliver
description: "Check plans and gate artifacts before your own tools implement a change."
metadata:
  qortara_requires_remote_tools: "qortara_capabilities,qortara_route_preview,qortara_context_select,qortara_gate_validate,qortara_policy_evaluate"
---

# Deliver: check plans and gates before a change

Deliver uses the hosted, read-only Qortara Logic tools to check the plan, policies and gate artifacts for a change before the user's own AI host and tools make it. Qortara Logic does not edit code, create files, run tests, refactor, scaffold or release anything. Read `../../references/host-repository-bridge.md`.

1. Establish the objective, the owner and the repository details the user supplies, including the relevant architecture or governance manifest. The tool results are never permission to write.
2. Call `qortara_capabilities` if it is unclear what the hosted service can do. It offers 12 read-only evaluation tools and no file, test or deployment actions.
3. Call `qortara_route_preview`, `qortara_context_select`, `qortara_policy_evaluate` and `qortara_gate_validate` on the governance packets, policies and gate artifacts the user supplies. Report the decisions and findings. Never create an approval or gate artifact to make a check pass.
4. If the checks pass and the user wants to proceed, the user's own host and tools make the change under the user's permissions. Suggest that they work from the expected revision, keep protected files and other people's edits intact, and run tests on their own systems.
5. Suggest that the user keep their plan, change, test results and review records in their own repository, and use Assure to check those records before merging or deploying.

Return what was checked, each decision with its reasons, what is missing, and the next step for the user's own tools. Never say a change, test or release was done by Qortara Logic.
