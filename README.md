# Roster for Claude

Google Ads and Meta Ads reporting and campaign setup, for freelancers and small agencies:

- **Google Ads reporting** and **Meta Ads reporting**: design a client report once, in plain
  language. Refresh it from live data whenever you're ready, and send your client a link to the
  figures you've checked.
- **Google Ads campaign creation** and **Meta Ads campaign creation**: describe the campaign a
  client needs. Claude drafts it with you and shows you every ad, and Roster creates it paused,
  only after your yes.

Meta Ads campaign creation is open now. Google Ads campaign creation opens soon.

This plugin connects Claude to your Roster account. It contains no application code — the tools
run on Roster's servers, and this package is the connection plus the instructions Claude needs
to use it well.

## Start in the dashboard

Sign up at **https://app.useroster.xyz/signup**. Setting up Roster in Claude comes first, and the
rest of the dashboard opens once Claude has finished:

1. **Copy the setup message** on Roster's setup page.
2. **Paste it into Claude and send**: in the Claude desktop app, open the Code tab, start a new
   session, paste the message and send. Claude installs this plugin and runs `/roster:setup`,
   which checks your account and sets up a `Roster` folder on your Desktop. It stops for you to:
   - approve its install commands and the Roster steps it asks about
   - type `/reload-plugins`
   - type `/mcp`, choose `roster` and sign in with the same login
   - allow a Roster folder on your Desktop
   - say whether Roster's read-only steps can run without asking each time
3. **Come back and press Done** when Claude says "Setup is recorded. Go back to Roster and press
   Done — it asks what you'd like to do first." Pick Google Ads report or Meta Ads report there:
   Roster asks for the sign-in and the ad account — Google Ads and Meta Ads are connected once, for
   every client — then copies a message for Claude.

If Claude can't run commands in the Code tab, install from Claude's menus instead: Settings →
Plugins → Add → Add marketplace, paste `https://github.com/GauravKumar1905/roster-plugin`, press
Sync, then Add **Roster — Google Ads and Meta Ads reporting and campaign setup**. In Your plugins,
open Roster → Connectors → roster, press Connect and sign in with your Roster login. Then run
`/roster:setup` in the Code tab.

Until Google Ads campaign creation opens, Roster only reads your Google Ads accounts. In a Meta ad
account — and in Google Ads once it opens — it changes an account only when you ask it to set up a
campaign. It shows you the campaign and every ad first, creates it only after your yes, and creates
it paused, so nothing runs or spends until you switch it on. It never edits, pauses or removes
anything already there. A connection to Roster approved before campaign setup opened only reads: to
set up campaigns, sign in to Roster again — in Claude Code, type `/mcp`, choose `roster`, Clear
authentication, then Authenticate. Reports keep working meanwhile.

Roster is built for the Claude desktop app, where the plugin brings its commands, agents and
skills along. The connector on its own (claude.ai → Settings → Connectors) reaches the same tools
but cannot run `/roster:setup`, so it cannot finish onboarding.

**Turn on auto-update** so new versions reach you without asking, from the marketplace's settings
in the same Plugins screen. It is off by default for marketplaces added from GitHub. The plugin
tells Roster which version it is, so if yours falls behind, the dashboard and Claude both say so.
What changed in each version is in [CHANGELOG.md](CHANGELOG.md).

## Codex and Antigravity

The same plugin, packaged for OpenAI's Codex and Google's Antigravity. Sign up in the dashboard
first, as above; then, instead of the Claude steps:

**Codex** (CLI or the ChatGPT desktop app):

```
codex plugin marketplace add GauravKumar1905/roster-plugin
codex plugin add roster@roster
```

Sign in with your Roster login when the browser opens, then say "set up Roster".

**Antigravity** (CLI, desktop app or IDE):

```
agy plugin install https://github.com/GauravKumar1905/roster-plugin/antigravity
```

Sign in with your Roster login the first time a Roster tool asks, then say "set up Roster" — or
run `/roster-setup`.

Either way, setup connects, tells the dashboard you're done, and you press **Done** there. There is
no local folder: that is a Claude Code convenience. Reports and templates work the same: each starts from the message Roster copies.

## Skills

| | |
|---|---|
| `/roster:setup` | Connect, set up your folder, and finish onboarding |
| `/roster:report` | Build a report asked for in Roster, or see what is waiting for a client |
| `/roster:edit-report` | Change a report you already have, keeping its link |
| `/roster:template` | Turn your agency's own report format into a reusable template |
| `/roster:campaign` | Draft and create a Google Ads campaign asked for in Roster, once Google Ads campaign creation opens |
| `/roster:meta-campaign` | Draft and create a Meta Ads campaign asked for in Roster |

You rarely need to type these. Plain language finds the right one: "change this report to add ad
groups", "build a template from our monthly PDF", "what reports does Otago have?".

You don't need a command to start a report either. Every report starts in the dashboard: pick
**Google Ads report** or **Meta Ads report**, choose the ad account — the report covers all its
campaigns unless you pick some under **Change** — write a note for Claude if you like, press
**Copy for Claude**, and paste it into Claude:

> Build this Roster report with me.
> Report: https://app.useroster.xyz/r/rep_…
> Google Ads account: Northside Coffee (384-221-9057), all campaigns
> Note: Monthly report for the owner; store visits matter most.

Claude's first reply is the report it proposes — Roster's standard monthly report for last month,
unless your note asks for something else — and its Overview, with real figures; a Meta Ads report
asks first which result counts as a conversion. Then the other pages, one at a time: nothing
is saved until you say yes, and Roster checks the real figures and refuses a report with a broken
or empty widget. When the last page is saved, the report's page in Roster says **Ready to share**;
press **Share with client** there for the link your client sees. A reviewer agent looks it over
while you do.

To change a report later, press **Change with Claude** on its page in Roster and paste what it
copies — "Change this Roster report with me", with the report's link. It stays the same report, at
the same link.

A Meta Ads campaign starts the same way — and a Google Ads one, once those open: **New campaign**
in the dashboard, pick the ad account, write a note for Claude if you like, press **Copy for
Claude** and paste it into Claude. Claude drafts it with you, on the campaign's own page in
Roster, shows you every ad, and creates it paused only after your yes.

## Templates

Agencies have a house report format. Share the file you use today — a spreadsheet, a slide, last
month's PDF — and ask Claude to build a matching template:

> Here's our standard monthly report. Build a Roster template that matches it.

After that, every new client is one call: Claude offers the saved format by name and applies it.
Widgets a client's account can't support are skipped rather than shown empty, so the same
template survives a client with no conversion tracking. Roster's standard monthly report is listed
first, for every client; it can't be changed, but Claude can start your own format from it.

A report is not a template until you make it one. A template is either for one client or for
every client, and each report made from it gets its own copy — improving a template later changes
new reports, never ones you have already shared. On a client's **Templates** page you can turn one of
their reports into a template, or copy an instruction that has Claude design a new one.

## Roster and Claude, side by side

You can't start Claude from the Roster dashboard, and Claude can't see the dashboard. So each
report is handed over as a message with its link: **Copy for Claude** to start one, **Continue in
Claude** to pick up one left half-built, **Change with Claude** to change one. The report's page
follows along — Waiting for Claude, Claude is building it, Ready to share — and Home lists what
needs you. Ask Claude *what reports are waiting for Otago?* to see them from Claude's side.

## What's in here

- **`skills/report`, `skills/edit-report`, `skills/template`, `skills/setup`** — one skill per
  thing you do. They run in your conversation, so Claude can ask you what you want at each step
- **`skills/report-design`** — how to design a report that still reads correctly in six weeks,
  rather than one shaped around this month's numbers. The other skills load it when designing
- **`skills/campaign`, `skills/meta-campaign`** — Google Ads and Meta Ads campaigns, each started
  from its page in Roster; Google Ads ones once their campaign creation opens. Claude only: the
  Codex and Antigravity packages below don't carry them
- **`agents/report-reviewer`** — reviews a saved report against what you asked for, while you do
- **`.mcp.json`** — the connection to Roster
- **`codex/`, `antigravity/`, `.agents/plugins/marketplace.json`** — the Codex and Antigravity
  packages, **generated** from the skills above by `node scripts/build-packages.mjs`. Edit the
  skills at the root, then run it; `--check` fails when the packages are out of date. The release
  script runs it for you. In those packages the reviewer is a skill (`review-report`), setup has no
  folder, and the plugin-version lines are gone — only Claude's requests carry a version.

## Two things worth knowing

**Reports are designed once, then they run without Claude.** That's the point: deciding what a
report should contain is worth a model's attention, and fetching the same numbers every month
is not. After you save a design, no tokens are spent keeping it current.

**Ratios are never averaged.** Google reports click-through rate per row, and averaging those
rows gives a number that looks reasonable and is wrong — often by a factor of two. Every rate in
Roster is computed from summed totals instead.

---

Roster · [Privacy](https://useroster.xyz/privacy.html) ·
[Terms](https://useroster.xyz/terms.html)
