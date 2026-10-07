---
description: Turn your agency's existing report format into a reusable Roster template
---

Build a Roster template from the agency's own format: **$ARGUMENTS**

Agencies almost always have a house report already — a spreadsheet, a slide deck, a PDF they send
every month. The job is to reproduce that structure in Roster so it renders itself from then on.

## If they shared a file

Read it. Work out:

- what sections it has, and in what order
- which numbers appear, and which are headline figures versus detail
- what each table breaks down by — campaign, device, day, network
- which charts appear, and what they plot
- what date range it covers, and whether it compares against a previous period

Then map every number onto the catalogue with `get_catalog`. **Anything not in the catalogue
cannot be included** — say so plainly rather than substituting something similar. A report that
silently swaps cost-per-acquisition for cost-per-click is worse than one that admits a gap.

## If they only described it

Ask for the file, or for the section headings. Guessing at an agency's house format wastes more
time than asking.

## Then

1. `list_report_templates` — they may already have this saved.
2. Ask whether it is for **one client** or **every client**. A client template is offered only for
   that client; an agency template for all of them.
3. Test it against a real campaign: ask them to paste a queued task, and `get_task` gives you its
   `ids` and what that campaign can report on (`canReport`). Or use one of the client's accounts
   from `list_workspaces`.
4. `preview_report` with those ids — show the figures and ask whether it matches their existing
   report.
5. Iterate until they say it does.
6. `save_report_template` with `saveAsTemplate: true`, `templateScope` (`client` with the
   `workspaceId`, or `agency`), a clear name, and a description saying what it is for — that
   description is what tells the next person which template to reach for. Nothing is rendered;
   a template is not a report.

Once saved, apply it to a campaign with `apply_template`. Each report made from it gets its own
copy, so improving the template later changes the reports made after that, never the ones
already sent. A report that already exists can also be turned into a template from the client's
**Templates** page in the dashboard.
