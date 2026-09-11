# Roster for Claude

Design a Google Ads client report once, in plain language. Roster refreshes it every month and
gives you a link to send.

This plugin connects Claude to your Roster account. It contains no application code — the tools
run on Roster's servers, and this package is the connection plus the instructions Claude needs
to use it well.

## Install

In Claude Code:

```
/plugin marketplace add GauravKumar1905/roster-plugin
/plugin install roster@roster
```

Then:

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

You don't have to use the commands. Once connected, asking in plain language works:

> Build a monthly performance report for Northside Coffee.

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
