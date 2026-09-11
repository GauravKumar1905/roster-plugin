---
description: Show your Roster clients, their connected accounts, and existing reports
---

Give the user a short picture of their Roster account.

1. `list_workspaces` — the clients and the Google Ads accounts attached to each
2. `list_report_templates` — the report designs that already exist

Present it as one compact list per client: the client name, its accounts, and any reports. Plain
text, not a wall of JSON.

Call out anything that will not work, because these are the things that silently produce empty
reports:

- a client with no Google Ads accounts attached — nothing can be reported on until one is
- a report template that has never been applied to an account
- a client whose accounts are all manager accounts, since Google refuses metrics on those

If everything is in order, say so in a sentence and stop. Do not pad it.
