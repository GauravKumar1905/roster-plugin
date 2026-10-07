# Roster for Claude

Design a Google Ads client report once, in plain language. Roster refreshes it every month and
gives you a link to send.

This plugin connects Claude to your Roster account. It contains no application code — the tools
run on Roster's servers, and this package is the connection plus the instructions Claude needs
to use it well.

## Start in the dashboard

Sign up at **https://roster-1035727789436.asia-southeast1.run.app/signup**. The dashboard walks
you through the rest in order, and stays on its setup screen until Claude is set up:

1. **Install this plugin** in the Claude desktop app: Settings → Plugins → Add → Add marketplace,
   paste `https://github.com/GauravKumar1905/roster-plugin`, press Sync, then Add
   **Roster — Google Ads reporting**.
2. **Connect it**: Your plugins → Roster → Connectors → roster → Connect, then sign in to Roster
   and approve in the browser tab that opens. Once only.
3. **Run `/roster:setup`** in the Code tab. Claude checks your account, offers to create your
   first client, sets up a `Roster` folder on your Desktop, and tells the dashboard you're done.
4. Back in the dashboard, press **Done**, then connect Google Ads in the client's Settings and
   choose which of its accounts that client advertises under.

Roster only ever reads. It never changes a bid, a budget or a campaign.

Roster is built for the Claude desktop app, where the plugin brings its commands, agents and
skill along. The connector on its own (claude.ai → Settings → Connectors) reaches the same tools
but cannot run `/roster:setup`, so it cannot finish onboarding.

**Turn on auto-update** so new versions reach you without asking, from the marketplace's settings
in the same Plugins screen.

## Commands

| | |
|---|---|
| `/roster:setup` | Connect, create your first client, set up your folder, and finish onboarding |
| `/roster:report` | Start a report — from a task you queued in the dashboard |
| `/roster:edit <report>` | Change a report you already have |
| `/roster:status` | Your clients, their accounts, and existing reports |
| `/roster:refresh <report>` | Re-render a report against today's numbers |
| `/roster:queue` | Work on a queued task, or see what is waiting |
| `/roster:template` | Turn your existing report format into a reusable template |

You don't have to use the commands. Every report starts as a task in the dashboard: on a
client's **Reports** page, choose one campaign, say what you need, press **Copy for Claude**, and
paste it into Claude:

> Work on my Roster report task.
> Workspace: ws_… (Northside Coffee)
> Task: task_… — "Monthly report for the brand campaign"

Claude reads the brief, asks what report you want for that campaign, and shows you the figures
before anything is saved. Once you agree, a builder agent saves it — Roster checks the real
figures and refuses a report with a broken or empty widget — and a reviewer agent looks it over
while you do.

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

- **`skills/google-ads-reports`** — how to design a report that still reads correctly in six
  weeks, rather than one shaped around this month's numbers
- **`agents/report-builder`** — builds and saves a report once you have agreed its structure,
  fixing whatever Roster's checks flag without changing what you agreed
- **`agents/report-reviewer`** — reviews a saved report against what you asked for, while you do
- **`agents/report-editor`** — changes an existing report without quietly rearranging the rest
- **`.mcp.json`** — the connection to Roster

## Two things worth knowing

**Reports are designed once, then they run without Claude.** That's the point: deciding what a
report should contain is worth a model's attention, and fetching the same numbers every month
is not. After you save a design, no tokens are spent keeping it current.

**Ratios are never averaged.** Google reports click-through rate per row, and averaging those
rows gives a number that looks reasonable and is wrong — often by a factor of two. Every rate in
Roster is computed from summed totals instead.

---

Roster Pvt Ltd · [Privacy](https://gauravkumar1905.github.io/roster-site/privacy.html) ·
[Terms](https://gauravkumar1905.github.io/roster-site/terms.html)
