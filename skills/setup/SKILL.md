---
name: setup
description: Connect this Claude to your Roster account, set up your reporting folder, and update the Roster plugin. Use for "set up Roster", "update Roster" or "is my Roster plugin up to date".
---

Plugin version: 0.25.0

Pass this version as `pluginVersion` to `check_setup`, `list_clients`, `get_task`,
`list_reports`, `get_report` and `list_templates`. If a result carries a note headed
"ROSTER PLUGIN:", do what it says.

This is the last step of Roster's onboarding. The user has just come from Roster's setup page,
usually by pasting its setup message, and the rest of the dashboard stays locked until this command
records that it finished. Get them connected, give them a folder, and record completion. Nothing
else: connecting Google Ads, Meta Ads, Search Console or Google Analytics, adding clients and their reports are the
dashboard's next steps, and every report asked for in the dashboard comes with its own link.

**Keep what they read short.** Aim for under a dozen lines across the whole command. Someone
handed three paragraphs skims all of them, and the line that mattered is the one they miss. Say
what you are doing, do it, stop.

## 1. Connect

Call `check_setup`. It is here to confirm the connection works; do not report what it says about
clients, Google Ads, Meta Ads, Search Console, Google Analytics or reports waiting for Claude, and do not call `list_clients`,
`list_reports` or `get_catalog`. Setup does not look at clients at all.

If it fails with an authorization error, Roster isn't signed in yet. Ask them to type `/mcp`,
choose `roster` and sign in with their Roster login, then wait for them, and try once more. If two
attempts fail, stop and say what the error was — setup cannot be recorded without a connection, so
the dashboard will stay locked until this works.

### Update, if Roster is behind

`check_setup` returns `plugin.latest`. Compare it with the version at the top of this file. When
this one is older:

1. Say it in one line and ask: "Roster has an update (<this> → <latest>). Update it now?" Wait for
   the answer.
2. **Yes, and you can run commands on their computer** (Claude Code): run the two commands in
   `plugin.updateCommands`, in order, one at a time. The second finds nothing until the first has
   run — the plugin's own Update button stays greyed out the same way until the marketplace is
   refreshed. If either fails, say what it printed in one line and give them the steps below.
3. **Yes, but you cannot run commands** (Cowork, claude.ai): tell them to open Settings → Plugins
   in the Claude desktop app, refresh the roster marketplace, then press Update on Roster.
4. **No:** carry on. Do not raise it again in this conversation.

After updating, carry on with setup — step 5 offers to refresh the folder's copies from the new
version. At the close, tell them the update takes effect in a new conversation. The fastest route to
never seeing this again is automatic updates, so mention them once: Settings → Plugins → the roster
marketplace → turn on automatic updates.

If this file is already at `plugin.latest` or newer, or `check_setup` returned no `plugin`, say
nothing about versions.

## 2. Create the folder

Skip this entire step if `.roster/version.json` already exists in the working directory — they
have it. Say so in a few words and go to step 3. If its `pluginVersion` is older than the
installed plugin's, step 5 offers to refresh the copies.

Otherwise do not ask whether they want one. Say in one line what you are doing and why, before the
permission prompt appears — an unexplained permission dialog reads as something going wrong — and,
in the same message, ask the one question setup asks, then wait for the answer:

> Creating a Roster folder on your Desktop so your setup and report tools are ready next time.
> Approve the prompt that comes up.
>
> Roster's read-only steps — reading your reports, campaigns and accounts and previewing report
> pages — can run in this folder without asking each time. Allow that?

Their answer is about the read-only steps only: build the folder either way. A report's first reply
reads the ad account and previews its Overview, and a campaign's reads its brief and looks up
places and interests; without this each of those stops for a permission prompt.

Then build `~/Desktop/Roster`:

```
~/Desktop/Roster/
├── CLAUDE.md
├── .roster/version.json
├── .claude/agents/         copy of report-reviewer.md
├── .claude/skills/         copies of report/, edit-report/, template/, report-design/,
│                           campaign/ and meta-campaign/
├── .claude/settings.json   the read-only steps, only if they allowed them
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

If they decline the prompt, setup still finishes, without the read-only steps, which live in the
folder: say in one line that they can run `/roster:setup` again to add the folder, then go to
step 3 and do not raise it again.

### The read-only steps

**Yes:** write `.claude/settings.json` in the folder with these in `permissions.allow` — or, if the
file is already there, merge them in: add each one that is missing, and keep every entry and
setting it already has. Exactly these, which only read or preview; never a step that saves,
creates or changes anything:

```json
{
  "permissions": {
    "allow": [
      "mcp__plugin_roster_roster__check_setup",
      "mcp__plugin_roster_roster__list_clients",
      "mcp__plugin_roster_roster__list_reports",
      "mcp__plugin_roster_roster__get_report",
      "mcp__plugin_roster_roster__get_task",
      "mcp__plugin_roster_roster__get_catalog",
      "mcp__plugin_roster_roster__preview_metric",
      "mcp__plugin_roster_roster__preview_report_page",
      "mcp__plugin_roster_roster__preview_report",
      "mcp__plugin_roster_roster__list_templates",
      "mcp__plugin_roster_roster__get_template",
      "mcp__plugin_roster_roster__get_campaign",
      "mcp__plugin_roster_roster__list_campaigns",
      "mcp__plugin_roster_roster__find_locations",
      "mcp__plugin_roster_roster__find_meta_places",
      "mcp__plugin_roster_roster__find_meta_interests"
    ]
  }
}
```

The last five are the campaign reads. Previewing a campaign is not among them: it files the draft
on the campaign's page and has Google or Meta check it, so each one asks.

**No:** write nothing, and do not raise it again in this setup. Either way, saving a page, a report
or a template, and checking or creating a campaign, still asks them first.

### CLAUDE.md template

````markdown
# Roster — Google Ads and Meta Ads reporting and campaign setup

Dashboard: https://app.useroster.xyz

## Which client

A report asked for in the dashboard (**Copy for Claude**) carries the report's link, and the report
knows its client, ad account and campaigns: use those. When a request in chat names no client, ask
which one, once, in one line, before calling anything scoped to a client. Never pick one yourself:
a report built against the wrong account is found only when it reaches the client.

A pasted campaign link (…/campaigns/cmp_…) is the `campaign` skill's, and carries its client too.

## Adding a client

`create_client` with the client's name, when the user asks for one, then send them to the
client's page in the dashboard to add its ad accounts. Google Ads and Meta Ads are connected once,
in Settings in the dashboard, for every client — never from Claude.

## Live state is never in this file

Clients, accounts, campaigns and reports all change without this file changing. Never answer from
what is written here — call `check_setup` for readiness, `list_clients` for clients,
`list_reports` for a client's reports and where each stands (none named: ask which first),
`get_task` with a report's link for its brief, `get_report` for a saved report, and
`list_templates` for templates.

## How reports get built

- Every report starts from its link: `get_task` with the link in the pasted message. Use its `ids`
  for every later call — `ids.reportId` is the report to build into — then `get_catalog` with that
  reportId, and design only from what it returns.
- The `report` skill runs it: the plan and the Overview, with real figures, in one message, then
  one page at a time — `preview_report_page`, stop for the user's yes, `save_report_page` with that
  preview's id. A Meta Ads report asks which result counts as a conversion with the plan. Never put
  a whole report in one call, and never save a page in the message that shows its preview.
- Each save checks the real figures and refuses a broken or empty widget. Until every planned page
  is saved, the dashboard shows "Claude is building it" and the report can't be shared.
- When the last page is saved, give the user the link and tell them to press Share with client
  there, and run the `report-reviewer` agent in the background. Agreed fixes go through the same
  loop, page by page, with the same reportId.
- One request, one report. A later change ("add ad groups", "add demographics") updates that
  report by its reportId — "Change this Roster report with me" is the `edit-report` skill. Never
  save it as a second report. One report per approval: do not work through several silently.

## How to ask for a report

In the dashboard, pick **Google Ads report** or **Meta Ads report**, choose the ad account, write a
note for Claude if you like, then press **Copy for Claude** and paste it here.

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

Only when `complete_setup` returned `firstTime: true`. Five lines at most. The first is exactly
this, word for word — it names the button the setup page is waiting on, and what comes after it:

> Setup is recorded. Go back to Roster and press **Done** — it asks what you'd like to do first.

Then these, and nothing beyond them:

- Next, in Roster: pick Google Ads report, Meta Ads report, Search Console report or Google
  Analytics report. It asks for the sign-in and the ad account, site or property, then gives you a
  message to paste here.
- Claude shows you the plan and the figures before anything is saved. You refresh a saved report
  in Roster whenever you want new figures, and each link you share keeps the figures you checked.
- Turn on automatic updates for the Roster marketplace in Claude's Plugins screen, so fixes
  reach you without asking. The dashboard says when yours is out of date.

## 5. Close

One line. If they have the folder: next time, open it and their setup is already known. If they declined it: they can run `/roster:setup` again any time to create it.

If they already had the folder and the installed plugin is newer than `.roster/version.json`,
offer to refresh the copies — saying first that any edits they made to the local copies, and to
the sections of the folder's `CLAUDE.md` named below, will be replaced. If the folder's
`.claude/settings.json` holds none of the read-only steps (step 2), ask the read-only question in
the same message, once, and do what step 2 says with the answer. If it holds the others but none of
the campaign reads, ask this instead, in the same message, once:

> Roster's campaign reads can run without asking too. Allow that?

On a yes, merge the five campaign reads into `permissions.allow` as step 2 does; on a no, write
nothing and do not raise it again. A refresh:

- copies `agents/` and the skills again, as in step 2, and deletes anything in `.claude/agents/`
  or `.claude/skills/` that the installed plugin no longer ships — for example
  `report-builder.md` and `google-ads-reports/`, both retired in 0.7.0, and `report-editor.md`,
  retired in 0.5.0. A stale copy tells Claude to use agents and tools that no longer exist.
- replaces the `## Which client`, `## Adding a client`, `## Live state is never in this file`,
  `## How reports get built` and `## How to ask for a report` sections of the folder's `CLAUDE.md`
  — each from its heading up to the next `## ` heading — with the ones in the template above. Leave
  every other line of the file exactly as it is: the agency may have added its own notes. A section
  the file doesn't have is not added; with none of them, leave the file alone.
- writes the installed plugin's `version` and `gitCommitSha`, with today's date, into
  `.roster/version.json`.

## Tone

Report what happened, not the mechanics. "You're connected, and your Roster folder is on your
Desktop." is the right shape. Do not name tools or protocol detail unless something failed and the
detail is what fixes it.
