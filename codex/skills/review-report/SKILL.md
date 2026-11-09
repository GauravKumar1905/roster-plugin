---
name: review-report
description: "Review a Roster report that was just saved, before it goes to the client: is it what was agreed, does it answer the note the agency wrote for it, are the figures believable. Use straight after the last page of a report is saved, or when the user asks you to check a report. Read-only; it changes nothing."
---

# Review a saved report

You review a Roster report that has just been saved. The user is looking at the same report in
the dashboard right now; your job is to catch what a busy person skimming it would miss, before
it goes to their client.

You change nothing. You report.

## What you are given

- The **reportId**.
- The **agreed structure** — the pages the user approved, one preview at a time.
- The **user's note** — what they asked the report to do, written when they asked for it in
  Roster. If you were not given it, `get_report` returns it as `note`.

## Read

`get_report` with the reportId. It returns the saved spec, the figures from its latest render as
tables, and `checks` — the automatic warnings. Start from those warnings; do not restate them
without saying what to do about each.

## Check, in this order

1. **It is what was agreed.** Every agreed page is there, and every section and widget on it,
   with the same metrics, breakdowns and date range. Nothing extra appeared, and nothing was
   quietly swapped. A report `get_report` still marks `beingBuilt` is not finished — say which
   pages are missing and stop.
2. **It answers the note.** Read what the user asked for. Does someone opening this report
   find that answer first, or have to dig for it?
3. **The figures are believable.**
   - A widget that is all zeros, or that has one row where several were expected.
   - Widgets over the same dates that disagree on spend — unless the smaller one is a breakdown
     whose title says it is partial, or names the campaigns it covers ("Search campaigns only").
   - Rates that cannot happen (CTR or view rate over 100%), or a CPM or CPC far out of line with
     the rest of the report.
   - A first or last period that is only partly covered and is drawn as if it were whole.
4. **The charts suit the data.** No ratio (CTR, CPA, ROAS) in a pie. No pie with a dozen slices.
   No separate chart repeating a table's figures — tables draw their own chart.
5. **It will still read correctly in six weeks.** Titles with a hard-coded month or number, or a
   structure built around this month's figures, break the first time the numbers move.

`get_catalog` with the reportId has the chart rules, and what the report's campaigns can report,
if you need to confirm one. For a Meta Ads report (`platform: "meta"` in `get_report`) it gives
Meta's rules: age × gender is allowed there, clicks are link clicks, and conversions are the
report's chosen action. For a Search Console report (`platform: "search_console"`) it gives the
site's: clicks are organic, average position is lower-is-better and never a sort, query tables miss
private queries, and page tables never show a total. For a Google Analytics report
(`platform: "analytics"`) it gives GA4's: users are never summed, a pie or a stacked bar, page and
event tables never show a total, rates come from counts, and `key_events` is every key event unless
the report has a chosen one (`conversionAction`).

## What to return

At most eight findings, most important first. One line each:

- **Must fix** or **Worth considering** — what is wrong, where (page, section and widget title),
  and the concrete change.

If you find nothing that matters, say "No issues found" and stop. Do not pad the list. Do not
praise the report, and do not summarise what it contains.
