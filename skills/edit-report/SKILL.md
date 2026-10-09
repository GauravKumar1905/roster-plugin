---
name: edit-report
description: Change a Roster report that already exists — change a page, add a page, swap a breakdown, change its date range — keeping its link. Also picks up a report left half-built. Use when the user wants to change a saved report, rather than build a new one.
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

`get_report` with the reportId. It returns the saved spec, its `pages`, the figures from its
latest render, and `checks` — the warnings found when it was last drawn. Work from that spec; do
not rebuild the report from memory.

If it says `beingBuilt`, the report was left half-built: `pagesRemaining` lists what is still to
come. Ask whether to carry on, then follow the page loop in the `report` skill (step 5) from the
first remaining page.

It also returns `layout`: how the user arranged the sections on the page and the notes they wrote,
as Markdown. Both belong to the user. Keep every section's `key` in the spec you save back, so the
arrangement and notes stay where they put them. If they ask to move sections, put two side by
side, or write commentary, point them to **Arrange & add notes** on the report page — you do not
change those yourself.

`targets` are what the headline numbers are measured against. If the user gives you targets
("120 conversions a month, CPA under 40"), set them with `set_report_targets` — no preview or save
needed, and nothing is re-rendered.

## 3. Agree the change

Say in one or two lines what you will change, and on which page, then load the `report-design`
skill. If the report covers one campaign, `get_catalog` with that `campaignId` (from `get_report`'s
`campaignIds`) says what it can report; otherwise call it without one. Change only what they asked
for. Everything else stays as it is.

## 4. Preview, stop, save — one page at a time

**A change to a page, or a new page** — the usual case:

1. Take that page's sections from the spec `get_report` returned (sections with that `segment`;
   a section with no `segment` is on Overview), keep every `key`, and change only what they asked.
   A new page starts from nothing.
2. `preview_report_page` with the `reportId`, the `page` and that page's `sections` — no
   `accountId`, `campaignIds`, `name` or `dateRange`; a report keeps its own.
3. Show the figures and **stop**. Ask whether it is right. Iterate — each preview gives a new
   `previewId`.
4. On their yes, `save_report_page` with exactly the same page and sections and the latest
   `previewId`. Every other page, the user's arrangement and their notes are kept.

A change touching two pages is two rounds of this, one page at a time, with their yes in between.

**A change to the whole report** — its name or date range, or removing a page entirely: change
the full spec from `get_report`, `preview_report` with it and the report's `accountId` and
`campaignIds`, stop for their yes, then `save_report` with the **reportId** and the full spec. Keep
every section's `key`.

**Switching to a template's design**: `preview_report` with the `templateId`, then on their yes
`save_report` with the reportId and the `templateId`.

If a save is refused, fix exactly what it names, provided the fix leaves what they agreed the same.
If it would not, tell them and let them decide.

## 5. Review

Give them the URL and every warning from the save, word for word, and start the
`report-reviewer` agent in the background with the reportId, what they approved and what they asked
to change. Pass on its findings briefly when they arrive; agreed fixes go through steps 3 and 4
again, with the same reportId.

If this change came from a queued task that is still open, `complete_task` once they are happy.
