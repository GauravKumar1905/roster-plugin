---
name: report
description: Build a Google Ads report for one task queued in the Roster dashboard. Use when the user pastes "Work on my Roster report task", picks a task from their queue, or asks what reports are waiting for a client.
argument-hint: "[taskId]"
---

# Work on a queued report task

Every report starts as a task queued in the dashboard: one campaign, and the user's instruction.
You design it with the user, show them real figures, save it, and have it reviewed — in this
conversation, because only here can you ask them what they want.

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
can report — metrics, breakdowns, chart rules — with the reason for everything left out, and
`preview_report` and `save_report` hold your design to exactly that list. It costs no extra
Google query after `get_task`.

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

## 4. Design and preview

Load the `report-design` skill before writing the spec. Then `preview_report` with the spec (or
the chosen `templateId`), `ids.accountId` and `ids.campaignIds`. It renders against the real
account, runs the same checks a save does, and stores nothing.

A spec you write is refused if it uses anything outside the campaign's catalog, or a partial
breakdown whose title does not say "partial". A template is treated differently: whatever the
campaign cannot report is skipped, and the preview lists what was skipped and why — tell the user.

Show them the figures and ask whether the sections, metrics and breakdowns are right. Change and
preview again until they agree on the structure. Do not describe a report and save it in the same
breath — stop and let them answer.

## 5. Save

Once they agree, `save_report` with the spec **exactly as last previewed** (or the `templateId`),
no `reportId`, and `ids.accountId`, `ids.campaignIds`, `ids.workspaceId`. The save renders the
report again and refuses it if a widget fails or comes back empty.

- **Refused for a problem in the design** — fix exactly what it names and save again, as long as
  the fix leaves the agreed report the same: a mistyped id, a slot in the wrong place, a missing
  sort, a title that should say a breakdown is partial.
- **A fix would change what they agreed** — a breakdown that came back empty, a widget that has to
  go — do not save a different report. Tell them the problem and the smallest change you would
  suggest, preview it, and save once they agree.
- **Refused because these campaigns already have a report** — do not pass `asNewReport` to get
  around it. Tell them, and treat what they asked for as a change to that report. Pass
  `asNewReport` only when they explicitly want a second, separate report.

## 6. Review — two ways at once

In the same turn: give the user the report's URL and every warning from the save, word for word,
and start the `report-reviewer` agent in the background with the reportId, the agreed spec and
their instruction. They look at the report while the reviewer does.

When the reviewer's findings arrive, pass them on briefly. For each fix they agree to: preview the
full updated spec, then `save_report` with the **same reportId** and no `accountId` or
`campaignIds` — the report keeps its link.

## 7. Complete the task

`complete_task` with `ids.taskId` and the reportId — only once they are happy with it. Marking a
task done before the work is accepted makes the queue lie.

## Rules that hold throughout

- **One task, one report.** Every later change — another section, a new breakdown, even after
  `complete_task` and in the same chat — is a change to that same report: preview the full
  updated spec, then `save_report` with its reportId. Never save a follow-up as a new report; the
  client would be left holding several links, each frozen at a different stage.
- **One task per exchange.** If there are more, stop and ask before starting the next. Working
  through five in silence produces five reports nobody approved.
