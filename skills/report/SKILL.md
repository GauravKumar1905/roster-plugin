---
name: report
description: Build a Google Ads report for one task queued in the Roster dashboard. Use when the user pastes "Work on my Roster report task", picks a task from their queue, or asks what reports are waiting for a client.
argument-hint: "[taskId]"
---

# Work on a queued report task

Every report starts as a task queued in the dashboard: one campaign, and the user's instruction.
You agree its pages with the user, then build it one page at a time — each previewed with real
figures and saved only when they approve it — and have it reviewed. All in this conversation,
because only here can you ask them what they want.

## 1. Find the task

If the user pasted one — "Work on my Roster report task" with a `Task:` line — or passed a taskId,
you have it; go to step 2. Do not call `list_tasks` to find it.

Otherwise list one client's queue: `list_tasks` with the default workspace from `CLAUDE.md`. If
there is no default, call `list_workspaces`, ask which client, then `list_tasks` for that one.
Show what is waiting and ask which to start with. Do not start one on your own initiative.

## 2. Read the brief

`get_task` with the taskId, and the workspaceId too if the paste had one — it catches a mixed-up
paste. One call returns their instruction, the campaign and its last-30-day delivery,
`existingReports`, `savedTemplates`, the `ids` for every later call, and `nextSteps`. Do not call
other tools to rediscover any of it.

If it returns an `error` or a legacy note, tell the user what it says and stop.

Then `get_catalog` with `campaignId` = `ids.campaignIds[0]`. It returns only what this campaign
can report — metrics, breakdowns, chart rules — with the reason for everything left out, and the
preview and save tools hold your design to exactly that list. It costs no extra Google query after
`get_task`.

## 3. Ask what they want

The instruction was written in a hurry on a dashboard — "monthly report for this campaign". Turn
it into a choice before designing anything:

- Say what the campaign is in two lines: type, status, last-30-day spend and delivery.
- If `existingReports` is not empty, mention those first. They may want a change, not a new
  report — that is the `edit-report` skill.
- Offer two or three reports that suit **this campaign type**, built only from what `get_catalog`
  returned. A
  video campaign is about reach and views; a search campaign about clicks, cost and, where it
  converts, conversions; Performance Max about outcomes, because its breakdowns are thin.
- Lead with a `savedTemplates` entry where `fits` is true — it is the agency's house format.
- Then stop and wait. One question, short options, no preamble.

If their instruction is too vague to act on, this question is where it gets settled. Ask rather
than guess — the person who wrote it is the one who knows.

## 4. Agree the pages

A report is read one page at a time — Overview, then pages such as Ad groups, Creative,
Demographics, Platform, Geo & device — and it is **built** one page at a time too. Before designing
anything, agree which pages it will have:

- Propose the pages that suit this campaign, from what `get_catalog` returned: Overview always,
  then only pages the campaign has data for (no Demographics on Performance Max). Say in a few
  words what each would hold.
- A short report is Overview alone. That is fine.
- Ask, and wait. Their answer is the `plannedPages` you pass when the report is first saved.

**A saved template instead?** If they chose one of `savedTemplates`, there are no pages to build:
`preview_report` with the `templateId`, `ids.accountId` and `ids.campaignIds`; show the figures and
what was skipped; on their yes, `save_report` with the `templateId` and the three ids. Then go to
step 6.

## 5. Build it, one page at a time

Load the `report-design` skill once, before the first page. Then, for each page in the agreed
order, **Overview first**:

1. **Design this page only** — its sections and nothing else. Go through the checklist in
   `report-design` before previewing.
2. **`preview_report_page`** with `page` and that page's `sections`.
   - **Overview, when the report does not exist yet:** also `accountId` and `campaignIds` from
     `ids`, and the report's `name` and `dateRange` (they apply to every page).
   - **Every later page:** `reportId` instead, and nothing else about the report.
3. **Refused?** It names the exact path and the fix. Correct exactly that and preview again. A
   page that failed gets no `previewId` and is never shown to the user as if it were ready.
4. **Show the figures and STOP.** Ask one question, for example: "Save Overview and move on to Ad
   groups?" Nothing else in that message, and no tool calls after it — wait for their answer.
5. **They want a change:** change the page, preview it again, show it, and stop again. Every
   preview gives a new `previewId`; only the latest one can be saved.
6. **They say yes:** `save_report_page` with **exactly** the same `page`, `sections` and report
   fields as that preview, plus its `previewId`. For Overview of a new report, also
   `workspaceId` from `ids` and `plannedPages`. Anything that differs from the preview is refused —
   preview again instead of editing on the way to the save.
7. Tell them the page is saved, with every warning from the save word for word. Their yes covered
   moving on, so design and preview the next page; if they only said to save, ask before starting
   it.

The report stays **being built** — visible in the dashboard, but it cannot be shared — until every
planned page is saved. If they add or drop a page partway, `set_report_pages` with the new list;
dropping the last unsaved page finishes the build.

How the saves are refused, and what to do:

- **Refused for a problem in the page** — fix exactly what it names, preview again, and show them
  if anything they would notice changed.
- **A fix would change what they agreed** — a breakdown came back empty, a widget has to go — do not
  save a different page. Tell them the problem and the smallest change you would suggest.
- **Refused because these campaigns already have a report** — tell them, and build into that report
  with its reportId instead. Pass `asNewReport` only when they explicitly want a second, separate
  report.
- **A problem on a page saved earlier** — the account's data has changed since. Tell them before
  touching that page.

## 6. Review — two ways at once

When the last planned page is saved, in the same turn: give the user the report's URL and start
the `report-reviewer` agent in the background with the reportId, the pages they approved and their
instruction. They look at the report while the reviewer does.

When the reviewer's findings arrive, pass them on briefly. A fix they agree to goes through the
same loop as building: preview that page with the reportId, show it, and save it on their yes.

## 7. Complete the task

`complete_task` with `ids.taskId` and the reportId — only once they are happy with it. Marking a
task done before the work is accepted makes the queue lie.

## Rules that hold throughout

- **One page per preview, one page per save.** Never put a whole report in one call. The server
  refuses a new report written as one spec, a page that was not previewed in exactly that form,
  and any first page but Overview.
- **Never save in the message that shows a preview.** The user's yes comes in between, every time.
- **One task, one report.** Every later change — another section, a new page, even after
  `complete_task` and in the same chat — is a change to that same report, through the same loop
  with its reportId. Never save a follow-up as a new report; the client would be left holding
  several links, each frozen at a different stage.
- **A report left half-built** (the conversation ended mid-build) is picked up from `get_report`:
  it lists `pagesRemaining`. Carry on from the first of them, asking first.
- **One task per exchange.** If there are more, stop and ask before starting the next. Working
  through five in silence produces five reports nobody approved.
