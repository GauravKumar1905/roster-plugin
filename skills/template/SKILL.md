---
name: template
description: Turn an agency's own report format into a reusable Roster template, or change a template they already have. Use when someone shares their monthly report (a spreadsheet, slides, a PDF) or asks for a template, a house format, or a standard report for every client.
---

# Build or change a template

Agencies almost always have a house report already — a spreadsheet, a slide deck, a PDF they send
every month. A template reproduces that structure in Roster, so every new report can start from
it and render itself from then on.

A report and a template are different things. A template is a design someone chose to reuse, for
**one client** or for **every client**. Each report made from it gets its own copy, so improving a
template later changes new reports, never ones already sent.

## 1. Check what they have

`list_templates` — they may already have this saved. If so, a change to it is `get_template`,
then the steps below with that `templateId`.

## 2. Work out their format

**If they shared a file,** read it and work out:

- what sections it has, and in what order
- which numbers appear, and which are headline figures versus detail
- what each table breaks down by — campaign, device, day, network
- which charts appear, and what they plot
- what date range it covers, and whether it compares against a previous period

**If they only described it,** ask for the file, or for the section headings. Guessing at an
agency's house format wastes more time than asking.

## 3. Map it onto the catalogue

Load the `report-design` skill, then map every number onto `get_catalog`. **Anything not in the
catalogue cannot be included** — say so plainly rather than substituting something similar. A
report that silently swaps cost-per-acquisition for cost-per-click is worse than one that admits
a gap.

Widgets that need conversion data declare it in `requires`, so the template still renders for a
client without conversion tracking — those widgets are skipped rather than shown empty.

## 4. Test it on a real campaign

Ask whether it is for one client or every client. Then `preview_report` with the spec and a real
campaign — a queued task's `ids` from `get_task`, or one of the client's accounts from
`list_workspaces` — and ask whether it matches their existing report. Iterate until they say it
does.

## 5. Save

`save_template` with no `templateId`, the `spec`, the `scope`, a clear name, and a description
saying what it is for — the description is what tells the next person which template to reach
for. To change one, `save_template` with its `templateId`; reports already made from it do not
change.

If they already have a report in this shape, `save_template` with `fromReportId` copies its design
instead. A report can also be turned into a template from the client's **Templates** page in the
dashboard.

## Using a template

A new report from a template is the `report` skill's flow with the `templateId`: preview it with
`preview_report` and the `templateId`, then `save_report` with it.
