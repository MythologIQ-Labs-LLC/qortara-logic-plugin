# Qortara Logic for ChatGPT and Claude

![Qortara Logic](assets/qortara-logic.png)

Qortara Logic helps you plan and check AI-assisted software work against the rules and evidence you supply. It provides five public workflow skills and 12 hosted, read-only MCP evaluator tools under one Qortara account. The skills and MCP connection are **separate components**: a host that connects only to MCP gets the tools, not an automatic local installation of the skill files.

This repository is the official public distribution home for Qortara Logic. It contains only plugin files: skills, reference
notes, manifests and branding. The Qortara Logic engine is a hosted service and is not part of this repository.

**Using a different AI client?** Start with the [host-neutral remote MCP connection guide](CONNECT.md). It gives a direct HTTPS/OAuth setup route for compatible clients without downloading a local engine, and explains how to verify a real tool call, revoke access and recognize unsupported hosts. Compatibility depends on the specific client's actual MCP and OAuth capabilities; no single plugin installer works everywhere.

> **Available now without directory approval:** Set up your own custom Qortara Logic MCP connection in a compatible ChatGPT or Claude host, or install the public Claude Code plugin directly from this GitHub repository. Approval of public ChatGPT/Claude directory listings is a separate, optional discovery milestone. Access to custom connections and local plugin/skill installation depends on the specific host and workspace permissions.

## What you get on both platforms

- **Five skills:**
  - `qortara-orient`: inspect repository governance first; initialize missing files with authorized host tools, or maintain the existing baseline and select applicable rules.
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

There are no hooks, local server or automatically executed scripts. The optional offline skill-kit utility described below runs **only when you explicitly invoke it**. It copies the public Markdown skill files and their seven required references; it never configures or authenticates the remote MCP connection.

## Installation paths (what each one actually installs)

| Route | Hosted MCP tools | Five workflow skills | Requires public directory listing? |
| --- | --- | --- | --- |
| ChatGPT custom MCP connection | Yes, after OAuth | Not automatically; separate supported skill/plugin import | No |
| Claude Code plugin from this public GitHub repo | Yes, after OAuth | Yes, via plugin skill files | No |
| Claude remote custom connector | Yes, after OAuth | Not automatically; connector is not a plugin | No |
| Codex CLI remote MCP + optional local kit | Yes, after OAuth | Yes, if installed separately into a supported `.agents/skills` directory | No |
| Other compatible remote-MCP client | Yes, after OAuth | Host-specific, not guaranteed | No |

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

## Connect in ChatGPT now (no directory approval required)

If your ChatGPT account or workspace permits custom remote MCP servers:

1. Open **Plugins**, select **Add (+)** and choose **Add custom MCP server**. Use the official [ChatGPT custom MCP instructions](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) if your screen differs.
2. Enter **Qortara Logic** and the remote URL `https://api.qortara.com/mcp`. Use its supported **OAuth** connection; never paste a bearer token, password or email code into a prompt or plugin file.
3. Review the tools and permissions, complete Qortara's email-code sign-in at `https://auth.qortara.com`, and enable the personal Qortara connection for a conversation.
4. Ask ChatGPT to **call `qortara_capabilities`** and confirm the response identifies the hosted engine and advertised evaluator tools. A saved connector without a successful authenticated call is not sufficient.
5. Request a bounded read-only evaluation. The hosted evaluator cannot independently inspect your repository, execute commands or authorize an agent to make changes.

**Skills are a separate installation.** Connecting the personal MCP server makes the remote tools available; it does **not** automatically import the five `skills/qortara-*/SKILL.md` files. The public source files are in this repository. Use a supported host plugin or skill import flow for local instructions, where available, and verify each skill is present. A directory listing or a separately installed skill-aware plugin may combine both components later; do not treat a working MCP connection as proof of five installed skills.

ChatGPT directory distribution and the separately packaged plugin ZIP are future optional channels, not prerequisites for using the live hosted MCP today. Do not wait for a listing to try the direct connection.

## Install the five local skills independently (Codex CLI or a compatible skill host)

This optional installer is for hosts that recognize an **Agent Skills directory**, such as Codex CLI. Installing skills is separate from connecting MCP and signing in. It does **not** install the private engine, configure OAuth, store credentials, execute hooks, edit host settings or claim that ChatGPT web supports local filesystem skills.

With Node.js 20+ and a reviewed checkout of this **public** repository:

```bash
git clone https://github.com/MythologIQ-Labs-LLC/qortara-logic-plugin.git
cd qortara-logic-plugin
node tools/skill-kit.mjs plan --root "$HOME/.agents"
node tools/skill-kit.mjs install --root "$HOME/.agents"
node tools/skill-kit.mjs verify --root "$HOME/.agents"
```

On Windows PowerShell, use `--root "$HOME\.agents"` (an absolute path). To install only for one project, use its **absolute** `<project>/.agents` path instead. The utility puts five `SKILL.md` files under `<root>/skills/` and the seven referenced Markdown notes under `<root>/references/`. This retains the exact source-relative references inside the skill instructions; copying only `skills/` would break those links. `plan` makes no changes; `install` never overwrites modified files or follows destination symlinks; `verify` fails on missing or altered files. It requires an explicit location and has no network activity.

**Then connect the MCP separately:** for Codex CLI, follow the [Codex steps in CONNECT.md](CONNECT.md#known-host-specific-routes), sign in through the host's OAuth flow, start a fresh session for skill discovery, and actually call `qortara_capabilities`. Successful file installation only proves the public skill files and references are present. It does not prove host loading, OAuth, authorization, tool execution or governance acceptance.

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
