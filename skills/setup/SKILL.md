---
name: setup
description: Connect this Claude to your Roster account and set up your reporting folder
---

This is the last step of Roster's onboarding. The user has just come from the Roster dashboard,
which stays locked until this command records that it finished. Get them connected, give them a
folder, and record completion. Nothing else: clients, their Google Ads and their reports are the
dashboard's next steps, and every report request from the dashboard names its client and campaign.

**Keep what they read short.** Aim for under a dozen lines across the whole command. Someone
handed three paragraphs skims all of them, and the line that mattered is the one they miss. Say
what you are doing, do it, stop.

## 1. Connect

Call `check_setup`. It is here to confirm the connection works; do not report what it says about
clients, Google Ads or queued reports, and do not call `list_workspaces`, `list_tasks` or
`get_catalog`. Setup does not look at clients at all.

If it fails with an authorization error, tell them a browser will open to sign in to Roster, then
try once more. If two attempts fail, stop and say what the error was — setup cannot be recorded
without a connection, so the dashboard will stay locked until this works.

## 2. Create the folder

Skip this entire step if `.roster/version.json` already exists in the working directory — they
have it. Say so in a few words and go to step 3.

Otherwise do not ask whether they want one. Say in one line what you are doing and why, before the
permission prompt appears — an unexplained permission dialog reads as something going wrong:

> Creating a Roster folder on your Desktop so your setup and report tools are ready next time.
> Approve the prompt that comes up.

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
{ "pluginVersion": "0.8.0", "gitCommitSha": "...", "syncedAt": "2026-10-08" }
```

That stamp is what lets a later session notice the copies are out of date. Without it they rot
silently.

Now write `CLAUDE.md` from the template below and use `change_directory` to move the session into
the folder. If `change_directory` is unavailable, give them the path instead.

If they decline the prompt, setup still finishes: say in one line that they can run
`/roster:setup` again to add the folder, then go to step 3 and do not raise it again.

### CLAUDE.md template

````markdown
# Roster — Google Ads reporting

Dashboard: https://roster-1035727789436.asia-southeast1.run.app

## Which client

A request pasted from the dashboard (**Copy for Claude**) names its client and campaign: use those.
When a request in chat names no client, ask which one, once, in one line, before calling anything
scoped to a client. Never pick one yourself: a report built against the wrong account is found
only when it reaches the client.

## Adding a client

`create_workspace` with the client's name, when the user asks for one. Google Ads cannot be
connected from Claude — send them to the workspace's Settings in the dashboard.

## Live state is never in this file

Clients, accounts, campaigns and queued reports all change without this file changing. Never
answer from what is written here — call `check_setup` for readiness, `list_workspaces` for
clients, `list_tasks` for the queue of the client the request names (none named: ask which
first), `get_task` with a taskId for one task's brief, `list_reports` and `list_templates`
for a client's reports and templates.

## How reports get built

- Every report starts from a task's brief: `get_task` with the taskId. Use its `ids` for every
  later call, then `get_catalog` with the campaignId, and design only from what it returns.
- The `report` skill runs it: options, then the pages the report will have, then one page at a
  time — Overview first — `preview_report_page` with real figures, stop for the user's yes, and
  `save_report_page` with that preview's id. Never put a whole report in one call, and never save a
  page in the message that shows its preview.
- Each save checks the real figures and refuses a broken or empty widget. Until every planned page
  is saved, the report is "being built" and cannot be shared.
- Then two reviews at once: give the user the link, and run the `report-reviewer` agent in the
  background. Agreed fixes go through the same loop, page by page, with the same reportId.
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

## 3. Record completion

Call `complete_setup`. Always — whether or not the folder was created, and on a re-run too. This is what unlocks the dashboard; skip it and the user is stuck on
the setup screen with no idea why.

If it fails, say so plainly and try once more. Do not tell them setup is finished until it has
succeeded.

## 4. Orientation — first run only

Only when `complete_setup` returned `firstTime: true`. Four lines at most, and nothing beyond
these:

- Back in the dashboard, press **Done** — it opens now.
- Next, the dashboard walks you through adding a client, connecting its Google Ads and picking
  its accounts. Claude cannot do that part.
- A report starts as a task on the dashboard: choose one campaign, say what you need, then press
  **Copy for Claude** and paste it here.
- Claude shows you the figures before anything is saved. You refresh a saved report from the
  dashboard whenever you want new figures, and each link you send keeps the figures you checked.

## 5. Close

One line. If they have the folder: next time, open it and their setup is already known. If they declined it: they can run `/roster:setup` again any time to create it.

If they already had the folder and the installed plugin is newer than `.roster/version.json`,
offer to refresh the copies — saying first that any edits they made to the local copies will be
replaced. A refresh also deletes anything in `.claude/agents/` or `.claude/skills/` that the
installed plugin no longer ships — for example `report-builder.md` and `google-ads-reports/`, both
retired in 0.7.0, and `report-editor.md`, retired in 0.5.0. A stale copy tells Claude to use
agents and tools that no longer exist.

## Tone

Report what happened, not the mechanics. "You're connected, and your Roster folder is on your
Desktop." is the right shape. Do not name tools or protocol detail unless something failed and the
detail is what fixes it.
