# Security policy

DaySight MCP runs on your own computer. The author runs no server and receives none of your Workday data, so most security questions are about your own setup. The [security overview](https://daysight.dev/security.html) explains how access works and what to check before a rollout.

## Reporting a vulnerability

Please report it privately, not in a public issue.

- Use **Report a vulnerability** under the Security tab of this repository (GitHub private vulnerability reporting), or
- use the [contact page](https://daysight.dev/contact.html) and start the message with "SECURITY".

Include what you found, the version, the steps to reproduce it and, if you can, how it could be misused. Do not include client secrets, tokens or real employee data.

## What to expect

These are targets, not guarantees:

- an acknowledgement within 3 business days;
- a first assessment within 7 days;
- a fix or a mitigation for a critical issue within 7 days of confirming it, and for a high-severity issue within 30 days;
- credit in the release notes if you want it, after the fix is released.

There is no bug bounty. Please give a reasonable time to fix an issue before you disclose it, and do not test against a Workday tenant you do not own or have permission to test.

## What can leave your computer

DaySight MCP only reads from Workday: there are no tools that create, update or delete data, and the Workday client refuses anything but a read request. There is no privacy switch. Whatever Workday lets the signed-in user see can be returned to the AI provider the person is chatting with, including individual-level HR data such as worker names (when asked for), pay, and the total rewards tables. Workday security (the API Client scopes and the user's security groups) is the control that decides what that is. Aggregate answers hide groups under a minimum size (default 3, setting **Smallest group shown**). Personal contact details (home and personal email, phone and address), national IDs and bank details are removed from every answer, and religion and sexual orientation are never read. Work email and work phone come through. When Workday security blocks something, the error says which API Client scope and security domains are needed, so an administrator can grant exactly that and nothing wider.

## Supported versions

Only the latest release is supported. Fixes are published as a new release with a SHA-256 checksum file beside the download (`daysight-mcp-<version>.mcpb.sha256`). Compare it before you install:

```
certutil -hashfile daysight-mcp-<version>.mcpb SHA256       (Windows)
shasum -a 256 daysight-mcp-<version>.mcpb                   (macOS)
```

## If you think your own setup was exposed

1. In Workday, regenerate or disable the API Client secret, and have an administrator revoke the user's tokens for that API Client.
2. In Claude Desktop, remove the extension (Settings > Extensions) and delete the folder `%USERPROFILE%\.daysight-mcp` (macOS: `~/.daysight-mcp`).
3. Review the API activity for that client in Workday.

## Scope

In scope: the DaySight MCP extension and its documentation. Out of scope: Workday, Claude Desktop and any AI provider (report those to their vendors), and findings that need an attacker who already controls the user's computer account.
