# Qortara Logic for Claude Code

![Qortara Logic](assets/qortara-logic.png)

Qortara Logic helps you plan and check AI-assisted software work against the rules and evidence you supply. This plugin gives
Claude Code five workflow skills and connects them to Qortara Logic's hosted, read-only evaluator.

## What it includes

- **Five skills:**
  - `qortara-orient`: understand the goal and which of your rules apply.
  - `qortara-govern`: evaluate the policies and governance manifests you supply.
  - `qortara-deliver`: check plans and gate artifacts before your own tools make a change.
  - `qortara-assure`: check evidence-chain integrity, parse verdicts, and show which framework controls your supplied evidence
    maps to.
  - `qortara-improve`: turn supplied failure records into proposed remediation steps.
- **One remote MCP server:** `https://api.qortara.com/mcp`, with 12 deterministic, read-only tools such as
  `qortara_policy_evaluate`, `qortara_gate_validate`, `qortara_chain_verify` and `qortara_compliance_report`.
- **Reference notes** in `references/`, which the skills read.

There are no hooks, no local server, no scripts and nothing to install besides the plugin itself.

## What it does not do

The hosted tools evaluate only what Claude sends them in a tool call. They do not read your files or repositories, edit code,
run tests, review code, deploy or release anything, and they never grant permission to act. They cannot confirm that what you
supply is accurate or complete, so results are only as good as those inputs. Any change to your project is made by Claude
Code's own tools, under your permission settings.

Framework mappings show how supplied evidence maps to EU AI Act, NIST AI RMF and SSDF references (an alignment aid, not a
compliance determination). You classify your own AI systems and remain responsible for your own compliance.

## What it sends and where

- **Connection:** Claude Code connects to `https://api.qortara.com/mcp`, operated by MythologIQ Labs, LLC on Cloudflare.
- **Sign-in:** the first time, you sign in with your email address and a one-time code at `https://auth.qortara.com` (OAuth).
  Qortara keeps your email address to identify your account.
- **Each tool call sends** the tool's arguments, which Claude writes from your conversation, to the evaluator. The evaluator
  returns a decision or findings.
- **Qortara stores** only metadata about each call (time, app, tool, outcome and duration) for 30 days, never the arguments or
  the result. You can see and delete it at `https://app.qortara.com`.

## Plans and limits

The free plan includes 200 tool calls a day, and a shared daily capacity limit applies across free accounts. If a limit is reached,
the tool returns a plain refusal saying when it resets.

## Get started

1. Install the plugin, then run any Qortara skill, for example: "Use qortara-orient to check which rules apply to this change."
2. When Claude Code asks you to authenticate the `qortara-logic` server, sign in with your email and the code Qortara emails you.
3. Review your account, activity and connected apps at `https://app.qortara.com`.

## Support and policies

- Support: `https://qortara.com/support/` or support@qortara.com
- Privacy notice: `https://qortara.com/legal/logic-privacy`
- Terms: `https://qortara.com/legal/logic-terms`

See `LICENSE` for the terms that apply to the plugin files.

## Disclaimer

Qortara Logic evaluates the policies, artifacts and evidence you supply. Its results and framework mappings are informational and do not constitute legal advice, an independent audit, regulatory certification, or authorization to act.
