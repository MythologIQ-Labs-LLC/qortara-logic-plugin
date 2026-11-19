# Connect Qortara Logic from another AI client

Qortara Logic runs one hosted, OAuth-protected **remote MCP** service. An AI client that supports **remote MCP over Streamable HTTP and the required OAuth sign-in flow** can be configured to request its hosted tools. A client that lacks those features cannot be made compatible merely by copying a plugin file.

**MCP endpoint:** `https://api.qortara.com/mcp`

This is a manual, host-neutral connection guide. It does not install software, open a repository, submit credentials, or authorize a host to act on your behalf. The public skills in this repository are optional and are not required to connect to the hosted MCP.

## Configure your client

1. In your AI client's **MCP server / connectors / integrations** settings, choose its supported **remote HTTP MCP** option. The wording and permissions vary by host.
2. Name the connection **Qortara Logic**, enter `https://api.qortara.com/mcp`, and use the client's supported **OAuth authorization** mechanism. Never configure it as an unauthenticated public server or paste a token into a skill, prompt, source file, Git repository, or screenshot.
3. Review the permissions the client requests. Complete Qortara's email-code sign-in in the **host-controlled authorization flow** when prompted. Do not authorize an unexpected domain or share your emailed code with the agent.
4. In the authenticated client, inspect the MCP tool list and invoke `qortara_capabilities`. A visible tool name or a saved connection entry alone is **not** evidence that the user signed in, that the call reached Qortara, or that the client honors a refusal.
5. Try a permitted read-only evaluation with non-sensitive test arguments. Check that the result identifies a bounded evaluation, not repository access or permission to execute commands. For any write or repository action, require independent permissions from the actual host and repository.

**Transport compatibility is a precondition, not an installation promise.** If your client supports only local stdio MCP, uses a different remote transport, cannot complete compatible OAuth, or blocks custom connectors under its plan/workspace policy, this hosted-only package does not supply a local proxy or bypass. Check the client's official documentation. A future local bridge would be a separate, explicitly reviewed package, not an implicit component of this repository.

## Known host-specific routes

- **Claude Code:** The official hosted-only Claude plugin instructions and marketplace setup are in the [README](README.md#install-in-claude-code). To use only MCP without the five skills, the separately documented CLI route is `claude mcp add --transport http qortara-logic https://api.qortara.com/mcp`; then confirm with `claude mcp get qortara-logic`, authorize in `/mcp`, and **actually invoke** `qortara_capabilities`. A successful `mcp add` exit does not prove authentication or an executable tool call.
- **ChatGPT:** Use the supported custom remote-MCP/plugin flow if your account or workspace permits it. The directory listing and a personal custom connection are different distribution paths. The [README](README.md#install-in-chatgpt) describes the hosted package; listing approval must be checked in the product, not inferred from this repository.
- **Other clients:** Follow the generic steps above only if the specific client/version actually supports both remote MCP Streamable HTTP and Qortara's OAuth requirements. **No compatibility, browser-extension support, IDE coverage, or model-level parity is asserted without a recorded real-host test.** Host-specific JSON manifests are not universal: do not paste this repository's Claude `.mcp.json` into an unrelated client's configuration and assume it will work.

## What the public package does and does not contain

This repository distributes **five hosted-only workflow skills**, bounded reference notes, public Claude plugin metadata, `.mcp.json`, licensing and branding. It contains **no proprietary Python engine, Cloudflare Worker implementation, local agent runner, executable hook, private prompt/rubric, API credential, OAuth client secret, or entitlement logic**. The cloud service keeps the canonical evaluation and access controls on the server; the public MCP URL is an endpoint, not an access grant.

The hosted tools evaluate **the arguments your client sends**. They do **not** automatically read your private repository or local files, execute shells, merge pull requests, modify code, or grant release approval. Do not send confidential source material unless your organization's policies allow sending it to the hosted service. A downloaded skill can guide a host, but cannot enforce what tools that host may run.

For a local, full-engine development workflow, use the separately licensed, separately authorized native edition. **Do not mistake the private `qortara-logic` repository's root native Claude bundle for this public hosted-only package.**

## Disconnect and troubleshoot

Disconnect or disable the MCP connection in your AI client, and use [Qortara account management](https://app.qortara.com) to review or revoke the corresponding app connection. A local configuration removal and server-side token revocation serve different purposes. If you suspect credential exposure, revoke access and do not re-use the exposed token.

If tool discovery succeeds but a call fails, check client permissions, completed Qortara OAuth, supported MCP transport, session expiry, the account's current rate/usage limits, and the exact refusal status. **Never work around an authorization refusal by embedding a static token or switching to an anonymous endpoint.**

The [Qortara website](https://qortara.com) is the customer-facing entry point; the public [plugin README](README.md) explains the Claude and ChatGPT packages. This guide does not certify third-party host support or announce a new public listing.
