---
description: Change a report you already have
---

Change this report: **$ARGUMENTS**

A change to a report is designed here, with the user, and saved by the `report-builder` agent over
the same report — the link they already have keeps working.

1. **Find it.** A pasted `/r/rep_…` link carries its id. Otherwise `list_reports` for the client
   (the default workspace in `CLAUDE.md`, or ask which) and ask which one.
2. **`get_report`** — its spec, its latest figures, and the automatic checks. Say briefly what is
   there now: sections and what each contains.
3. **Propose the change as a difference**, not a whole new report: "I'd add a Conversions column to
   the campaign table and leave everything else." Wait for agreement.
4. **`preview_report`** with the full updated spec and the report's `accountId` and `campaignIds`.
   Show the figures.
5. **Hand it to `report-builder`** with the `reportId` and the full updated spec. It saves with
   `save_report` and that `reportId`, so the report is changed in place.

Change only what was asked. The report is already in front of a client, and someone is used to how
it looks. If you spot something genuinely wrong, mention it — do not silently fix it.
