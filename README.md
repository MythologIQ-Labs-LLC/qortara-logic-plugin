# Qortara Logic for ChatGPT and Claude

![Qortara Logic](assets/qortara-logic.png)

Qortara Logic helps you plan and check AI-assisted software work against the rules and evidence you supply. It adds five workflow
skills to your AI assistant and connects them to Qortara Logic's hosted, read-only evaluator. ChatGPT and Claude Code get the same
skills, the same 12 hosted tools and the same account.

This repository is the official public distribution home for Qortara Logic. It contains only plugin files: skills, reference
notes, manifests and branding. The Qortara Logic engine is a hosted service and is not part of this repository.

> **Status:** both listings are being prepared for the ChatGPT and Claude directories, and neither is approved yet. Until a listing
> is approved, use the installation steps below for the platform you use.

## What you get on both platforms

- **Five skills:**
  - `qortara-orient`: understand the goal and which of your rules apply.
  - `qortara-govern`: evaluate the policies and governance manifests you supply.
  - `qortara-deliver`: check plans and gate artifacts before your own tools make a change.
  - `qortara-assure`: check evidence-chain integrity, parse verdicts, and show which framework controls your supplied evidence
    maps to.
  - `qortara-improve`: turn supplied failure records into proposed remediation steps.
- **One hosted MCP server:** `https://api.qortara.com/mcp`, with 12 deterministic, read-only tools:
  `qortara_capabilities`, `qortara_policy_evaluate`, `qortara_gate_validate`, `qortara_chain_verify`, `qortara_verdict_parse`,
  `qortara_compliance_controls`, `qortara_compliance_report`, `qortara_applicability_resolve`, `qortara_route_preview`,
  `qortara_context_select`, `qortara_manifest_resolve` and `qortara_remediation_report`.
- **Reference notes** in `references/`, which the skills read.

The **installed plugin** has no hooks, no local server, and no installation scripts. Nothing executes automatically when you install it. This repository also contains an optional, separately invoked connection helper under `tools/`; it is **not** part of the ChatGPT ZIP or Claude plugin payload.

## Install in Claude Code

This repository is a Claude Code plugin marketplace (`.claude-plugin/marketplace.json`). In Claude Code 2.1.275 or later, install
it in one step:

```
/plugin install qortara-logic --marketplace MythologIQ-Labs-LLC/qortara-logic-plugin
```

On earlier versions, add the marketplace first:

```
/plugin marketplace add MythologIQ-Labs-LLC/qortara-logic-plugin
/plugin install qortara-logic@qortara-logic-plugin
```

Then run any skill, for example: "Use qortara-orient to check which rules apply to this change." When Claude Code asks you to
authenticate the `qortara-logic` server, sign in with your email address and the one-time code Qortara emails you.

## Optional local Claude Code connection helper (development preview)

The separate `tools/qortara-connect.mjs` utility is for users who prefer an explicit local setup command rather than manually entering the remote MCP URL. **It is not an engine installer**, doesn't install private source, and is not invoked when installing the plugin.

Requires Node 20+ and an independently installed Claude Code CLI. Its default behavior makes **no changes**:

```bash
node tools/qortara-connect.mjs
```

To explicitly ask Claude Code to add the remote server to the **current directory's local MCP config**:

```bash
node tools/qortara-connect.mjs --install --scope local
```

To add it to your **user-wide Claude Code settings** instead:

```bash
node tools/qortara-connect.mjs --install --scope user
```

The helper invokes the official `claude mcp add --transport http` command once, without shell expansion on macOS/Linux; Windows uses `cmd.exe` with a fixed, validated command. No OAuth tokens are read or written by the helper. Authenticate afterward using Claude Code's `/mcp` flow. Review Claude Code's own reported status; a successful local CLI operation does **not** prove end-to-end OAuth or provider connectivity.

**Release qualification:** This helper is on an isolated development branch until real Windows/macOS/Linux CLI acceptance, licensing and packaging review. Do not publish it as part of the submitted plugin manifest or create a one-click website installer from it.

## Install in ChatGPT

ChatGPT uses a separate package built from the same skills and references: a ZIP containing `plugin.json`, `mcp.json`, the five
skills, the references and the logo. It is distributed through the ChatGPT plugin directory, not installed from this repository.

1. In ChatGPT, open the plugin directory and search for **Qortara Logic**. It appears there once OpenAI approves the listing.
2. Add it, then sign in with your email address and the one-time code Qortara emails you.
3. Ask, for example: "Orient this change: which Qortara workflow and rules apply?"

Each release lists the SHA-256 checksum of the ChatGPT ZIP in its release notes, so you can match it to what the directory serves.

## What it does not do

The hosted tools evaluate only what your assistant sends them in a tool call. They do not read your files or repositories, edit
code, run tests, review code, deploy or release anything, and they never grant permission to act. They cannot confirm that what
you supply is accurate or complete, so results are only as good as those inputs. Any change to your project is made by your
assistant's own tools, under your permission settings.

Framework mappings show how supplied evidence maps to EU AI Act, NIST AI RMF and SSDF references (an alignment aid, not a
compliance determination). You classify your own AI systems and remain responsible for your own compliance.

## What it sends and where

- **Connection:** your assistant connects to `https://api.qortara.com/mcp`, operated by MythologIQ Labs, LLC on Cloudflare.
- **Sign-in:** the first time, you sign in at `https://auth.qortara.com` (OAuth) with your email address and a one-time code.
  Qortara keeps your email address to identify your account.
- **Each tool call sends** the tool's arguments, which your assistant writes from your conversation, to the evaluator. The
  evaluator returns a decision or findings.
- **Qortara stores** only metadata about each call (time, app, tool, outcome and duration) for 30 days, never the arguments or
  the result. You can see and delete it, disconnect apps, or delete your account at `https://app.qortara.com`.

## Plans and limits

The free plan includes 200 tool calls a day, and a shared daily capacity limit applies across free accounts. If a limit is reached,
the tool returns a plain refusal saying when it resets.

## Support and policies

- Support: `https://qortara.com/support/` or support@qortara.com
- Privacy notice: `https://qortara.com/legal/logic-privacy`
- Terms: `https://qortara.com/legal/logic-terms`
- Security reports: see `SECURITY.md`

See `LICENSE` for the terms that apply to the plugin files.

## Disclaimer

Qortara Logic evaluates the policies, artifacts and evidence you supply. Its results and framework mappings are informational and do not constitute legal advice, an independent audit, regulatory certification, or authorization to act.
