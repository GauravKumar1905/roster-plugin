---
description: Re-render an existing report against today's numbers
---

Re-render a report: **$ARGUMENTS**

Reports refresh on their own, so this is for when someone wants the latest figures immediately
rather than waiting.

1. `list_report_templates` to find the template. If `$ARGUMENTS` names a client rather than a
   report, use `list_workspaces` to work out which account they mean.
2. `apply_template` with that template and the account id.

Return the dashboard URL and when it was refreshed. If the render reports skipped widgets, say
which and why in one line each — a skipped widget almost always means the account lacks the
capability that widget needs, not that anything is broken.

If the account's Google connection has expired, say so plainly and tell them to reconnect that
workspace at https://roster-1035727789436.asia-southeast1.run.app. Do not retry.
