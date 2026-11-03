---
name: report
description: "Build a Google Ads or Meta Ads report asked for in Roster. Use when the user pastes \"Build this Roster report with me\" or \"Carry on building this Roster report with me\", a Roster report link (/r/…), or asks which reports are waiting for a client."
---

# Build a report asked for in Roster

Every report is asked for in Roster: the agency picks **Google Ads report** or **Meta Ads report**,
chooses the ad account, writes a note for you if it wants, and presses the button that copies the
request. That makes the report — its link exists before it has a design — and copies a message
like this:

> Build this Roster report with me.
> Report: https://app.useroster.xyz/r/rep_8kq2m5c1a7d3e9f0
> Google Ads account: Acme Dental (384-221-9057), campaign Implants – Search
> Note: Monthly report for the practice manager; new-patient leads matter most.

You build into that report. Your first reply is the plan and its Overview, with real figures; then
the other pages, one at a time, each previewed and saved only when they approve it; then a review.
All in this conversation, because only here can you ask them what they want.

## 1. Find the report

If the paste has a report link (`/r/rep_…`) — "Build this Roster report with me", "Carry on
building this Roster report with me", or the link on its own — you have it; go to step 2.

Otherwise, `list_reports` for the client they named. If they named none, ask which client in a
line (`list_workspaces` has their names) — never pick one yourself. Offer the reports
whose `status` says they are waiting or being built, and ask which to start. Do not start one on
your own initiative. If nothing is waiting, tell them how to ask for one: in Roster, pick Google
Ads report or Meta Ads report, choose the ad account, copy the message Roster gives them and paste
it here.

## 2. Read the brief

`get_task` with `report` = the link, as pasted. One call returns the note they wrote for you, the
campaign and its last-30-day delivery, `existingReports`, `savedTemplates`, the `ids` for every
later call — `ids.reportId` first: you build into that report — and `nextSteps`. Follow
`nextSteps` in order, and do not call other tools to rediscover any of it.

If it returns an `error`, tell the user what it says and stop: a request cancelled in Roster, a
report that isn't theirs, or a campaign Google or Meta could not read. If the report is already
built, it says so: give them the link and ask whether they want it changed — that is the
`edit-report` skill.

**A report left half-built** — the brief lists `pagesRemaining`. Tell them in one line where it
stands, then carry on from the first remaining page, asking first. Go to step 4.

## 3. Your first reply: the plan and the Overview, in one message

Nothing is saved before they answer it. In one message:

- If `existingReports` is not empty, or a `savedTemplates` entry has `fits: true`, one line naming
  them first. They may want a change to a report they have (the `edit-report` skill), or their
  house format.
- Two lines on what the campaign spent and converted in the last 30 days.
- The report you propose — "Monthly report", for Last month, unless their note says otherwise —
  and its pages: Overview, then only the pages this campaign has data for (no Demographics on
  Performance Max), by the names they read. A short report is Overview alone; that is fine.
- The Overview itself, with real figures. Load the `report-design` skill once, then `get_catalog`
  with `campaignId` = `ids.campaignIds[0]`; it returns only what this campaign can report. Design
  the Overview from that alone — go through `report-design`'s checklist — and
  `preview_report_page` with `reportId` = `ids.reportId`, page `overview`, the report's `name` and
  `dateRange`.
- End on exactly one question: "Save Overview and go on to Ad groups?" — naming the page after it.
  Their yes approves the plan and the Overview together.

Their note was written in a hurry on a dashboard — "monthly report for this campaign". The plan is
where it gets settled: propose, and let them correct it. Where the note contradicts itself, ask
rather than guess.

**A Meta Ads report** (`platform: "meta"`, an account id starting `act_`) asks one thing with the
plan: Meta has no single conversion. The first message is the two lines and the plan, ending on the
brief's question — "Which result should count as a conversion — Leads (96 in the last 30 days) or
Purchases (3)?", from `conversionActions` — and nothing is designed yet. With their answer (it may
be none), the next message is the Overview: `get_catalog` with `accountId` = `ids.accountId`, the
`campaignId` and that `conversionAction`; `preview_report_page` with the reportId, page `overview`,
the name, the dateRange and that `conversionAction`; and "Save Overview and go on to …?". Load
`report-design`'s `meta.md` before designing. An account that recorded no conversion actions has
nothing to ask: say so in one line, and the plan and Overview come in one message, as for Google.

**A saved template instead?** If they choose one of `savedTemplates`, there are no pages to build:
`preview_report` with the `templateId`, `ids.accountId` and `ids.campaignIds`; show the figures and
what was skipped; on their yes, `save_report` with the `templateId` and `reportId` = `ids.reportId`.
Then step 5.

## 4. Build it, one page at a time

1. **On their yes to the Overview:** `save_report_page` with that `previewId` and exactly what was
   previewed — reportId, page, sections, name, dateRange, and a Meta report's `conversionAction` —
   plus `plannedPages` = the pages you proposed, as they changed them. Anything that differs from
   the preview is refused: preview again instead of editing on the way to the save.
2. **Tell them it is saved**, with every warning from the save word for word. Their yes covered
   moving on, so design the next page; if they only said to save, ask before starting it.
3. **Design that page only** — its sections and nothing else — and `preview_report_page` with the
   `reportId`, the `page` and its `sections` alone: no `name`, `dateRange`, `accountId` or
   `campaignIds`, which belong to the whole report.
4. **Refused?** It names the exact path and the fix. Correct exactly that and preview again. A page
   that failed gets no `previewId` and is never shown to the user as if it were ready.
5. **Show the figures and STOP.** One question — "Save it and go on to Geo & device?" — nothing else
   in that message, and no tool calls after it. Wait for their answer.
6. **They want a change:** change the page, preview it again, show it, and stop again. Every
   preview gives a new `previewId`; only the latest one can be saved.
7. **They say yes:** `save_report_page` with **exactly** the same `page` and `sections` and that
   `previewId`. Then the next page the same way.

Until every planned page is saved, Roster shows the report as still being built —
**1 of 3 pages** — and it can't be shared. If they add or drop a page partway, `set_report_pages`
with the new list; dropping the last unsaved page finishes the build.

How the saves are refused, and what to do:

- **Refused for a problem in the page** — fix exactly what it names, preview again, and show them
  if anything they would notice changed.
- **A fix would change what they agreed** — a breakdown came back empty, a widget has to go — do not
  save a different page. Tell them the problem and the smallest change you would suggest.
- **A problem on a page saved earlier** — the account's data has changed since. Tell them before
  touching that page.
- **Refused after they already approved it** — say a whole design that `save_report` would not take.
  Their yes still stands: rebuild it as pages with exactly the same sections, Overview first; where
  the figures match what they saw, save without asking again. Tell them in one line what you did
  ("Saved as a one-page report").
- **Never work round a refusal** — not by saving a template, not with another tool. If the tool a
  refusal points to is not in your list, Roster's tools here are out of date: say so, and tell
  them to update the Roster plugin.

## 5. Ready, and the review

When the last planned page is saved, the save gives the words to say: "Your report is ready: <link>.
Press Share with client there to make the link Acme Dental sees." Say exactly that, with every
warning, then review it with the `review-report` skill — the reportId, the pages they approved
and their note. They look at the report while you do.

Pass your findings on briefly. A fix they agree to goes through the same loop as building:
preview that page with the reportId, show it, and save it on their yes.

There is nothing to mark done: Roster shows the report as **Ready to share** the moment its last
page is saved, and the agency shares it from there.

## Talking to the user

They run an agency; they are not developers. In every message:

- **Say what happens, not how.** "I'll save it as a one-page report." "Overview is saved — Ad
  groups next." Never tool names, "spec", "connection", "connector", "server", `/mcp`, and never
  "page by page" as a rule they have to follow.
- **Use the dashboard's words:** Ready to share, Share with client, Refresh figures. Never "task",
  "queue" or "sent" — a report is shared, from Roster.
- **When something goes wrong:** what happened, in one line; whether anything they approved is lost
  (it rarely is); and the one thing you recommend, as a yes-or-no question. Not a menu of options
  with trade-offs they cannot judge.
- **An answer that does not match what you offered** — ask what they meant, in one line, instead of
  picking the nearest option. Guessing turns a misunderstanding into a saved report.
- **One page is a whole report.** If they want everything on one page, that is the Overview alone —
  one preview, one save. Never tell them it has to be split up.

## Rules that hold throughout

- **One page per preview, one page per save.** Never put a whole report in one call. The server
  refuses a new report written as one spec, a page that was not previewed in exactly that form,
  and any first page but Overview.
- **Never save in the message that shows a preview.** The user's yes comes in between, every time.
- **One request, one report.** Every later change — another section, a new page, even in the same
  chat — is a change to that same report, through the same loop with its reportId. Never save a
  follow-up as a new report; the client would be left holding several links, each frozen at a
  different stage.
- **A report left half-built** (the conversation ended mid-build) comes back as "Carry on building
  this Roster report with me: <link>": `get_task` with the link lists `pagesRemaining`. Carry on
  from the first of them, asking first.
- **One report per exchange.** If more are waiting, stop and ask before starting the next. Working
  through five in silence produces five reports nobody approved.
