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

Follow this order. Skipping the inspection step is the most common way to produce a report
full of empty charts.

1. **`list_accounts`** — find the account. Pass `search` with part of the client's name.
2. **`describe_account`** — read what this account actually is. Look hard at `capabilities`.
3. **`get_catalog`** — the only vocabulary you may use. Never invent ids.
4. **`preview_metric`** — check anything you're unsure about *before* committing it.
5. **`save_report_template`** — with `applyToAccountId` so it renders immediately and returns a URL.
6. Give the user the URL.

## The rule that matters most

**`capabilities` from `describe_account` decides the whole shape of the report.**

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

`describe_account` returns `breakdownCoverage` saying exactly which breakdowns that account's mix
can account for, and what share of spend each covers. **Read it before designing.** If a breakdown
covers 20% of spend, either leave it out or say so in the widget title.

## Splitting conversions into actions

`conversion_action` (the name in the account) and `conversion_category` (Google's own grouping —
Purchase, Add To Cart, Begin Checkout) turn one conversions number into the actions behind it.

Spend cannot appear beside them. Google refuses `cost_micros` alongside a conversion-action
segment outright, so a widget asking for both is rejected at design time. Build two widgets: one
for spend and delivery, one for conversions split by action.

## Editing an existing report

Always check `list_report_templates` first when someone asks to change a report. Then
`get_report_template`, modify the spec, and save it back **with the same `templateId`**.
Saving without it creates a duplicate.

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
