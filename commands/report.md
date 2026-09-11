---
description: Design a Google Ads report for one of your clients
---

Design a report for: **$ARGUMENTS**

If nothing was named, call `list_workspaces` first and ask which client this is for. Do not guess
— building a report against the wrong client's account is worse than one extra question.

Follow the `google-ads-reports` skill in this plugin. It carries the rules that matter, in
particular that you are designing a structure that must still be correct in six weeks, not a
snapshot of this week's numbers.

The order is not optional:

1. `list_report_templates` — the agency may already have a format for this. If one fits, offer it
   by name and apply it; that is the whole job.
2. `list_accounts` — find the account id for the named client
3. `describe_account` — see what the account actually supports before designing anything
4. `get_catalog` — use only metric and dimension ids that exist; inventing one is the most
   common way a saved report fails validation
5. **`preview_report`** — render it against the real account, saving nothing. Show the user the
   figures and ask whether this is what they wanted. **Never skip this.** A saved report is what
   the agency sends their client; finding out the breakdown was wrong afterwards is the failure
   this step exists to prevent.
6. `save_report_template` with `applyToAccountId` — only once they have agreed

Design around what `describe_account` reports, not what a good report usually contains. An
account with no conversion data must not be given cost-per-acquisition or return-on-ad-spend
widgets; it gets reach and efficiency instead. Widgets that need a capability the account lacks
are skipped at render time, so designing them in produces a report with holes in it.

When you are done, give the user the dashboard URL and one sentence on what the report covers.
Do not paste the numbers back — the whole point is that the dashboard holds them and refreshes
them from now on.
