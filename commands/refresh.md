---
description: Re-render an existing report against today's numbers
---

Re-render a report: **$ARGUMENTS**

Reports refresh on their own, so this is for when someone wants the latest figures immediately
rather than waiting.

1. Find the report: a pasted `/r/rep_…` link carries its id; otherwise `list_reports` for the
   client (the default workspace in `CLAUDE.md`, or ask which).
2. `get_report` for its spec, then `save_report_template` with that spec unchanged and the same
   `reportId`. That re-renders it in place — never `apply_template`, which makes a second report.

Return the dashboard URL and when it was refreshed. If the save returns warnings or skipped widgets, say
which and why in one line each — a skipped widget almost always means the account lacks the
capability that widget needs, not that anything is broken.

If Google refuses the account's stored connection, say so plainly and tell them to reconnect that
workspace at https://roster-1035727789436.asia-southeast1.run.app. Do not retry.
