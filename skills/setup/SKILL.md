---
name: setup
description: Connect this Claude to your Roster account, set up your first client and your reporting folder
---

This is the last step of Roster's onboarding. The user has just come from the Roster dashboard,
which stays locked until this command records that it finished. Get them connected, settle their
default client, give them a folder that remembers it, and record completion.

**Keep what they read short.** Aim for under a dozen lines across the whole command. Someone
handed three paragraphs skims all of them, and the line that mattered — which client is the
default, or that Google Ads still needs connecting — is the one they miss. Say the state, ask
the question, stop.

## 1. Check

Call `check_setup`. One call answers everything below; do not call `list_workspaces`,
`list_tasks` or `get_catalog` here. Anything slower belongs to the moment someone actually asks
for a report.

If it fails with an authorization error, tell them a browser will open to sign in to Roster, then
try once more. If two attempts fail, stop and say what the error was — setup cannot be recorded
without a connection, so the dashboard will stay locked until this works.

## 2. Say where they stand — one line

- **No workspaces** (`workspaceCount` is 0) — say they have no clients yet and offer to create
  the first one: ask what the client is called. If they give a name, call `create_workspace` with
  it and follow the `next` it returns. If they would rather not now, say they can ask for one any
  time ("add a client called …"), and carry on without one.
- **Workspaces exist** — one line: how many clients, how many have Google Ads connected (the
  `ready` flag), plus the queued-report count when `totalOpenTasks` is above zero.

A client without Google Ads is normal at this point — connecting it is the dashboard step that
comes after this command. Mention it; do not stop over it.

## 3. Settle the default workspace

The default is the client a request is scoped to when it does not name one. Any workspace can be
the default, connected or not.

- **None** — skip; there is nothing to choose.
- **Just created in step 2** — `create_workspace` already told you what to ask. Ask it.
- **Exactly one** — name it as the default and move on. Do not ask a question that has one answer.
- **More than one** — ask which should be the default. Just the names, no preamble.

The answer is stored in the folder's `CLAUDE.md` below — nowhere else. If the folder already
exists and the default changed, rewrite the **Default workspace** section of its `CLAUDE.md`.

## 4. Offer the folder

Skip this entire step if `.roster/version.json` already exists in the working directory — they
have it. Say so in a few words and go to step 5.

Otherwise ask once, in one line: a folder on their Desktop so you already know their setup next
time.

If they decline, say in one line that a dedicated folder is recommended to get everything Roster
offers — it is what remembers their default client and carries Roster's skills and review agent
— and that they can run `/roster:setup` again whenever they want it. Then go to step 5 and do
not raise it again.

If they accept, warn them an approval prompt is about to appear for writing to their Desktop. An
unexplained permission dialog reads as something going wrong.

Then build `~/Desktop/Roster`:

```
~/Desktop/Roster/
├── CLAUDE.md
├── .roster/version.json
├── .claude/agents/         copy of report-reviewer.md
├── .claude/skills/         copies of report/, edit-report/, template/, report-design/
└── exports/
```

The agent and skills are copied out of the installed plugin. Find it by reading
`~/.claude/plugins/installed_plugins.json` and taking `installPath` from the `roster@roster`
entry, then copy that directory's `agents/` and every folder in its `skills/` except `setup/` —
setup runs from the plugin, never from a copy. Write the entry's `version` and
`gitCommitSha` into `.roster/version.json` with today's date:

```json
{ "pluginVersion": "0.7.0", "gitCommitSha": "...", "syncedAt": "2026-10-08" }
```

That stamp is what lets a later session notice the copies are out of date. Without it they rot
silently.

Now write `CLAUDE.md` from the template below, filling in the default workspace — or, if there is
none, replacing that section's body with "None yet." — and use `change_directory` to move the
session into the folder. If `change_directory` is unavailable, give them the path instead.

### CLAUDE.md template

````markdown
# Roster — Google Ads reporting

Dashboard: https://roster-1035727789436.asia-southeast1.run.app

## Default workspace

**<NAME>** (`<WORKSPACE_ID>`).

This agency has other clients. When a request does not name one, scope it to this workspace — and
say which one you used, in the same breath. "Building this for <NAME>" is enough. If they meant a
different client they will correct you at once; scope it silently and a report can be built
against the wrong account, with nobody finding out until it reaches the client.

To change the default, say which client you want, or run `/roster:setup` again. Either way,
rewrite this section.

## Adding a client

`create_workspace` with the client's name, when the user asks for one. Then ask whether it becomes
the default or is an additional client, as the tool's response says, and update the section above
if the default changes. Google Ads cannot be connected from Claude — send them to the workspace's
Settings in the dashboard.

## Live state is never in this file

Clients, accounts, campaigns and queued reports all change without this file changing. Never
answer from what is written here — call `check_setup` for readiness, `list_workspaces` for
clients, `list_tasks` with the default workspace above for the queue (no default: ask which
client first), `get_task` with a taskId for one task's brief, `list_reports` and `list_templates`
for a client's reports and templates.

## How reports get built

- Every report starts from a task's brief: `get_task` with the taskId. Use its `ids` for every
  later call, and design only from its `canReport`.
- The `report` skill runs it: options, then `preview_report` with real figures, until the user
  agrees on the structure. Never save one they have not seen.
- Save the agreed structure here with `save_report`. The save checks the real figures and refuses
  a report with a broken or empty widget.
- Then two reviews at once: give the user the link, and run the `report-reviewer` agent in the
  background. Agreed fixes are previewed, then saved with the same reportId.
- `complete_task` only once the user is happy. One report per approval — do not work through a
  queue silently.
- One task, one report. A later change ("add ad groups", "add demographics") — even after
  `complete_task` — updates that report by its reportId. Never save it as a second report.

## How to ask for a report

Queue a task on the client's Reports page in the dashboard — one campaign, and what the report
should show — then press **Copy for Claude** and paste it here.

## Local copies

`.claude/agents/` and `.claude/skills/` hold copies of the Roster plugin's agent and skills,
synced from the version recorded in `.roster/version.json`. They are yours to edit — changes here
apply to this folder only.

The plugin's own `roster:`-prefixed agent and skills take precedence when both are present. Early in a
session, compare that stamp against `~/.claude/plugins/installed_plugins.json`; if the installed
plugin is newer, say so in one line and offer `/roster:setup` to refresh. Stale copies keep fixed
bugs alive.
````

## 5. Record completion

Call `complete_setup`. Always — whether or not a workspace exists, whether or not the folder was
created, and on a re-run too. This is what unlocks the dashboard; skip it and the user is stuck on
the setup screen with no idea why.

If it fails, say so plainly and try once more. Do not tell them setup is finished until it has
succeeded.

## 6. Orientation — first run only

Only when `complete_setup` returned `firstTime: true`. Four lines at most, and nothing beyond
these:

- Back in the dashboard, press **Done** — it opens now.
- Next, connect Google Ads in the client's **Settings** there, and pick its accounts. Claude
  cannot do that part.
- A report starts as a task on the dashboard: choose one campaign, say what you need, then press
  **Copy for Claude** and paste it here.
- Claude shows you the figures before anything is saved, and a saved report refreshes itself.

## 7. Close

One line. If they have the folder: next time, open it and their setup and default client are
already known. If they declined it: they can run `/roster:setup` again any time to create it.

If they already had the folder and the installed plugin is newer than `.roster/version.json`,
offer to refresh the copies — saying first that any edits they made to the local copies will be
replaced. A refresh also deletes anything in `.claude/agents/` or `.claude/skills/` that the
installed plugin no longer ships — for example `report-builder.md` and `google-ads-reports/`, both
retired in 0.7.0, and `report-editor.md`, retired in 0.5.0. A stale copy tells Claude to use
agents and tools that no longer exist.

## Tone

Report the state, not the mechanics. "You're connected — no clients yet. What's the first one
called?" is the right shape. Do not name tools or protocol detail unless something failed and the
detail is what fixes it.
