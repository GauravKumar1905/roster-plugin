# Changelog

Each release is tagged `vX.Y.Z`. Claude only offers an update when the version in
`.claude-plugin/plugin.json` changes, so every release bumps it. Releases are made with the Roster
app's `npm run release:plugin -- X.Y.Z`, which sets the version everywhere it is written and refuses
to run without an entry here.

**Server needed** marks a release that only works once the matching Roster server is deployed.
Entries before 0.19.0 were rebuilt from the commit history.

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
