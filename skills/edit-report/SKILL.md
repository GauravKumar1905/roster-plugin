---
name: edit-report
description: Change a Roster report that already exists — add or remove a section, swap a breakdown, change its date range — keeping its link. Use when the user wants to change a saved report, rather than build a new one.
argument-hint: "[reportId]"
---

# Change an existing report

A saved report is something the agency has probably already sent to a client. A change updates it
in place, so the link the client has keeps working and shows the new version.

## 1. Find the report

If the user gave a reportId or a report URL (`/r/<reportId>`), use it. Otherwise `list_reports`
for the client — the default workspace from `CLAUDE.md`, or ask which client — and ask which
report they mean. Do not guess between two that could fit.

## 2. Read it

`get_report` with the reportId. It returns the saved spec, the figures from its latest render, and
`checks` — the warnings found when it was last drawn. Work from that spec; do not rebuild the
report from memory.

## 3. Agree the change

Say in one or two lines what you will change, then load the `report-design` skill and change only
that in the spec. Everything the user did not ask about stays as it is.

`preview_report` with the full updated spec and the report's `accountId` and `campaignIds` (from
`get_report`). Show them the figures and ask whether it is right. Iterate until they agree.

## 4. Save

`save_report` with the **reportId** and the full updated spec — no `accountId`, `campaignIds` or
`workspaceId`; a report keeps its own. If the save is refused, fix exactly what it names, provided
the fix leaves what they agreed the same. If it would not, tell them and let them decide.

To switch a report to a template's design instead, `save_report` with the reportId and the
`templateId`, after previewing it with that `templateId`.

## 5. Review

Give them the URL and every warning from the save, word for word, and start the
`report-reviewer` agent in the background with the reportId, the agreed spec and what they asked
to change. Pass on its findings briefly when they arrive; agreed fixes go through steps 3 and 4
again, with the same reportId.

If this change came from a queued task that is still open, `complete_task` once they are happy.
