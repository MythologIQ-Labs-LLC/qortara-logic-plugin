# Security policy

The public Qortara Logic plugin is a small distribution of Claude Code workflow instructions and an authenticated, read-only remote MCP configuration. The Qortara Logic engine runs in a separately governed private service; this repository does not include that engine.

## Report a vulnerability

Please send security reports privately to **security@qortara.com**. Include the affected version, reproducible steps, expected versus observed behavior, and the potential impact. Do not include real customer data, passwords, API keys, tokens or private repository contents in reports.

**Do not disclose a vulnerability in a public GitHub issue before coordinated review.** We will evaluate reports and coordinate fixes based on severity. No guaranteed response or remediation SLA is offered during the public alpha.

## Supported versions

The distribution is currently in pre-release qualification. Version support information will be published with the first approved plugin release.

## Security boundaries

The public plugin contains no local execution hooks, launch scripts or privileged agents. Its remote MCP configuration points to `https://api.qortara.com/mcp` and uses normal OAuth authentication. The hosted evaluator reads only the arguments supplied by the AI host; it does not grant permission to edit repositories, access local files, deploy or release software.
