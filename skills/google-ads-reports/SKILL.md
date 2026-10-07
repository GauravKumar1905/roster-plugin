---
name: google-ads-reports
description: Design reusable Google Ads report templates that live on a dashboard and refresh themselves. Use when someone asks for a Google Ads report, a client performance report, a campaign dashboard, or wants to change a report that already exists.
---

# Designing Google Ads reports

You are designing a report **once**. After you save it, a dashboard fetches live numbers
against your design forever — with no Claude in the loop. So the thing you produce is a
*structure*, never a set of numbers.

That changes what "good" means here. A report you'd write once for today's data is the wrong
output. Design something that will still be right in six weeks, on a month where spend
tripled, or a week where one campaign was paused.

## Show it before you save it

A saved report is what an agency sends their client. So the order is: propose in words, preview
with real figures, ask, then save.

`preview_report` renders a draft against the real account and stores nothing. Use it every time,
for new reports and for edits. Show the tables it returns and ask whether the sections, metrics
and breakdowns are right. Previewing costs a few seconds; a wrong report in a client's inbox
costs more.

Do not describe the report you are about to build and then build it in the same breath. Stop and
let them answer.

## Tables bring their own chart

A table widget draws a chart of the same figures directly beneath it — a timeline gets a line, a
category gets a bar. It comes from the table's own query, so it cannot drift out of step with the
numbers above it.

This means **do not add a separate chart widget for data a table already shows**. Two widgets for
one set of numbers is two queries and two things to disagree. Set `pairedChart` to `none` only if
the table genuinely should stand alone.

A pie is never paired, deliberately. A pie divides a whole into parts, which is meaningless for a
ratio — and these tables are mostly ratios beside totals.

## The workflow

Every report starts as a task queued in the dashboard: one campaign, and the user's instruction.
The user pastes it here, or picks it from `list_tasks` for one client.

1. **`get_task`** with the taskId — the whole brief in one call. Read `campaign`, `canReport`,
   `existingReports` and `savedTemplates`. Do not call other tools to rediscover any of it.
2. **Ask what report they want** — see *From brief to options* below.
3. **`get_catalog`** — chart rules and slot constraints. Never invent ids.
4. **`preview_metric`** — check anything you're unsure about *before* committing it.
5. **`preview_report`** with `ids.accountId` and `ids.campaignIds` — show real figures, iterate
   until the user agrees on the structure.
6. **The `report-builder` agent builds it** from the agreed spec and the `ids`. Its
   `save_report_template` renders the report and checks the real figures before anything is
   written; a widget that fails or comes back empty stops the save until it is fixed.
7. **Review at the same time:** give the user the URL, and run the `report-reviewer` agent in the
   background with the reportId and the agreed spec. Agreed fixes go back to `report-builder`
   with the reportId.
8. **`complete_task`** with `ids.taskId` and the reportId, once the user is happy.

**One task, one report.** A follow-up in the same conversation — another section, a new
breakdown, even after the task is complete — changes that report: preview the full updated spec,
then `report-builder` saves it with the same `reportId`. Saving it with `applyToAccountId` is
refused when those campaigns already have a report, because the client would be left holding
several links, each frozen at a different stage.

## From brief to options

The instruction in a task is a starting point, written in a hurry on a dashboard — "monthly
report for this campaign". Turn it into a choice before designing anything:

- Say what the campaign is in two lines: type, status, last-30-day spend and delivery.
- Offer two or three reports that suit **this campaign type**, built only from `canReport`. A
  video campaign is about reach and views; a search campaign about clicks, cost and, where it
  converts, conversions; Performance Max about outcomes, because its breakdowns are thin.
- Lead with a `savedTemplates` entry where `fits` is true — it is the agency's house format.
- Mention `existingReports` first if there are any. They may want a change, not a new report.
- Then stop and wait. One question, short options, no preamble.

## The rule that matters most

**What the campaign can report on decides the whole shape of the report.** `get_task` works it
out for you as `canReport`, from whether conversion data actually arrives for this campaign. The
capabilities behind it:

- `[]` — no conversion data. Build a **reach and efficiency** report: spend, impressions,
  clicks, CTR, CPC, CPM, and video metrics if the account runs video. Do **not** include
  conversions, cpa, roas, aov or conversion_rate. They will render blank.
- `["conversion_tracking"]` — add conversions, CPA, conversion rate. Still no ROAS or AOV.
- `["conversion_tracking", "conversion_value"]` — the full e-commerce shape is available.

Brand and awareness accounts frequently have no conversion tracking at all. That is normal,
not a misconfiguration to work around.

If you include a widget that needs a capability, declare it:

```json
{ "type": "kpi", "title": "ROAS", "slots": { "value": { "metric": "roas" } },
  "requires": ["conversion_value"] }
```

Declared widgets are **skipped** on accounts that lack the capability, so the same template
still works elsewhere. This is what makes a template reusable across a whole client roster.

## Composing the report

A good report has 3–5 sections and reads top-down from summary to detail:

1. **Headline** — a `kpi_row` of the 3–5 numbers the client checks first.
2. **Trend** — a `line` chart over `date` (or `week` for ranges longer than ~60 days).
3. **Breakdown** — where the money went: `pie` or `bar` over a low-cardinality dimension.
4. **Detail** — a `table`. Agencies live in tables; make it substantial, 5–8 metric columns.

Give every widget a title a client would understand. "Spend by Campaign Type", not
"campaign_type × cost_micros".

## Rules the validator enforces

You'll get a specific error if you break these, but getting them right first time is faster:

- **Pie and stacked-bar values must be additive** — spend, impressions, clicks, conversions,
  conversion_value. A pie of CPA or ROAS is meaningless and will be rejected.
- **A line chart's x-axis must be `date`, `week` or `month`.** `day_of_week` is a cycle, not a
  timeline — use a bar chart for it.
- **Low-cardinality dimensions only** in pie categories and line series: `device`, `network`,
  `campaign_type`, `day_of_week`. `campaign_name` and `ad_group_name` belong in tables.
- **Sort by a metric the widget actually displays.**
- **`compareTo` only works on `kpi` and `kpi_row`.**

## Things you don't need to do

These are handled for you — doing them manually is wasted effort:

- **Ratios.** CTR, CPC, CPM, CPA, ROAS, conversion rate and AOV are computed after
  aggregation, correctly. Just name them.
- **Currency.** Spend comes back in the account's own currency, already scaled from micros.
- **Slice caps and row limits.** Omit them and sensible defaults get filled in.
- **Number formatting.** Inferred from each metric unless you override it.

## Date ranges roll — write them that way

A report is designed once and rendered for years. No date is ever stored; the range is resolved
against today every time the report refreshes.

Write a range as an object:

```json
{ "unit": "month", "count": 3 }               // the last 3 complete months
{ "unit": "month", "count": 1 }               // last month
{ "unit": "month", "count": 3, "includeCurrent": true }   // this month and the 2 before it
{ "unit": "day", "count": 30 }                // the last 30 days, ending yesterday
```

`unit` is `day`, `week`, `month`, `quarter` or `year`. Ceilings: day 90, week 26, month 6,
quarter 2, year 1. Leave `includeCurrent` off unless the client wants the period in progress —
it makes the newest bucket a partial one.

**Grouping by month or week needs a matching range.** A table grouped by `month` over
`{"unit":"day","count":90}` shows four rows, the first and last covering part-months, which reads
as a collapse in performance that never happened. Use `{"unit":"month","count":3}`. Roster will
correct this for you and tell you it did, but get it right in the spec.

**Never write a date into a title.** "July–September Performance" is wrong by October. Titles
take placeholders, resolved against the window the widget actually queried:

| Placeholder | Renders as |
|---|---|
| `{{month}}` | September 2026 |
| `{{window}}` | 13 Aug – 11 Sep |
| `{{period}}` | Last 3 complete months |
| `{{year}}` | 2026 |

So `"title": "{{month}} Performance"` stays correct forever.

The older string ranges (`last_30_days`, `this_month`, …) still work and existing reports use
them, but they cannot express whole calendar periods. Prefer the object.

## Breakdowns that live on their own resource

`gender`, `age_range`, `audience` and `asset_type` each come from a different Google Ads
resource, and GAQL has no joins. **At most one of them per widget.** Gender crossed with age, or
gender crossed with creative type, is not a query that exists — you get a design-time error
naming both. Use one widget each.

They also depend on the account's campaign mix. Demographic and audience rows only exist where an
ad-group criterion does, so **Performance Max, Smart and Shopping campaigns contribute nothing**
to them. On a Performance-Max-heavy account a gender table returns rows that look perfectly
reasonable and account for a fraction of the spend — which the client will notice when they
reconcile it against their invoice.

`get_task` sorts this out for the task's campaign: `canReport.breakdowns` cover its whole spend,
and `canReport.partialBreakdowns` return real rows that do not add up to it. **Read it before
designing.** Use a partial breakdown only with a widget title that says so, and never total it.

## Splitting conversions into actions

`conversion_action` (the name in the account) and `conversion_category` (Google's own grouping —
Purchase, Add To Cart, Begin Checkout) turn one conversions number into the actions behind it.

Spend cannot appear beside them. Google refuses `cost_micros` alongside a conversion-action
segment outright, so a widget asking for both is rejected at design time. Build two widgets: one
for spend and delivery, one for conversions split by action.

## Editing an existing report

A report and a template are different things. Each report owns its own design; a template is a
design someone chose to reuse, and applying one gives the new report its own copy.

To change a report: `list_reports` for the client, `get_report` for its spec and figures, modify
the spec, and save it back with `save_report_template` and **the same `reportId`**. Passing
`applyToAccountId` instead creates a duplicate.

To change a template: `list_report_templates`, `get_report_template`, then `save_report_template`
with `saveAsTemplate` and the same `templateId`. Reports already made from it do not change.

## A worked example

For a video brand account with no conversion tracking:

```json
{
  "name": "Monthly Brand Performance",
  "description": "Reach and efficiency for video brand campaigns.",
  "dateRange": { "unit": "month", "count": 1 },
  "sections": [
    { "title": "Headline", "widgets": [
      { "type": "kpi_row", "title": "Key Numbers",
        "slots": { "values": [ {"metric":"spend"}, {"metric":"impressions"},
                               {"metric":"clicks"}, {"metric":"ctr"} ] },
        "compareTo": "previous_period" } ] },
    { "title": "Delivery Over Time", "widgets": [
      { "type": "line", "title": "Spend by Day",
        "slots": { "x": {"dimension":"date"}, "y": [ {"metric":"spend"} ] } } ] },
    { "title": "Where It Went", "widgets": [
      { "type": "pie", "title": "Spend by Campaign Type",
        "slots": { "category": {"dimension":"campaign_type"}, "value": {"metric":"spend"} } },
      { "type": "bar", "title": "CPM by Device",
        "slots": { "category": {"dimension":"device"}, "value": [ {"metric":"cpm"} ] } } ] },
    { "title": "Campaign Detail", "widgets": [
      { "type": "table", "title": "All Campaigns",
        "slots": { "rows": [ {"dimension":"campaign_name"} ],
                   "values": [ {"metric":"spend"}, {"metric":"impressions"},
                               {"metric":"clicks"}, {"metric":"ctr"}, {"metric":"cpm"} ] },
        "sort": { "metric": "spend", "dir": "desc" } } ] }
  ]
}
```

## When a save fails

The error names the exact path and the fix. Correct only what it names and call again — don't
redesign the whole report. If a metric is rejected as unknown, call `get_catalog` rather than
guessing a similar name.
