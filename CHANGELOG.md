# Changelog

Each release is tagged `vX.Y.Z`. Claude only offers an update when the version in
`.claude-plugin/plugin.json` changes, so every release bumps it. Releases are made with the Roster
app's `npm run release:plugin -- X.Y.Z`, which sets the version everywhere it is written and refuses
to run without an entry here.

**Server needed** marks a release that only works once the matching Roster server is deployed.
Entries before 0.19.0 were rebuilt from the commit history.

## Unreleased — Google Search Console reports

- **Server needed:** the Roster server with Search Console (`platform/search-console`) has to be
  deployed first; until then a site task never reaches Claude.

- `report`: a Search Console task is about a whole site. Its brief has the site, its last 28 days
  and the last day Google has finished counting; no campaign is passed anywhere; its pages are
  Overview, Queries, Pages, Countries & devices and Search appearance.
- `report-design`: new `search-console.md` — organic clicks, position where lower is better and
  never a sort, queries that leave out private ones, pages that overlap, search types, Pacific Time.
- `edit-report`, `template` and the `report-reviewer` agent know a site report; `setup` names
  Search Console beside Google Ads and Meta Ads.

## Unreleased — Codex and Antigravity

- **Server needed** for other assistants to finish setup and to stop being told to install the
  Claude plugin. Nothing changes for Claude.

- The same skills, packaged for OpenAI's Codex (`codex/`, with `.agents/plugins/marketplace.json`
  so `codex plugin marketplace add GauravKumar1905/roster-plugin` finds it) and Google's
  Antigravity (`antigravity/`, installed with `agy plugin install …/roster-plugin/antigravity`).
- Both are generated from the Claude skills by `scripts/build-packages.mjs` and rebuilt by every
  release. The reviewer agent becomes a `review-report` skill there, since neither loads a
  plugin's agents, and setup is a short connect-and-record skill with no local folder.

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
