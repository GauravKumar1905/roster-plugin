---
description: Connect this Claude to your Roster account and set up your reporting folder
---

Get the user connected, confirm which client they are working on, and leave them with a folder
that remembers it.

**Keep what they read short.** Aim for under a dozen lines across the whole command. Someone
handed three paragraphs skims all of them, and the line that mattered — which client you scoped
to, or that a client has no Google connection — is the one they miss. Say the state, ask
the question, stop.

## 1. Check

Call `check_setup`. One call answers everything below; do not call `list_workspaces`,
`list_tasks` or `get_catalog` here. Anything slower belongs to the moment someone actually asks
for a report.

If it fails with an authorization error, tell them a browser will open to sign in to Roster, then
try once more. If two attempts fail, stop and say what the error was.

## 2. Say where they stand — one or two lines

Branch on `blocker`:

- **`no_workspace`** — no clients yet. Give them https://roster-1035727789436.asia-southeast1.run.app
  to create one, and stop here. A workspace is where a Google Ads connection lives, so nothing
  below can happen yet.
- **`no_connection_or_accounts`** — name the workspace and send them to its Settings. Stop here.
- **`null`** — they are ready. One line: how many clients, plus the queued-report count when
  `totalOpenTasks` is above zero.

## 3. Confirm the active workspace

Only workspaces whose `state` reads `ready` can be worked on.

- **Exactly one ready** — name it and move on. Do not ask a question that has one answer.
- **More than one** — ask which they are working on now. Just the names, no preamble. This is the
  only question this command asks, so let it be the only thing in that message.

Their answer goes into the folder below, and everything afterwards is scoped to it.

## 4. Offer the folder

Skip this entire step if `.roster/version.json` already exists in the working directory — they
have it. Say so in a few words and go to step 6.

Otherwise ask once, in one line: a folder on their Desktop so you already know their setup next
time. If they decline, go to step 6 and do not raise it again.

If they accept, warn them an approval prompt is about to appear for writing to their Desktop. An
unexplained permission dialog reads as something going wrong.

Then build `~/Desktop/Roster`:

```
~/Desktop/Roster/
├── CLAUDE.md
├── .roster/version.json
├── .claude/agents/         copies of report-builder.md, report-editor.md
├── .claude/skills/         copy of google-ads-reports/
└── exports/
```

The agents and skill are copied out of the installed plugin. Find it by reading
`~/.claude/plugins/installed_plugins.json` and taking `installPath` from the `roster@roster`
entry, then copy that directory's `agents/` and `skills/`. Write the entry's `version` and
`gitCommitSha` into `.roster/version.json` with today's date:

```json
{ "pluginVersion": "0.1.0", "gitCommitSha": "...", "syncedAt": "2026-09-13" }
```

That stamp is what makes step 6 possible. Without it the copies rot silently.

Now write `CLAUDE.md` from the template below, filling in the active workspace, and use
`change_directory` to move the session into the folder. If `change_directory` is unavailable — it
is a desktop-app tool and does not exist in the Claude Code CLI — give them the path instead.

### CLAUDE.md template

````markdown
# Roster — Google Ads reporting

Dashboard: https://roster-1035727789436.asia-southeast1.run.app

## Active workspace

**<NAME>** (`<WORKSPACE_ID>`).

This agency has other clients. When a request does not name one, scope it to this workspace — and
say which one you used, in the same breath. "Building this for <NAME>" is enough. If they meant a
different client they will correct you at once; scope it silently and a report can be built
against the wrong account, with nobody finding out until it reaches the client.

To switch, say which client you want, or run `/roster:setup` again.

## Live state is never in this file

Clients, accounts, campaigns and queued reports all change without this file changing. Never
answer from what is written here — call `check_setup` for readiness, `list_workspaces` for
clients, `list_tasks` for the queue, `get_task` for one task's brief.

## How reports get built

- Preview with real figures and get agreement before saving. Never save one they have not seen.
- One report per approval. Do not work through a queue silently.
- Every report starts from a task's brief: `get_task` with the workspace and task ids. Use its
  `ids` for every later call, and design only from its `canReport`.

## How to ask for a report

Queue a task on the client's Reports page in the dashboard — one campaign, and what the report
should show — then press **Copy for Claude** and paste it here.

## Local copies

`.claude/agents/` and `.claude/skills/` hold copies of the Roster plugin's agents and skill,
synced from the version recorded in `.roster/version.json`. They are yours to edit — changes here
apply to this folder only.

The plugin's own `roster:`-prefixed agents take precedence when both are present. Early in a
session, compare that stamp against `~/.claude/plugins/installed_plugins.json`; if the installed
plugin is newer, say so in one line and offer `/roster:setup` to refresh. Stale copies keep fixed
bugs alive.
````

## 5. Orientation — first run only

Only when you have just created the folder. Five lines at most, and nothing beyond these:

- A report starts as a task on the dashboard: choose one campaign, say what you need, then press
  **Copy for Claude** and paste it here.
- Claude asks what report you want and shows you the figures before anything is saved.
- A saved report refreshes itself, and its link is the thing to send a client.

## 6. Close

One line: next time, open this folder and their setup and client are already known.

If they already had the folder and the installed plugin is newer than `.roster/version.json`,
offer to refresh the copies — saying first that any edits they made to the local agents will be
replaced.

## Tone

Report the state, not the mechanics. "You're connected — three clients, working on Northside" is
the right shape. Do not name tools or protocol detail unless something failed and the detail is
what fixes it.
