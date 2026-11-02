# Roster for Claude

Google Ads and Meta Ads reporting and campaign setup, for freelancers and small agencies:

- **Google Ads reporting** and **Meta Ads reporting**: design a client report once, in plain
  language. Refresh it from live data whenever you're ready, and send your client a link to the
  figures you've checked.
- **Google Ads campaign creation** and **Meta Ads campaign creation**: describe the campaign a
  client needs. Claude drafts it with you and shows you every ad, and Roster creates it paused,
  only after your yes.

Campaign creation opens soon. Reports work today.

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
3. **Come back and press Done** when Claude says "Setup is recorded. Go back to Roster and press
   Done." The dashboard then walks you through adding a client, connecting its Google Ads or Meta
   Ads, and choosing its ad accounts.

If Claude can't run commands in the Code tab, install from Claude's menus instead: Settings →
Plugins → Add → Add marketplace, paste `https://github.com/GauravKumar1905/roster-plugin`, press
Sync, then Add **Roster — Google Ads and Meta Ads reporting and campaign setup**. In Your plugins,
open Roster → Connectors → roster, press Connect and sign in with your Roster login. Then run
`/roster:setup` in the Code tab.

Until campaign creation opens, Roster only reads your ad accounts. After that, it changes an
account only when you ask it to set up a campaign. It shows you the campaign and every ad first,
creates it only after your yes, and creates it paused, so nothing runs or spends until you switch
it on. It never edits, pauses or removes anything already there.

Roster is built for the Claude desktop app, where the plugin brings its commands, agents and
skills along. The connector on its own (claude.ai → Settings → Connectors) reaches the same tools
but cannot run `/roster:setup`, so it cannot finish onboarding.

**Turn on auto-update** so new versions reach you without asking, from the marketplace's settings
in the same Plugins screen. It is off by default for marketplaces added from GitHub. The plugin
tells Roster which version it is, so if yours falls behind, the dashboard and Claude both say so.
What changed in each version is in [CHANGELOG.md](CHANGELOG.md).

## Skills

| | |
|---|---|
| `/roster:setup` | Connect, set up your folder, and finish onboarding |
| `/roster:report` | Work on a queued task, or see what is waiting for a client |
| `/roster:edit-report` | Change a report you already have, as the same report |
| `/roster:template` | Turn your agency's own report format into a reusable template |

You rarely need to type these. Plain language finds the right one: "change this report to add ad
groups", "build a template from our monthly PDF", "what reports does Otago have?".

You don't need a command to start a report either. Every report starts as a task in the
dashboard: on a client's **Reports** page, choose one campaign, say what you need, press **Copy
for Claude**, and paste it into Claude:

> Work on my Roster report task.
> Client: Northside Coffee (ws_…)
> Task: task_… — "Monthly report for the brand campaign"
> Campaign: Northside Brand (Search)
> Start with get_task, ask me what report I want for this campaign, and show me a preview before saving.

Claude reads the brief, asks what report you want for that campaign, and shows you the figures
before anything is saved. Once you agree, Claude saves it — Roster checks the real figures and
refuses a report with a broken or empty widget — and a reviewer agent looks it over while you do.

## Templates

Agencies have a house report format. Share the file you use today — a spreadsheet, a slide, last
month's PDF — and ask Claude to build a matching template:

> Here's our standard monthly report. Build a Roster template that matches it.

After that, every new client is one call: Claude offers the saved format by name and applies it.
Widgets a client's account can't support are skipped rather than shown empty, so the same
template survives a client with no conversion tracking.

A report is not a template until you make it one. A template is either for one client or for
every client, and each report made from it gets its own copy — improving a template later changes
new reports, never ones you have already sent. On a client's **Templates** page you can turn one of
their reports into a template, or copy an instruction that has Claude design a new one.

## The report queue

You can't start Claude from the Roster dashboard, and Claude can't see the dashboard. So the
dashboard has a **report queue**: note down each report you want while you're looking at your
clients — one campaign each — and copy each task into Claude when you're ready. Ask Claude *what's
in my queue* to see what is waiting for a client. Each report is shown to you before it's saved, and its task
is ticked off once it's done.

## What's in here

- **`skills/report`, `skills/edit-report`, `skills/template`, `skills/setup`** — one skill per
  thing you do. They run in your conversation, so Claude can ask you what you want at each step
- **`skills/report-design`** — how to design a report that still reads correctly in six weeks,
  rather than one shaped around this month's numbers. The other skills load it when designing
- **`agents/report-reviewer`** — reviews a saved report against what you asked for, while you do
- **`.mcp.json`** — the connection to Roster

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
