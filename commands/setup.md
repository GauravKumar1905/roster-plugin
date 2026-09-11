---
description: Connect this Claude to your Roster account and check you're ready to build reports
---

Get the user connected to Roster and tell them exactly where they stand. Be brief — this should
feel like a two-line answer, not a report.

There is nothing to install and no folder to create. Roster is a hosted service; this plugin
carries only the connection to it.

## What to do

1. **Check the connection.** Call `list_workspaces`.

   - If it fails with an authorization error, Claude will open a browser for the user to sign in
     to Roster. Tell them to expect that, then try once more after they have signed in. Do not
     retry repeatedly — if two attempts fail, stop and say what the error was.
   - If it succeeds, they are connected. Say so.

2. **Report where they are**, using what `list_workspaces` returned:

   - **No workspaces yet** — they need to create one in the dashboard first, since a workspace is
     where a Google Ads connection lives. Point them at the Roster dashboard and stop here.
   - **Workspaces exist but none has accounts** — they have created a client but not attached any
     Google Ads accounts. Tell them which workspace, and that it happens in that workspace's
     Settings in the dashboard.
   - **Workspaces with accounts** — they are ready. List the client names and how many accounts
     each has, then tell them they can ask for a report in plain language, giving one concrete
     example using one of their actual client names.

3. **Do not** call `describe_account`, `get_catalog` or any other tool during setup. This command
   answers "am I ready?" and nothing else; inspecting accounts is slow and belongs to the moment
   someone actually asks for a report.

## Tone

Report the state, not the mechanics. "You're connected — three clients, all with accounts
attached" is the right shape. Avoid listing tool names or protocol detail unless something
failed and the detail helps them fix it.
