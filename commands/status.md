---
description: Show your Roster clients, their connected accounts, and existing reports
---

Give the user a short picture of their Roster account.

1. `check_setup` — which clients are actually usable, and whether each has a Google connection.
   `list_workspaces` cannot see a missing connection, so it alone would report a dead client as
   healthy.
2. `list_reports` for each client — the reports that exist
3. `list_templates` — the template library, agency-wide and per client

Present it as one compact list per client: the client name, its accounts, and any reports. Plain
text, not a wall of JSON.

Call out anything that will not work, because these are the things that silently produce empty
reports:

- a client with no Google connection — `check_setup` returns this as a `state` per workspace
- a client with no Google Ads accounts attached — nothing can be reported on until one is
- a report whose last refresh failed (`lastError`)
- a client whose accounts are all manager accounts, since Google refuses metrics on those

If everything is in order, say so in a sentence and stop. Do not pad it.
