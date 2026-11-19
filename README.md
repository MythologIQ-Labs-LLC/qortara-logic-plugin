# Qortara Logic

![Qortara Logic](assets/qortara-logic.png)

**Govern AI-assisted software development, from the initial plan to verified results.**

Qortara Logic helps an AI coding assistant understand a project, apply its governance, guide implementation, check evidence, and learn from failures. **Your AI assistant uses its own authorized tools to do the work. Qortara does not receive access to your GitHub repositories just because you connect the plugin.**

[Product overview](https://www.qortara.com/logic/) · [Logic documentation](https://www.qortara.com/docs/logic/) · [Connection guide](CONNECT.md) · [Support](https://www.qortara.com/support/)

## Start here

**Using Claude Code?** Install the plugin to get all five skills **and** the hosted MCP connection. **Using ChatGPT or another MCP-compatible client?** Connect to the hosted MCP; importing the five local skills is a separate, host-specific step.

| Your AI host | Installation path | What you get |
| --- | --- | --- |
| **Claude Code** | [Install the Claude plugin](#claude-code-install-the-plugin) | Five skills plus the hosted MCP, once authenticated |
| **ChatGPT** | [Connect the hosted MCP](#chatgpt-connect-the-mcp) | Hosted MCP tools; the five local skill files are **not** imported automatically |
| **Codex CLI** | [Connect MCP and optionally install skills](#codex-cli-and-other-skill-aware-hosts) | Hosted MCP; optionally all five local skill instructions |
| **Other clients** | [Connect an MCP-compatible host](#other-ai-clients) | Hosted tools if the host supports remote HTTP MCP and compatible OAuth; skill support varies |

The public plugin is distributed from this GitHub repository. **Approval for a public ChatGPT or Claude directory listing is separate from installing from GitHub or connecting a custom MCP server.**

## Claude Code: install the plugin

**Requirements:** Claude Code, access to the public GitHub repository, and the ability to complete an OAuth login. The public plugin contains no local Qortara engine, Python runtime, hooks, or background server.

**Option A: one-step install in a Claude Code session** (Claude Code 2.1.275 or later):

```text
/plugin install qortara-logic --marketplace MythologIQ-Labs-LLC/qortara-logic-plugin
```

Review the plugin details, choose the installation scope, and install. Claude may prompt you to reload plugins.

**Option B: add the marketplace first**, then install (also useful in older versions):

```text
/plugin marketplace add MythologIQ-Labs-LLC/qortara-logic-plugin
/plugin install qortara-logic@qortara-logic-plugin
```

To install from a system terminal instead of a Claude session:

```bash
claude plugin marketplace add MythologIQ-Labs-LLC/qortara-logic-plugin
claude plugin install qortara-logic@qortara-logic-plugin
```

The marketplace name is **`qortara-logic-plugin`** and the plugin name is **`qortara-logic`**. Do not confuse this public hosted-only plugin with the separate native-engine development repository.

### Connect and verify

1. Open the plugin in Claude Code. When prompted for the `qortara-logic` MCP connection, approve the OAuth sign-in and complete the email-code flow at **`https://auth.qortara.com`**. Do not paste your one-time code into a chat, source file, or configuration.
2. Check the connection in Claude Code using **`/mcp`**, and verify the hosted server is connected and authenticated.
3. Ask Claude to **invoke `qortara_capabilities`** and report the tools actually returned. This is the authoritative check of the deployed backend; an installed plugin or a listed server is not enough.
4. Verify the five Qortara skills are available. Try: *"Use qortara-orient to inspect the governance of this repository and report what is missing, without changing files."* Repository access still depends on Claude's own permissions.

**Expected outcome:** five skills, one hosted connection, and a successful authenticated MCP tool call. A connected MCP does not by itself initialize governance, approve a policy, or authorize writes.

### Update an existing Claude installation

Run this **in a system terminal**, not as a prompt to the model:

```bash
claude plugin update qortara-logic@qortara-logic-plugin
```

Alternatively, open **`/plugin` → Installed → Qortara Logic → Update now**. Reload plugins if Claude asks; restart the session if a change is not picked up. Recheck `/mcp` and invoke `qortara_capabilities`.

**When is an update necessary?** Changes to the five locally installed skill instructions or Claude plugin metadata require a plugin update. **Backend-only** MCP tool or workflow changes become available after the backend is deployed and discovered through MCP; they do **not** require installing new skills. A GitHub merge alone does not deploy the backend.

[Claude's official plugin instructions](https://code.claude.com/docs/en/discover-plugins)

## ChatGPT: connect the MCP

If your ChatGPT account or workspace supports custom remote MCP connections:

1. Open **Plugins → Add (+) → Add custom MCP server** (the labels may differ by client). Follow [OpenAI's current instructions](https://help.openai.com/en/articles/12584461-connecting-custom-mcp-servers-in-chatgpt) if the controls differ.
2. Enter **Qortara Logic** as the name and **`https://api.qortara.com/mcp`** as the server URL.
3. Complete the host-controlled OAuth and email-code sign-in. Review the tool permissions.
4. Enable the connection in a conversation, then ask ChatGPT to **invoke `qortara_capabilities`** and show the actual result.

**Important:** connecting MCP provides the hosted tools, **not automatic installation of the five `SKILL.md` files**. Whether ChatGPT can install or import those instructions depends on the supported plugin/skill distribution path. Do not interpret an MCP connection as proof that the five skills were loaded.

## Codex CLI and other skill-aware hosts

**Connect the hosted MCP** using Codex CLI's remote server support:

```bash
codex mcp add qortara-logic --url https://api.qortara.com/mcp
codex mcp login qortara-logic
codex mcp get qortara-logic
```

After authenticating, **actually invoke `qortara_capabilities`** from Codex. The commands configure a connection; they do not install skills or verify a successful tool call.

**Optional: install the five portable skill files.** This requires Git, Node.js 20+, and an explicit target directory supported by your host:

```bash
git clone https://github.com/MythologIQ-Labs-LLC/qortara-logic-plugin.git
cd qortara-logic-plugin
node tools/skill-kit.mjs plan --root "$HOME/.agents"
node tools/skill-kit.mjs install --root "$HOME/.agents"
node tools/skill-kit.mjs verify --root "$HOME/.agents"
```

On Windows PowerShell, the corresponding absolute root is `"$HOME\.agents"`. You can also use an absolute project-specific `.agents` directory. The utility copies five skills and seven required reference notes **offline**, never configures OAuth, never overwrites modified files, and refuses unsafe destination links. Do not copy only `skills/` without `references/`; their relative links must remain intact.

Skill-file installation and MCP authentication are separate checks. Start a fresh session if needed for skill discovery. This utility is **not** a ChatGPT web installer.

## Other AI clients

A compatible AI client may connect to **`https://api.qortara.com/mcp`** if it supports **remote MCP over Streamable HTTP** and Qortara's **OAuth sign-in**. Its ability to import the five skill instructions is a separate capability. An MCP-only connection does not make a client a fully tested Qortara plugin host.

See [CONNECT.md](CONNECT.md) for a generic setup, security boundaries, troubleshooting, and known host-specific connection routes. **Do not assume every MCP client or operating system has been qualified.** Windows and Linux package tests are not proof of installation and model-driven acceptance on every host.

## What the five skills do

| Skill | Purpose |
| --- | --- |
| **Orient** | Understand the repository, identify its applicable governance, and route initialization or repair |
| **Govern** | Check policies, source authority, owner decisions, and lifecycle requirements |
| **Deliver** | Guide authorized implementation, refactoring and delivery through required gates |
| **Assure** | Check CI, review, audit, evidence integrity and release readiness |
| **Improve** | Investigate recurring failures and propose evidence-based corrective actions |

These are **exactly five public entrypoints** in Claude and ChatGPT's intended orchestration design. The hosted MCP provides the underlying tools and canonical workflows. Its catalog can grow without adding a sixth skill. For example, governance initialization, CI Guard and Repository Delivery Assessor are **backend capabilities**, not separately installable public skills. **Invoke `qortara_capabilities` to see what is deployed**, not what merely exists in source.

## Permissions, data and availability

- **One hosted service:** `https://api.qortara.com/mcp`, protected by OAuth. First approved sign-in creates a free Logic account in supported hosts. Free access has usage limits; [see current availability](https://www.qortara.com/start/).
- **Your host owns execution:** Qortara's MCP does not automatically read your repository, run commands, edit code, create PRs, merge, deploy or grant approvals. Your AI host needs separate authorization for every such action. An MCP `ALLOW` or `PASS` response does not override your policies.
- **Inputs and privacy:** the host may send selected arguments and governance evidence to the MCP for evaluation. Do not submit passwords, tokens, secrets or confidential source material without authorization. See [privacy](https://qortara.com/legal/logic-privacy) and [terms](https://qortara.com/legal/logic-terms).
- **Not yet proven everywhere:** source files, passing package CI, a registered OAuth connection and a real host-executed workflow are different levels of evidence. Public directory approval and paid checkout have separate release gates.

## Troubleshooting

| Problem | What to check |
| --- | --- |
| Plugin installed, skills not visible | Use `/plugin` to check installation scope and enabled status; reload/restart if prompted |
| Skills visible, MCP call fails | Use `/mcp`, complete OAuth, check host permissions and account limits, then retry `qortara_capabilities` |
| MCP tools visible, skills absent | MCP-only connections do not import skill files; install the supported host plugin or portable skills separately |
| A workflow/tool is missing | Check the **deployed** `qortara_capabilities` response; a source PR may not have shipped to Cloudflare |
| Repository operation refused | Check the host's actual repository permissions, accepted governance, revision-bound evidence and requested approval; never bypass a refusal |

**Support:** [qortara.com/support](https://www.qortara.com/support/) · [Security reporting](SECURITY.md) · [Plugin license](LICENSE)

*Qortara Logic provides governance and evidence evaluation, not legal advice, regulatory certification, an independent audit, or authority to change your repository.*
