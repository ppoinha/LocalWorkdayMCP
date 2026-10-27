<p align="center">
  <img src="docs/assets/daysight-mcp-logo.svg" alt="DaySight MCP logo" width="128" height="128">
</p>

# DaySight MCP for Workday (local install)

Ask analytical questions about your Workday data in plain English, and get answers, charts and dashboards back, signed in as yourself.

**Website:** <https://daysight.dev/> (demo videos, features, examples, install walkthrough and security overview).

This repository contains the **documentation** for DaySight MCP, a [Model Context Protocol](https://modelcontextprotocol.io) server for the Workday REST API. The software is proprietary and its source code is not published. The download, the install guide and the legal pages are on the website.

> **Status: early testing.** Today it is installed locally, by each person, on their own **Windows** computer, through **Claude Desktop**. A central deployment for a whole organization is planned.

## Get started

1. **Read the [install guide (PDF)](https://daysight.dev/downloads/daysight-mcp-install-guide.pdf)** or the [text version](docs/installation-guide.md). It walks through the Workday API Client your HRIS administrator registers, installing the extension and signing in with your own Workday account.
2. **Download the install file** `daysight-mcp-<version>.mcpb` from the [Install page](https://daysight.dev/install.html#download) of the website.
3. In Claude Desktop open **Settings > Extensions > Advanced settings > Install Extension**, pick the file, fill in the form, and use it from the **Chat** tab. The first time you use it, the assistant shows the Licence Agreement, Terms of use and Privacy notice and asks you to reply **I Accept**.
4. Try the [example questions](docs/example-questions.md).

Port 3000 must be free on your PC while you sign in. The guide explains why and how to check.

## 30-day trial

The download is a **30-day trial** for each Workday tenant, counted from the first time you use it. When it ends, your assistant says so and shows a **request code** (a hash, not your tenant name). [Email your request code](https://daysight.dev/contact.html) (contacts@daysight.dev) to get a quote and a licence key, then paste it into the extension's **Licence key** setting. Nothing in Workday is changed when the trial ends, and the check sends nothing off your computer.

## How access works

- For privacy and safety, use it with **Claude Enterprise** or **ChatGPT Enterprise**, with data sharing and model training turned off.
- The **Workday API Client** (registered by your HRIS administrator) limits which parts of Workday the server can reach (its scopes).
- **You sign in with your own Workday account**, so Workday's security still decides what you see. Your assistant never gets more access than you have.
- The client secret and tokens stay on your computer and never reach the model. There is no "call any URL" tool, and DaySight MCP only reads from Workday: it has no tools that change data.

## What works today

| Client | Status |
|---|---|
| Claude Desktop on Windows (Chat tab) | Supported |
| ChatGPT desktop app on Windows | Supported |

## Feedback

Please write to contacts@daysight.dev (or use the [contact page](https://daysight.dev/contact.html)) with what you asked, what you expected and what happened. Do not include client secrets, tokens or real employee data.

## Licence

DaySight MCP is proprietary software, licensed under the [DaySight MCP Licence Agreement](LICENSE) ([web version](https://daysight.dev/license.html)). Each Workday tenant gets a free 30-day evaluation (see above); after that a licence key is needed. Earlier versions that were distributed under the PolyForm Noncommercial License 1.0.0 stay under that licence. Third-party components are listed on the [attributions page](https://daysight.dev/attributions.html). [Terms of use](https://daysight.dev/terms.html) and [privacy notice](https://daysight.dev/privacy.html) for the website.

Copyright (c) 2026 Paulo Poinha, Chruzackerstr 28, 8193 Eglisau, Switzerland.
