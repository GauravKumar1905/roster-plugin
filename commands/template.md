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
2. `describe_account` on the client you will test against, so the design fits real capabilities.
3. `preview_report` — show the figures and ask whether it matches their existing report.
4. Iterate until they say it does.
5. `save_report_template` with a clear name. Give it a description saying what it is for, because
   that description is what tells the next person which template to reach for.

Once saved, apply it to any client with `apply_template`. That is the payoff: the format is
entered once and every client after this one is a single call.
