# Qortara Logic for Claude Code

![Qortara Logic](assets/qortara-logic.png)

**Govern AI-assisted development with structured workflows, policy evaluation and evidence checks.**

Qortara Logic is a development governance product from **MythologIQ Labs, LLC**. Its Claude Code plugin provides five guided workflows and a secure connection to the hosted Qortara Logic MCP evaluator. It helps teams examine whether a proposed action is consistent with the policies, plans and evidence they supply.

> **Release status:** Public distribution is in pre-release qualification. This repository is being prepared for the Anthropic directory. The installable bundle and proprietary plugin license are pending final approval; **do not treat this repository as a published or approved plugin yet**.

## What the plugin provides

| Workflow | Purpose |
| --- | --- |
| **Orient** | Establish the development goal, context and applicable rules. |
| **Govern** | Evaluate supplied policies and governance artifacts. |
| **Deliver** | Check plans and gate artifacts before work proceeds through the host's own tools. |
| **Assure** | Examine evidence integrity, interpret verdicts and report informational framework mappings. |
| **Improve** | Translate supplied failures into proposed corrective actions. |

The hosted service exposes **12 read-only MCP tools** at `https://api.qortara.com/mcp`. All evaluations are limited to the inputs sent by your AI host.

### Clear authority boundaries

Qortara Logic's hosted evaluator **does not** read local files, inspect private repositories, modify code, run tests, deploy software or authorize an action. Claude Code may perform development operations through its **own** tools and user-approved permissions; that authority does not come from Qortara's evaluation verdict.

Framework mappings are informational and do not constitute independent audit evidence, certification, regulatory conformity, legal advice or permission to act.

## Connectivity and privacy

The plugin uses authenticated HTTPS MCP transport. Account sign-in is handled at [auth.qortara.com](https://auth.qortara.com), and account activity and connections are available at [app.qortara.com](https://app.qortara.com).

Tool arguments are sent to Qortara for evaluation. The hosted service is designed to retain activity **metadata**, not submitted tool arguments or results. See the forthcoming Qortara Logic-specific Privacy Notice and Terms for effective processing and retention commitments before distribution.

The free hosted tier currently allows up to **200 evaluations per account per day**, subject to shared platform capacity and concurrency controls.

## Installation

Installation instructions will be published after the exact distributable plugin, license and production acceptance tests are approved. The public repository is intentionally not presented as installable until those release gates pass.

## Distribution and licensing

The underlying Qortara Logic engine and other MythologIQ products are **proprietary and are not included here**.

A separate proprietary plugin license is under owner/legal review. **Public GitHub visibility is not an open-source grant or authorization to redistribute these materials.** The approved full plugin license will appear in `LICENSE` alongside the release package.

## Support and security

For product questions, contact **support@qortara.com**. Report potential security vulnerabilities privately to **security@qortara.com**, rather than disclosing credentials or exploit details in a public issue.

Project website: [qortara.com](https://qortara.com)

---

© 2026 MythologIQ Labs, LLC. Qortara and Qortara Logic are MythologIQ Labs marks. All rights reserved.
