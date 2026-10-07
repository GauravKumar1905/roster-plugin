---
description: Work through the reports queued up in your Roster dashboard
---

Work on a queued report task.

1. **Find the task.** If the user pasted one — "Work on my Roster report task" with a `Task:` line
   — you already have the taskId; go to step 2. Do not call `list_tasks` to find it.

   Otherwise list one client's queue: `list_tasks` with the default workspace from `CLAUDE.md`.
   If there is no default, call `list_workspaces`, ask which client, then `list_tasks` for that
   one. Show what is waiting and ask which to start with. Do not start one on your own initiative.

2. **`get_task` with the taskId** (and the workspaceId too, if the paste had one — it catches a
   mixed-up paste). One call returns the whole brief: their instruction, the campaign and its
   last-30-day delivery, `canReport`, existing reports, templates, the `ids` to use, and
   `nextSteps`. Do not call other tools to rediscover any of it. If it returns an `error` or a
   legacy note, tell the user what it says and stop.

3. **Design it with the user — yourself.** Summarise the campaign in two lines, ask what report
   they want with two or three options, design it from `canReport`, `preview_report` with
   `ids.accountId` and `ids.campaignIds`, and iterate until they agree on the structure. Nothing
   is saved in this step.

4. **Hand the build to the `report-builder` agent.** Give it the agreed spec exactly as last
   previewed (or the chosen templateId), the user's instruction, and `ids.accountId`,
   `ids.campaignIds`, `ids.workspaceId`. It saves the report, fixes whatever the save's checks
   flag without changing what was agreed, and returns the URL, reportId and warnings. If it
   stopped because a fix would change the agreed report, take that back to the user.

5. **Review, two ways at once.** Give the user the URL and, in the same turn, start the
   `report-reviewer` agent in the background with the reportId, the agreed spec and the
   instruction. When its findings arrive, pass them on briefly. Fixes the user agrees to go back
   to `report-builder` with the reportId — it updates the same report.

6. **`complete_task`** with `ids.taskId` and the reportId, only once the user is happy with it.
   Marking a task done before the work is accepted makes the queue lie.

7. **One task, one report.** Every later change the user asks for — another section, a new
   breakdown, even after `complete_task` and in the same chat — is a change to that same report.
   Preview the full updated spec, then hand it to `report-builder` with the reportId so the
   report keeps its link. Never save a follow-up as a new report: the client would be left with
   several links, each frozen at a different stage.

8. **One task per exchange.** If there are more, stop and ask before starting the next. Working
   through five in silence produces five reports nobody approved.

If their instruction is too vague to act on, the question in step 3 is where it gets settled —
ask, rather than guessing. The person who wrote it is the one who knows.
