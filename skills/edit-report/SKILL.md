---
name: edit-report
description: Change a Roster report that already exists — change a page, add a page, swap a breakdown, change its date range — as the same report. Also picks up a report left half-built. Use when the user wants to change a saved report, rather than build a new one.
argument-hint: "[reportId]"
---

Plugin version: 0.20.2

Pass this version as `pluginVersion` to `check_setup`, `list_workspaces`, `list_tasks`, `get_task`,
`list_reports`, `get_report` and `list_templates`. If a result carries a note headed
"ROSTER PLUGIN:", do what it says.

# Change an existing report

A saved report is something the agency has probably already sent to a client. A change updates it
in place: it stays the same report, at the same address in the dashboard, and shows the new
version there. A link already shared with the client does not change — it keeps the figures it was
made with. To show the client the change, the agency creates a new link from the report page.

## 1. Find the report

If the user gave a reportId or a report URL (`/r/<reportId>`), use it. Otherwise `list_reports`
for the client they named — if they named none, ask which one in a line (`list_workspaces` has
their names) — and ask which report they mean. Do not guess between two that could fit.

## 2. Read it

`get_report` with the reportId. It returns the saved spec, its `pages`, the figures from its
latest render, and `checks` — the warnings found when it was last drawn. Work from that spec; do
not rebuild the report from memory.

If it says `beingBuilt`, the report was left half-built: `pagesRemaining` lists what is still to
come. Ask whether to carry on, then follow the page loop in the `report` skill (step 5) from the
first remaining page.

It also returns `layout`: how the user arranged the sections on the page and the notes they wrote,
as Markdown. Both belong to the user. Keep every section's `key` in the spec you save back, so the
arrangement and notes stay where they put them. If they ask to move sections, put two side by
side, or write commentary, point them to **Arrange & add notes** on the report page — you do not
change those yourself.

`targets` are what the headline numbers are measured against. If the user gives you targets
("120 conversions a month, CPA under 40"), set them with `set_report_targets` — no preview or save
needed, and nothing is re-rendered.

A **Meta Ads report** (`platform: "meta"`) counts one `conversionAction`. To count a different
one — "use leads, not purchases" — `set_report_conversion_action` with the reportId; it redraws the
report. Name the new action in conversion titles afterwards.

## 3. Agree the change

Say in one or two lines what you will change, and on which page, then load the `report-design`
skill. If the report covers one campaign, `get_catalog` with that `campaignId` (from `get_report`'s
`campaignIds`) says what it can report; otherwise call it without one. For a Meta Ads report also
pass its `accountId` and `conversionAction`, and read `report-design`'s `meta.md`. Change only what
they asked for. Everything else stays as it is.

## 4. Preview, stop, save — one page at a time

**A change to a page, or a new page** — the usual case:

1. Take that page's sections from the spec `get_report` returned (sections with that `segment`;
   a section with no `segment` is on Overview), keep every `key`, and change only what they asked.
   A new page starts from nothing.
2. `preview_report_page` with the `reportId`, the `page` and that page's `sections` — no
   `accountId`, `campaignIds`, `name` or `dateRange`; a report keeps its own.
3. Show the figures and **stop**. Ask whether it is right. Iterate — each preview gives a new
   `previewId`.
4. On their yes, `save_report_page` with exactly the same page and sections and the latest
   `previewId`. Every other page, the user's arrangement and their notes are kept.

A change touching two pages is two rounds of this, one page at a time, with their yes in between.

**A change to the whole report** — its name or date range, or removing a page entirely: change
the full spec from `get_report`, `preview_report` with it and the report's `accountId` and
`campaignIds`, stop for their yes, then `save_report` with the **reportId** and the full spec. Keep
every section's `key`.

**Switching to a template's design**: `preview_report` with the `templateId`, then on their yes
`save_report` with the reportId and the `templateId`.

If a save is refused, fix exactly what it names, provided the fix leaves what they agreed the same.
If it would not, tell them and let them decide.
Never work round a refusal — not by saving a template, not with another tool. If the tool it points
to is not in your list, the plugin is out of date: say so and offer to update it (the `setup` skill
does it).

**Talking to them:** say what happens, not how — no tool names, "spec" or "connection". When
something goes wrong: what happened, whether anything they approved is lost, and the one step you
recommend as a yes-or-no question. An answer that does not match what you offered: ask what they
meant instead of picking the nearest option.

## 5. Review

Give them the URL and every warning from the save, word for word, and start the
`report-reviewer` agent in the background with the reportId, what they approved and what they asked
to change. Say in one line that a link already sent to the client keeps the figures it was made
with, and that a new link from the report page shows the change. Pass on the reviewer's findings
briefly when they arrive; agreed fixes go through steps 3 and 4 again, with the same reportId.

If this change came from a queued task that is still open, `complete_task` once they are happy.
