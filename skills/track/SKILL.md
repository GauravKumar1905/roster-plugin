---
name: track
description: Set up campaign tracking in Roster — each morning Roster checks the Google Ads or Meta Ads campaigns the user picks to track (delivery, spend against the plan, conversions, rejected ads, results against target, weak ads, changes by people outside the agency, Meta's Advantage+ enhancements switching on) and lists what needs them — and read back what it found. Use when the user pastes "Set up campaign tracking in Roster", asks Roster to watch, monitor or keep an eye on a client's campaigns or budget, asks what needs attention today, asks about a Roster tracking finding, or pastes a Roster tracking link (/tracking/wch_…).
argument-hint: "[client or tracking link]"
---

Plugin version: 0.26.0

Pass this version as `pluginVersion` to `check_setup`. If a result carries a note headed
"ROSTER PLUGIN:", do what it says.

# Campaign tracking in Roster

**First:** tracking is open only where Roster's tools include `watch_campaigns`. If they don't, say
"Campaign tracking is in early access in Roster. To turn it on for your agency, email
gauravkr.contact@gmail.com." and stop.

Roster checks each watch every morning, in the ad account's own time zone — only the campaigns the
user picked, never a whole account — and lists what needs the agency in two tiers: **Now** — something stopping the account or spending money it shouldn't — and
**This week** — the rest. It only reads. It never pauses an ad, changes a budget or edits anything;
every finding ends in what the agency can do.

## Setting up a watch

A watch is campaigns the user picked in one ad account of one client. They can also pick them
themselves in Roster (Tracking → Track campaigns). Ask only what you don't know:

1. **Which client and ad account.** `list_clients` if you need to find them. One account per
   watch; a client with Google Ads and Meta gets two.
2. **Which campaigns to track.** Call `watch_campaigns` with the account and no `campaignIds`: it
   tracks nothing and returns the account's campaigns (`accountCampaigns`, by last-30-day spend).
   Show them and let the user pick — never pick for them, and never track them all by default.
3. **The budget**: a month's (`{kind: "monthly", amount}`), or a flight's dates and amount
   (`{kind: "flight", amount, start, end}`), in the account's currency. Without a budget Roster
   checks everything except pacing — say so, never guess one.
4. **What good looks like**: a cost per result to stay under (`{metric: "cpa", value}`) or a ROAS to
   stay over (`{metric: "roas", value}`, 4 for 4×). On Meta, which action counts as a result, if not
   the campaign's own objective. Optional.

Then `watch_campaigns` with the picked `campaignIds`. It reads them once and returns where it stands. Tell the user in a
few lines: pacing, then the Now findings, then how many This week ones — and the link. Don't paste
every finding back.

The **band** is how far off plan the projected month-end may be before it's flagged; 90–110% unless
the user says otherwise. There's no industry standard for it.

## What needs attention

`list_watches` gives every watch with its Now and This week counts, worst first. `get_watch` gives
one watch's findings, each with what Roster saw, why it matters and what to do, in the dashboard's
words — use them. Pass `check: true` only when the user wants it read again now.

When explaining a finding:

- **Check tracking before blaming the campaigns** for a sudden change: a drop to zero conversions
  with clicks steady is usually the tag, a doubling usually a duplicate one.
- **Meta changed how it counts conversions on 12 November 2026** (on-device conversions count by
  default). Results can rise with no change in sales; findings say so. Suggest waiting 5–7 days
  before acting on a change in results, and telling the client it's counting, not sales.
- **Normal overdelivery isn't a problem**: Google can spend up to twice a daily budget on a day,
  Meta up to 75% over. Roster only flags well past that.
- Recovery isn't instant: after a billing fix or a broken tag, results can take days to settle.

## Telling the client

The worst outcome is the client finding a problem first. When a finding stopped delivery, spent
beyond what was agreed, or broke tracking, offer to draft a short note: what happened, what it cost
or may cost, what's being done, and anything the client needs to do (often billing). Draft it for
the user to send — never send it, and never promise a result.

## Changing or stopping a watch

`watch_campaigns` with `watchId` changes the budget, target, band or campaigns in place (the
campaigns are replaced; a watch keeps at least one).
`dismiss_finding` marks one as not a problem — only when the user says so; it stays quiet for 7
days unless it gets worse. A **Changed** finding names the `person` who made the changes: when the
user says that person is on their team, `dismiss_finding` with `thatsUs: true` — Roster stops
flagging their changes on every client's watches. Never assume someone is on the team.
`stop_watching` stops the morning checks; the history stays.
