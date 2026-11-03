# Changelog

Each release is tagged `vX.Y.Z`. Claude only offers an update when the version in
`.claude-plugin/plugin.json` changes, so every release bumps it. Releases are made with the Roster
app's `npm run release:plugin -- X.Y.Z`, which sets the version everywhere it is written and refuses
to run without an entry here.

**Server needed** marks a release that only works once the matching Roster server is deployed.
Entries before 0.19.0 were rebuilt from the commit history.

## 0.22.0 — Whole-account reports and Roster's standard monthly report

- **Server needed:** app 0.19.6, which lets `get_catalog` take a report's `reportId` and return
  its `standardReport`, briefs a whole account or several campaigns, and makes this release the
  oldest Roster accepts. Older plugins are never refused: they are warned, and told to update on
  their first call.

- A report covers every campaign in the ad account unless you pick some under **Change**, so the
  message **Copy for Claude** copies ends ", all campaigns" — or names the campaigns you picked.
  Campaigns added to the account later are in a whole-account report from its next refresh.
- Claude's first reply opens with two lines on the last 30 days — "Acme Dental on Google Ads, last
  30 days: $5,300 spent, 212 conversions at $25.00 each, across 5 campaigns (6 in all)" — and
  proposes Roster's standard monthly report for last month: on Google Ads, Overview, Ad groups and
  Geo & device (no Ad groups page for Performance Max alone); on Meta Ads, Overview, Creative and
  Demographics. Its Overview comes with real figures, as before, and a report of more than one
  campaign splits it by campaign in a table. A Meta Ads report still asks which result counts as a
  conversion with the plan, and the standard names that result in its titles.
- Claude designs from `get_catalog` with the report's `reportId`, which knows whether the report
  covers one campaign, several or the whole account, and holds every page to exactly that — the
  same check preview and save make. Changing a report and the reviewer read it the same way.
- A breakdown only some of the campaigns report says which in its title — "Ad groups (Search and
  Display campaigns only)" — or says "partial", and shows no total.
- The pages' questions read right for one campaign or a whole account: Overview is "How is the
  advertising doing overall?", Demographics "Who do the ads reach?", and Geo & device "Where were
  the ads seen, and on what devices?".
- Roster's standard monthly report (`tpl_roster_standard`) is listed first among the templates, for
  every client, and can't be changed. Claude can start an agency's own template from it, saved as
  theirs.
- Roster folders set up before this keep "`get_catalog` with the campaignId" in their `CLAUDE.md`
  until `/roster:setup` refreshes them (Claude offers it when the folder is behind the plugin);
  until then the brief's own steps already say the `reportId`.

## Unreleased — Codex and Antigravity

- **Server needed** for other assistants to finish setup and to stop being told to install the
  Claude plugin. Nothing changes for Claude.

- The same skills, packaged for OpenAI's Codex (`codex/`, with `.agents/plugins/marketplace.json`
  so `codex plugin marketplace add GauravKumar1905/roster-plugin` finds it) and Google's
  Antigravity (`antigravity/`, installed with `agy plugin install …/roster-plugin/antigravity`).
- Both are generated from the Claude skills by `scripts/build-packages.mjs` and rebuilt by every
  release. The reviewer agent becomes a `review-report` skill there, since neither loads a
  plugin's agents, and setup is a short connect-and-record skill with no local folder.

## 0.21.0 — Reports start from their link in Roster

- **Server needed:** app 0.19.5, which gives `get_task` the report's link (`report`) and the steps
  below, and makes this release the oldest Roster accepts. Older plugins keep working, and are told
  to update on their first call.

- **Copy for Claude** pastes the report's link: "Build this Roster report with me.", the link, the
  ad account and its campaign, and your note. Claude builds into that report — the row and its link
  exist in Roster from the moment you ask — so its page follows along: Waiting for Claude, Claude is
  building it, Ready to share.
- Claude's first reply is the report it proposes and its Overview, with real figures, in one
  message, ending "Save Overview and go on to Ad groups?". Your yes approves both. A Meta Ads report
  asks which result counts as a conversion with the plan, and shows the Overview next.
- When the last page is saved, Claude gives you the link and says to press **Share with client**
  there. A change to a report already shared says that your client's link still shows the version
  it was made from, until you share again.
- "Carry on building this Roster report with me" (Continue in Claude) picks up a report left
  half-built, and "Change this Roster report with me" (Change with Claude, with an optional
  `Change:` line) is the `edit-report` skill's start.
- No queue: `list_tasks` and `complete_task` are gone, and so is ticking a task off. Claude uses
  the dashboard's words — Waiting for Claude, Claude is building it, Ready to share, Share with
  client, Refresh figures — and never says task, queue or sent.
- A template message's `Client:` line is the client's name alone; Claude finds the client by name.
  The reviewer reads the note you wrote for the report.
- Setup asks once whether Roster's read-only steps — reading reports and accounts, previewing
  pages — may run in your Roster folder without asking each time. Yes writes them into the folder's
  `.claude/settings.json`; nothing that saves is ever in it. Setup's last line is now "Setup is
  recorded. Go back to Roster and press Done — it asks what you'd like to do first."
- Roster folders set up before this keep their old `CLAUDE.md` lines (the queue, `list_tasks`)
  until `/roster:setup` refreshes them. A refresh (Claude offers it when the folder is behind the
  plugin) now rewrites "Which client", "Live state", "How reports get built" and "How to ask for a
  report" as well as "Adding a client", and asks the read-only question when the folder's settings
  allow none of those steps yet.

## 0.20.2 — Google Ads and Meta Ads are connected in Settings

- Works with any server; the words match app 0.19.4. The minimum isn't raised: Roster still
  accepts 0.20.0 and 0.20.1 and warns nobody.

- Google Ads and Meta Ads are connected once, for your agency, in Settings in the dashboard, and
  a client's ad accounts are added on its page. Setup's first-time orientation and the README now
  say so: connect in Settings first, then add a client and choose its ad accounts.
- Adding a client from Claude sends you to the client's page to add its ad accounts, rather than
  to the client's Settings to connect.
- Roster folders set up before this keep the old "Adding a client" lines in their `CLAUDE.md`
  until `/roster:setup` runs again. A refresh (Claude offers it when the folder is behind the
  plugin) rewrites that section, so it updates them. Until then, Roster's own instructions to
  Claude already say Settings.
- Setting up another computer with the message from Settings, or running `/roster:setup` again,
  ends with "Setup is recorded. Roster is ready in this Claude." instead of sending you to a Done
  button that isn't there. Roster (app 0.19.4) says it, so every plugin version gets it.
- Only words change: tools, parameters and results are as they were.

## 0.20.1 — Clients, not workspaces

- Works with any server, the one before this change included. The minimum isn't raised: Roster
  still accepts 0.20.0 and warns nobody.

- Claude says **client**, as the dashboard does, and **Meta Ads** for the ad platform. Tool names,
  parameters and results still say workspace (`list_workspaces`, `workspaceId`), so nothing else
  changes.
- A task copied with **Copy for Claude** names its client as `Client: Northside Coffee (ws_…)`.
  Claude takes the client's id from that line, as it did from the old `Workspace:` line (still
  read), so a mixed-up paste is still caught. The template instruction's `Client:` line works the
  same way.
- When a request names no client, Claude asks which one. It no longer looks for a default client in
  your Roster folder, which hasn't had one since 0.10.0.
- Setup: if Roster isn't signed in, Claude asks you to type `/mcp`, choose roster and sign in. The
  first time, it ends with "Setup is recorded. Go back to Roster and press **Done**." and then says
  what comes next: add a client, connect its Google Ads or Meta Ads, choose its ad accounts, then
  **Copy for Claude** on its Reports page.
- A report still being built is "Claude is building it", as the dashboard says.
- Changing a report no longer claims the link your client already has shows the change. A shared
  link keeps the figures it was made with; a new link from the report page shows the change.
- Refreshing your Roster folder (Claude offers it when the folder is behind the plugin) now also
  rewrites the "Adding a client" section of its `CLAUDE.md`, which still said workspace. The rest of
  that file is left as you have it.
- The README and the plugin's description still name all four: Google Ads and Meta Ads reporting,
  and Google Ads and Meta Ads campaign creation. They now say campaign creation opens soon, and that
  reports work today. The README starts setup from the setup message the dashboard gives you, and
  its privacy and terms links point at useroster.xyz.
- The plugin's author, the marketplace owner and the README footer say Roster, as the site does.

## 0.20.0 — Meta Ads reports

- **Server needed:** the Meta steps use tools and fields the matching server adds
  (`set_report_conversion_action`, `conversionAction`, a Meta `accountId` in `get_catalog`).
  Google Ads reports work as before either way.

- Claude builds Meta reports from Meta tasks the way it builds Google Ads ones: page by page, each
  previewed with real figures and saved on your yes.
- A Meta report counts one action as its conversion — purchases, leads, a custom conversion — and
  Claude asks you which, from what the account actually records, before designing anything with
  conversions in it. You can change it later; the report is redrawn.
- Meta reports speak Meta: ad sets instead of ad groups ("Ad sets" page), link clicks and link CTR,
  3-second plays and ThruPlays, placements, and age × gender together — which Google can't do.
- The report reviewer checks a Meta report against Meta's rules, not Google's.
- Roster moved to **app.useroster.xyz**: the connector, the setup notes and the sign-up link point
  there. The old `run.app` address is switched off, so earlier versions stop connecting.
- The plugin is now **Roster — Google Ads and Meta Ads reporting and campaign setup**, and its
  description, README and setup notes say what Roster does: Google Ads and Meta Ads reporting, and
  Google Ads and Meta Ads campaign creation. It no longer says Roster only reads, or that reports
  refresh themselves.

## 0.19.0 — Roster keeps itself up to date, and talks about outcomes

- Works with the server as it is; the update notes and the setup update step need the matching
  server deploy, and skip themselves until it is live.

- Every request names the plugin's version: the `X-Roster-Plugin-Version` header in `.mcp.json`,
  and a `pluginVersion` that each skill passes when a conversation starts. Roster uses it to tell
  you, in Claude and on the dashboard, when your plugin is out of date.
- `/roster:setup` updates Roster when it is behind: it asks, then refreshes the marketplace and
  updates the plugin for you (Claude Code), or tells you where to do it (Cowork). "Update Roster"
  runs it too. It also asks you to turn on automatic updates.
- Claude talks about outcomes, not mechanics: no tool names or "page by page"; a problem comes with
  one recommendation, not a menu; an answer that does not match the options gets a question, not a
  guess.
- A save refused after you approved the design keeps your approval: Claude rebuilds it as pages and
  saves it without asking again. It never saves a template to get round a refusal.

## 0.18.1 — 2026-10-10

- Setup notes: reports are refreshed by hand; a link keeps the figures you checked.

## 0.18.0 — 2026-10-10 — build reports one page at a time

- Server needed. A new report is agreed page by page, Overview first, and each page is previewed and
  approved before it is saved. The server refuses a new report written as one spec.

## 0.17.0 — 2026-10-10 — modelled age × gender

## 0.16.0 — 2026-10-10 — expandable tables

## 0.15.0 — 2026-10-10 — hour of day and ad format

## 0.14.0 — 2026-10-10 — ad group breakdown picker

## 0.13.0 — 2026-10-10 — report segments

## 0.12.0 — 2026-10-10 — locations show what Google could not place

## 0.11.0 — 2026-10-09 — grouped bars

## 0.10.0 — 2026-10-09 — setup goes straight to the folder

## 0.9.0 — 2026-10-09 — keywords, search terms, ads, locations, comparing tables, targets

## 0.8.1 — 2026-10-09 — edit-report keeps the user's arrangement and notes

## 0.8.0 — 2026-10-08 — what a campaign can report comes from get_catalog

## 0.7.0 — 2026-10-08 — task-specific skills

- The conversation saves; `report-reviewer` reviews. `report-builder` and `google-ads-reports` retired.

## 0.6.0 — 2026-10-07 — keep /roster:setup and /roster:queue; retire the other commands

## 0.5.0 — 2026-10-07 — save_report and save_template

- `report-editor` retired.

## 0.4.0 — 2026-10-07 — report-builder builds, report-reviewer reviews

- Reports and templates are separate. One task, one report: follow-up changes update the same report.

## 0.3.0 — 2026-10-07 — /roster:setup finishes onboarding and can create the first client

## 0.2.0 — 2026-10-03 — task-first reports, readiness check, working agents
