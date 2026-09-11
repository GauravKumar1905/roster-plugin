# Roster for Claude

Design a Google Ads client report once, in plain language. Roster refreshes it every month and
gives you a link to send.

This plugin connects Claude to your Roster account. It contains no application code — the tools
run on Roster's servers, and this package is the connection plus the instructions Claude needs
to use it well.

## Which one do you need?

**Most people want the connector, not this plugin.** In Claude Desktop or on claude.ai, go to
Settings → Connectors → Add custom connector and paste:

```
https://roster-1035727789436.asia-southeast1.run.app/api/mcp
```

That is the whole setup, and it gives you every Roster tool.

This plugin adds commands and report-building agents on top, and it works **only in the Claude
Code terminal** — `/plugin` does not exist in Claude Desktop or on the web.

## Install (Claude Code only)

In the Claude Code terminal, **one at a time** — the first opens a prompt asking for the
source, and it wants only `GauravKumar1905/roster-plugin`, not the whole block:

```
/plugin marketplace add GauravKumar1905/roster-plugin
```

```
/plugin install roster@roster
```

```
/roster:setup
```

The first time Claude uses a Roster tool it opens a browser so you can sign in and approve the
connection. That happens once.

## You need a Roster account first

Sign up at **https://roster-1035727789436.asia-southeast1.run.app/signup**, then in the
dashboard:

1. Create a workspace for a client
2. Connect the Google account that can reach that client's Google Ads
3. Choose which of its accounts that client advertises under

Roster only ever reads. It never changes a bid, a budget or a campaign.

## Commands

| | |
|---|---|
| `/roster:setup` | Connect, and check you're ready to build reports |
| `/roster:report <client>` | Design a report for a client |
| `/roster:edit <report>` | Change a report you already have |
| `/roster:status` | Your clients, their accounts, and existing reports |
| `/roster:refresh <report>` | Re-render a report against today's numbers |
| `/roster:queue` | Work through reports queued in the dashboard |
| `/roster:template` | Turn your existing report format into a reusable template |

You don't have to use the commands. Once connected, asking in plain language works:

> Build a monthly performance report for Northside Coffee.

## Templates

Agencies have a house report format. Share the file you use today — a spreadsheet, a slide, last
month's PDF — and ask Claude to build a matching template:

> Here's our standard monthly report. Build a Roster template that matches it.

After that, every new client is one call: Claude offers the saved format by name and applies it.
Widgets a client's account can't support are skipped rather than shown empty, so the same
template survives a client with no conversion tracking.

Your templates are listed in the dashboard under **Templates**, with the clients using each one.

## The report queue

You can't start Claude from the Roster dashboard, and Claude can't see the dashboard. So the
dashboard has a **report queue**: note down what you want while you're looking at your clients,
then later tell Claude to *work my report queue*. It picks them up one at a time, shows you each
report before saving it, and ticks the task off once it's done.

Workspace IDs are copyable on that same page, for when you'd rather point Claude at one directly.

## What's in here

- **`skills/google-ads-reports`** — how to design a report that still reads correctly in six
  weeks, rather than one shaped around this month's numbers
- **`agents/report-builder`** — proposes a structure, shows you real figures, and saves only
  once you agree
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
