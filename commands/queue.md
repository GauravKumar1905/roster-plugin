---
description: Work through the reports queued up in your Roster dashboard
---

Work on a queued report task.

1. **Find the task.** If the user pasted one — "Work on my Roster report task" with `Workspace:`
   and `Task:` lines — you already have both ids; go to step 2. Do not call `list_tasks` to find
   it.

   Otherwise call `list_tasks`, show what is waiting grouped by client, and ask which to start
   with. Do not start one on your own initiative.

2. **`get_task` with the workspaceId and taskId.** One call returns the whole brief: their
   instruction, the campaign and its last-30-day delivery, `canReport`, existing reports, saved
   templates, the `ids` to use, and `nextSteps`. Do not call other tools to rediscover any of it.
   If it returns an `error` or a legacy note, tell the user what it says and stop.

3. **Follow `nextSteps`.** Use the `report-builder` agent, or follow its process yourself:
   summarise the campaign in two lines, ask what report they want with two or three options,
   design it, `preview_report` with `ids.accountId` and `ids.campaignIds`, and save only once
   they agree.

4. **`complete_task`** with `ids.taskId` and the report id, **after** the report is saved and
   seen. Marking a task done before the work exists makes the queue lie.

5. **One task per exchange.** If there are more, stop and ask before starting the next. Working
   through five in silence produces five reports nobody approved.

If their instruction is too vague to act on, the question in step 3 is where it gets settled —
ask, rather than guessing. The person who wrote it is the one who knows.
