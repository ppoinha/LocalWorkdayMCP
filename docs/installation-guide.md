# Workday MCP: installation guide

Connect Claude to Workday and ask questions in plain English, signing in with your own Workday account. The recommended route is a one-file install into **Claude Desktop on Windows**: you register your own Workday API Client (section 3), install `workday-mcp-0.1.1.mcpb` from Claude Desktop's Settings, fill in a short form with your own client details, and sign in. 

**Licence:** the Workday MCP software and this guide are source-available and free for **non-commercial use only** under the [PolyForm Noncommercial License 1.0.0](https://github.com/ppoinha/LocalWorkdayMCP/blob/main/LICENSE). Commercial use is not permitted.

*Client-support information was checked against vendor documentation on 21 October 2026. These products change quickly, so treat the "supported today" notes as a snapshot and check the linked sources.*

---

## 1. Read this first

**Today it is installed locally, by each person, on their own Windows computer.** The recommended install is the Claude Desktop extension file (`workday-mcp-0.1.1.mcpb`): Claude Desktop runs it with its own built-in Node.js, so there is nothing else to install and no config file to edit. Every person who wants to use it installs the extension themselves, **registers their own Workday API Client** (their own client ID and secret, nothing shared with anyone else) and signs in with their own Workday account. Only Windows has been tested so far; the extension file is also built for macOS, but treat that as untested.

**A central deployment is planned.** A later phase adds a remote (HTTPS) transport, per-user sign-in and per-user token storage, so one hosted server can serve a whole organization with no local install. Until then, clients that can only connect to remote servers (ChatGPT, Microsoft Copilot Studio, the "custom connector" dialog in Claude) cannot use it. See the [support matrix](#6-which-clients-can-use-it-today) and [hosting strategies](#8-where-to-run-the-server).

### How authorization works

There are two layers, and both apply on every request:

1. **The Workday API Client sets the outer limit.** When you register the API Client in Workday you choose its *scopes* (functional areas such as Staffing or Organizations and Roles). The server can only reach resources inside those scopes, whoever signs in.
2. **The signed-in user sets what comes back.** Each user opens a Workday sign-in page in their browser and authorizes the API Client to act as them. Workday then applies *that user's* security permissions to every call. A manager sees their reports; a regular employee does not. The AI never gets more access than the person using it.

The assistant never sees the client secret or tokens. They are read from your local configuration and kept in an encrypted token file; they are never put into tool arguments, results or logs. There is no generic "call any URL" tool: the assistant can only invoke the specific Workday operations the server exposes. Write operations (job changes, business title changes) are hidden unless you set `WORKDAY_ENABLE_WRITES=true`.

---

## 2. What you need

**For the recommended extension install (Windows):**

| Item | Notes |
|---|---|
| A Windows computer with **Claude Desktop** (current version) | Free or paid Claude account; signed in. Extensions are installed from Claude Desktop's settings. |
| The extension file `workday-mcp-0.1.1.mcpb` | Download it from the **Releases** page of this repository, <https://github.com/ppoinha/LocalWorkdayMCP/releases> (under *Assets* of the latest release). It contains no secrets. |
| **Your own Workday API Client** | You register it yourself in Workday (section 3). That gives you your own client ID and client secret, plus the authorization and token endpoints. Nobody else needs, or should receive, your secret. |
| Your own Workday account | The one you will sign in with. Its permissions decide what you see. |
| A web browser on the same computer | The sign-in page opens there and redirects back to `localhost`. |
| **Port 3000 free** on your PC during sign-in | The sign-in callback `https://localhost:3000/callback` listens on port 3000 while you log in. See the note below. |

**Port 3000 must be free.** While you sign in, the extension briefly listens on your computer at `https://localhost:3000/callback`, and Workday sends your browser back to that address. If another program already uses port 3000 (a development server, another app, a previous sign-in that is still waiting), the sign-in fails. If this happens, `workday_login` stops with a message naming the port. Close that program and try again; section 10 shows how to check what is using the port. The port in the **Redirection URI** form field must match the port Workday has registered for the API Client. If you use a different port, register that exact URI in Workday and enter the same one in the extension.

You do **not** need Node.js, Git or npm.

**Permission to register an API Client.** Registering an API Client needs a Workday security permission. If you do not have it in your tenant, ask your Workday administrator to grant it, or to register a client for you (it is still yours: your client ID and secret, used only by you).

---

## 3. Workday setup, step by step

**Each user does this for themselves:** you register your own API Client, so you get your own client ID and secret. Do steps 1 to 6 once, then install the extension (section 4) and sign in (section 5). If you cannot do a step yourself, your Workday administrator can do it with you.

> **Honesty note.** Task names below are the standard ones used across Workday integration guides. Exact labels and the security domain names can differ by tenant, release and configuration, and Workday's own documentation sits behind a customer login. If a label does not match your screen, search the task name in the Workday search bar or ask your Workday security administrator. The tenant's own *View API Client* report is the authority for URLs and scope identifiers.

### Step 1. Check who is allowed to register API Clients

The person registering the client needs permission on the security domain that secures the *Register API Client for Integrations* task. Use the Workday report **View Security for Securable Item** on that task to see which domain and security groups control it, then make sure the group of whoever registers the client (you or your administrator) has the required (Modify/Put) access. Changes to security policy only take effect after step 5.

### Step 2. Register the API Client

1. In Workday, search for the task **Register API Client for Integrations** and open it.
2. Fill in:

| Field | Value |
|---|---|
| **Client Name** | A recognizable name, for example `Workday MCP (pilot)`. |
| **Client Grant Type** | **Authorization Code Grant**. This is what lets each user sign in as themselves. |
| **Access Token Type** | **Bearer**. |
| **Redirection URI** | `https://localhost:3000/callback`. It must match `WORKDAY_REDIRECT_URI` (the extension's *Redirection URI* field) exactly, including the port. Your PC listens on this address only while a login is in progress, with a locally generated self-signed certificate, so **port 3000 must be free on your PC** during sign-in. If you register a different port, use that exact URI in the extension form. |
| **Non-Expiring Refresh Tokens** | **Tick this.** Without it a user has to log in again every time the short-lived access token expires. With it the server refreshes silently. |
| **Scope (Functional Areas)** | Choose the scopes from the table below. |

3. Optionally leave **Include Workday Owned Scope** unticked unless you know you need it.
4. Click **OK**. Workday shows the **Client ID** and **Client Secret**. **Copy the secret now**: it is shown once. Store both in a password manager. Never put them in chat, email, tickets, screenshots or Git.

> **Your client ID and secret are yours alone.** Each user registers their own API Client, so the secret is never shared or sent to anyone. Claude Desktop stores it securely on your computer. If it ever leaks (chat, email, screenshot, Git), regenerate it in Workday. If your API Client has **Support Proof Key for Code Exchange** ticked and your tenant accepts clients without a secret, you can tick **Use PKCE** in the extension form and leave the secret empty.

### Step 3. Choose scopes (functional areas)

The scope limits which parts of Workday the server can reach at all. The extension form defaults to `staffing organizations_and_roles`, which covers workers and organizations. Start small and add more later; changing scopes later means users must log in again to authorize the new scope.

| Scope (functional area) | Enables these tools | Recommended |
|---|---|---|
| **Staffing** | `workers_*` (get, list, direct reports, history, business title changes), `jobChangeReasons_*`, `supervisoryOrganizations_*` | Yes, start here |
| **Organizations and Roles** | `organizations_*`, `organizationTypes_*`, `supervisoryOrganizations_*`, `workers_organizations_*` | Yes, start here |
| **Time Off and Leave** | `workers_timeOffPlans_*`, `workers_timeOffEntries_*` | Optional |
| **Tenant Non-Configurable** | `workers_inboxTasks_*`, `currencies_*` | Optional |
| **Core Payroll** | `workers_paySlips_*` | Only if you really need it; sensitive |
| **Customers**, **Customer Accounts** | `customers_*` | Optional |
| **System** | `auditLogs_*` (deprecated by Workday) | Not recommended |
| **Common Financial Management, Worktags** | `validateWorktags_run` | Not needed for HR use |

The mapping comes from the scopes and security domains documented per operation in the Workday REST OpenAPI file the server is generated from (`spec/common_oas3.json`); each tool's description lists its scope and the security domain that secures it. The user approves the API Client on Workday's consent page when they log in.

### Step 4. Security domain permissions

Scopes are not enough on their own. Each REST operation is also secured by one or more **security domains**, and the *signed-in user's* security groups must have **View/Get** access to them. Examples taken from the operations the server exposes:

| What you ask | Security domain(s) the user needs access to |
|---|---|
| Your own worker record (`workers/me`) | Self-Service: Current Staffing Information, or Worker Data: Public Worker Reports |
| Direct reports, team | Self-Service: My Team, Reports: Manager |
| Worker history | Worker Data: Historical Staffing Information |
| Organizations | Reports: Organization |
| Time off balances | Self-Service: Time Off Balances |
| Inbox tasks | Core Navigation |
| Pay slips | Self-Service: Payroll (My Payslips) |

In practice most employees already have the self-service domains, and managers already have the team domains, so a pilot normally needs no security changes beyond the API Client itself. If a user gets "permission denied" for something they can do in the Workday UI, check the domain named in the tool's description with **View Security for Securable Item**.

**This is the point of the design:** the server does not widen anyone's access. If a user cannot see something in Workday, the AI cannot either.

### Step 5. Activate pending security changes

If you changed any security group permissions (step 1 or step 4), run the task **Activate Pending Security Policy Changes** and confirm.

### Step 6. Collect the endpoints (View API Client)

1. Run the report **View API Client** (a "View API Clients" report lists all of them) and open your client.
2. Copy these values. They differ per tenant and data center, so do not guess them:

| Value | Shape (example, not real) | Goes into |
|---|---|---|
| **Authorization Endpoint** | `https://<tenant host>.myworkday.com/<tenant>/authorize` | extension form: *Authorization Endpoint* (`WORKDAY_AUTH_URL`) |
| **Token Endpoint** | `https://<services host>/ccx/oauth2/<tenant>/token` | extension form: *Token Endpoint* (`WORKDAY_TOKEN_URL`) |
| **Workday REST API Endpoint** | `https://<services host>/ccx/api/v1/<tenant>` | derived automatically (optional `WORKDAY_API_BASE`) |
| **Client ID** | long random string | extension form: *Client ID* (`WORKDAY_CLIENT_ID`) |
| **Client Secret** | long random string (from step 2) | extension form: *Client Secret* (`WORKDAY_CLIENT_SECRET`) |
| **Scope identifiers** | for example `staffing`, `organizations_and_roles`, `system`, `tenant_non_configurable` | extension form: *Scopes*, space-separated (`WORKDAY_SCOPES`) |
| **Redirection URI** | `https://localhost:3000/callback` (as registered in step 2) | extension form: *Redirection URI* (`WORKDAY_REDIRECT_URI`) |

Note that the authorization host usually differs from the services host. Always copy the authorization URL from the report.

---

## 4. Install the Claude Desktop extension (recommended, Windows)

1. Download `workday-mcp-0.1.1.mcpb` from the repository's [Releases page](https://github.com/ppoinha/LocalWorkdayMCP/releases) (under *Assets*) and save it somewhere you can find it, for example your Downloads folder. Make sure Claude Desktop is installed and you are signed in.
2. In Claude Desktop open **Settings > Extensions > Advanced settings > Install Extension** and pick the `workday-mcp-0.1.1.mcpb` file.
   - This is the only install route we have confirmed. Use it rather than opening the file from Explorer.
3. Claude Desktop shows the extension ("Workday") and its details. Review them and confirm the installation.
4. Fill in the form with the values from **your own** API Client (section 3, step 6):

| Form field | What to enter |
|---|---|
| **Client ID** | From the API Client (required) |
| **Client Secret** | From the API Client. Stored securely by Claude Desktop. Leave empty only if you use PKCE without a secret. |
| **Authorization Endpoint** | For example `https://<host>/<tenant>/authorize` |
| **Token Endpoint** | For example `https://<services host>/ccx/oauth2/<tenant>/token`. The tenant and API address are derived from it. |
| **Redirection URI** | Keep the default `https://localhost:3000/callback`. It must be registered on the API Client, and its port (3000) must be free on your PC when you sign in. |
| **Scopes** | Space-separated scope identifiers, default `staffing organizations_and_roles` |
| **Use PKCE** | Leave off unless your API Client has *Support Proof Key for Code Exchange* ticked |
| **Allow changes in Workday** | Leave **off**. It enables the job change and business title change tools. |

5. Turn the extension **on** (toggle in Settings > Extensions).
6. **Use it from the Chat tab.** Switch to the **Chat** tab of Claude Desktop (not the **Code** tab, the one with *Add folder* and slash commands) and start a **new chat**. Click **+**, then **Connectors**, and check that **Workday** is switched on. You do not need to edit any config file.

> **Chat tab only.** The Workday extension works in the Chat tab of Claude Desktop. In the Code tab its tools do not load, and Claude will tell you that no `workday_auth_status` (or other Workday) tool exists.

To change a value later, go to Settings > Extensions > Workday, update the form and restart the chat.

---

## 5. Sign in to Workday

Before you start, make sure **port 3000 is free** on your PC (see section 2 and the troubleshooting section) and close any program that uses it.

1. In a **new chat in the Chat tab**, ask: *"Call workday_login."* Claude Desktop may ask you to allow the tool; allow it.
2. Your browser opens the Workday sign-in page. If nothing opens, Claude shows the URL; copy it into your browser.
3. Sign in to Workday as **yourself** and approve the API Client.
4. Workday redirects to `https://localhost:3000/callback`. Because the extension uses a locally generated self-signed certificate, **your browser warns once**. Continue to `localhost` (this stays on your computer). The browser also shows a one-time **Not secure** warning on the callback page; that is expected.
5. Back in Claude, ask *"Call workday_auth_status."* It should say you are signed in. The login is stored encrypted in your Windows user profile and refreshed automatically, so you normally sign in once. If the API Client was registered without non-expiring refresh tokens you will have to repeat this regularly.

The login window waits 90 seconds by default. If you were too slow, ask for `workday_login` again. `workday_logout` removes the stored login.

Then try the questions in the [example questions](example-questions.md), for example *"Who reports to me?"*

---

## 6. Which clients can use it today

The server currently speaks **stdio only**: the client starts it as a local process (the Claude Desktop extension does this for you). Some products can only connect to **remote HTTPS** servers.

| Client | Connects to local stdio server? | Connects to remote HTTPS server? | Works with Workday MCP today? |
|---|---|---|---|
| **Claude Desktop** (Windows, `.mcpb` extension; **Chat tab** only, not the Code tab) | Yes, via the extension | Yes, via Settings > Connectors (custom connector) | **Yes, recommended** (section 4) |
| **ChatGPT** (web; Plus, Pro, Business, Enterprise, Education, via Developer mode) | **No**, remote endpoints only | Yes (streaming HTTP and SSE; OAuth, none, or mixed) | **Not yet**, needs the planned remote deployment |
| **Microsoft Copilot Studio** (agents) | Not documented; the wizard asks for a server URL | Yes (Streamable HTTP; SSE no longer supported; none, API key or OAuth 2.0) | **Not yet**, needs the planned remote deployment |
| **Microsoft 365 Copilot** (chat) | No direct local support documented | Through Copilot Studio agents or admin-registered servers | **Not yet** |
| Other MCP clients (Cursor, Windsurf, Gemini CLI, and others) | Usually yes | Varies | Not supported by this extension. **Not tested by us.** |

Sources: [ChatGPT developer mode](https://developers.openai.com/api/docs/guides/developer-mode), [Copilot Studio MCP](https://learn.microsoft.com/en-us/microsoft-copilot-studio/agent-extend-action-mcp), [Connect local MCP servers](https://modelcontextprotocol.io/docs/develop/connect-local-servers).

---

## 7. Other clients

The extension in section 4 is the supported route today. These notes describe what other clients can and cannot do.

### 7.1 ChatGPT

**Honest status: not possible today.** ChatGPT connects to **remote MCP endpoints** (public HTTPS), not to local stdio processes, and the Workday MCP server has no HTTP transport yet. When the central deployment exists, the steps will be roughly:

1. In ChatGPT: **Settings > Apps > Advanced settings > Developer mode** (available to Pro, Plus, Business, Enterprise and Education accounts on the web).
2. **Create app**, give it a name, enter the server's HTTPS MCP URL, choose authentication (OAuth), and confirm.
3. Start a conversation, choose **Developer mode** from the plus menu and select the app.

Developer mode supports read and write tools; write actions require confirmation by default, and tools marked read-only are treated as such. Menu names have changed between releases ("Apps" versus "Plugins"), so check the current [OpenAI documentation](https://developers.openai.com/api/docs/guides/developer-mode) when the time comes.

Exposing your local server to ChatGPT through a tunnel is **not recommended** with the current version: the server has no HTTP transport, and a tunnel would put a server holding your signed-in Workday session on the internet.

### 7.2 Microsoft Copilot (Copilot Studio and Microsoft 365)

- **Copilot Studio** agents can add an MCP server (Tools > Add a tool > New tool > Model Context Protocol, with server name, description, server URL, authentication). They currently require **Streamable HTTP** and generative orchestration, and a Power Platform data policy applies. This needs the planned remote deployment.
- **Microsoft 365 Copilot** chat has no documented path to a local stdio server. Microsoft documents bring-your-own MCP server registration through admin tooling; that also implies a remote server.

### 7.3 Other MCP clients

The installer in this repository is built for Claude Desktop on Windows. Other desktop and IDE clients are not supported yet.

---

## 8. Where to run the server

| Option | Status | How it works | Good for | Watch out for |
|---|---|---|---|---|
| **A. Each user's own computer** | **Available now** | Each user installs the `.mcpb` extension in Claude Desktop on Windows (Claude's built-in Node runs it) and signs in with their own Workday account. | Pilots and early testers | Self-install and self-registration per person: each user has their own API Client and secret, so nothing is shared. Updates mean installing a newer `.mcpb` file. |
| **B. Shared jump host / VDI** | Possible, not designed for it | Users run the server inside a managed remote desktop. | Locked-down corporate laptops | The token store is per OS user, so give each person their own account. Still one login per person. |
| **C. Central server for the whole organization** | **Planned** (final stage, roadmap phase 7) | One hosted server speaks Streamable HTTP. Users connect from their AI client with a connector URL and sign in once; the server keeps a separate encrypted token per user. | Production rollout, ChatGPT / Copilot Studio / Claude custom connectors | Needs new work: HTTPS transport, MCP-level OAuth in front, per-user token store, session isolation, audit logging, secrets in a vault, and a redirect URI on the server's own domain. |
| **D. Local server behind a tunnel** | **Not recommended** | A tunnel or proxy turns a local stdio server into a public endpoint. | Nothing in production | Exposes a signed-in Workday session. The current server has no HTTP transport or per-user auth. |

**Likely target for option C:** a container (for example Azure Container Apps, AWS Fargate or Kubernetes) or a small VM behind a reverse proxy with TLS, the client secret in the platform's secret store (Key Vault, Secrets Manager), an encrypted per-user token database, and your identity provider in front. When it is built, the API Client in Workday will need an additional **Redirection URI** for the hosted callback. The authorization model stays the same: scopes limit the reach, and each person's own Workday permissions decide what they see.

---

## 9. Verify it works

Ask Claude (in the Chat tab of Claude Desktop):

1. *"Call workday_auth_status."* Expect: signed in, with your tenant and whether it can refresh.
2. *"Who am I in Workday?"* (uses `workers_get` with id `me`).
3. *"Who reports to me?"* (`workers_directReports_list`).
4. *"List the first 10 supervisory organizations."*

Example prompts for your team are in the [example questions](example-questions.md).

## 10. Troubleshooting

| Symptom | Likely cause and fix |
|---|---|
| The extension will not install | Use **Settings > Extensions > Advanced settings > Install Extension** and select the `.mcpb` file. Make sure Claude Desktop is a current version. |
| The extension is installed but Workday tools are missing, or Claude says there is no `workday_auth_status` tool | You are probably in the **Code** tab, where the extension does not load. Switch to the **Chat** tab and start a **new chat**. Then click **+ > Connectors** and check that **Workday** is on. Also check that the extension is toggled on in Settings > Extensions and that the required form fields (Client ID, Authorization Endpoint, Token Endpoint, Redirection URI) are filled in. |
| "spawn node ENOENT" / server fails to start | The client cannot find `node`. Use the full path to `node.exe` / `node`, especially with nvm. |
| Config JSON error | Doubled backslashes missing, trailing comma, or a smart quote copied from a document. |
| `Missing configuration: ...` | A required form field is empty. Open Settings > Extensions > Workday and fill in Client ID, Authorization Endpoint, Token Endpoint and Redirection URI. |
| Browser shows a certificate warning | Expected once for the self-signed `https://localhost:3000` callback. Continue to localhost. |
| Sign-in fails, hangs, or the browser says it cannot connect to `localhost:3000` | Port 3000 must be free during sign-in because the callback listens there. Check what is using it (below), close that program, and run `workday_login` again. If you cannot free the port, register another redirect URI on your API Client (or ask your Workday administrator to) (for example `https://localhost:3100/callback`) and enter exactly that value in the extension's **Redirection URI** field. The port in the extension and the one registered in Workday must be identical. |
| Login works but a tool returns 403 / permission denied | Either the scope is missing on the API Client (add it, then log in again) or your Workday security groups lack the security domain named in the tool description. |
| Asked to log in again every hour | The API Client was registered without **Non-Expiring Refresh Tokens**. Edit the client, tick it, and log in again. |
| "Session expired and could not be refreshed" | Ask Claude to call `workday_login` again. |
| Answers are truncated | List tools return 25 records by default (max 100). Ask for a narrower search or the next page. |

### Checking what is using port 3000 on Windows

Open PowerShell and run:

```powershell
netstat -ano | findstr :3000
```

If a line shows `LISTENING`, the number in the last column is the process ID (PID). Find the program with:

```powershell
Get-Process -Id <PID>
```

Close that program normally. Only if it is a stray process you recognize, stop it with `Stop-Process -Id <PID>`. If nothing is listed, the port is free. Try signing in again. A sign-in that was left waiting also holds the port for up to 90 seconds, so wait a moment or ask Claude for `workday_login` again.

## 11. Security checklist

- Register your **own** API Client and never share its secret. Never post the client secret or client ID in chat, email, tickets, screenshots or Git, and never share the files in `%USERPROFILE%\.workday-mcp\`. If a secret is ever exposed, regenerate it in Workday.
- Give your API Client the smallest set of scopes that covers the questions you want to ask.
- Keep **Allow changes in Workday** off in the extension form unless you have a reviewed need.
- Prefer a non-production tenant (sandbox / implementation) for first tests.
- Remember that whatever the assistant retrieves is sent to the AI provider as part of the conversation. Check your company's policy on sending HR data to the chosen AI service before you roll it out.
- The extension keeps the client secret in Claude Desktop's secure storage and the login token encrypted in your user profile.
- Audit logs on stderr record tool name, argument names, status and duration, never values.

## 12. Roadmap in brief

Verified workers and organizations tools, friendlier curated tools (current user, find a worker, org chart), safe pagination, per-area switches for sensitive data, keychain token storage, then more Workday APIs, and finally **a remote multi-user deployment (Streamable HTTP, per-user tokens)**.
