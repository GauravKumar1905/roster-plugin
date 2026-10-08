---
name: report-design
description: How to design a Roster report spec — which metrics and charts a campaign supports, the chart rules the validator enforces, rolling date ranges and breakdowns. Load it before writing or changing any Roster report or template spec.
user-invocable: false
---

# Designing a Roster report

You are designing a report **once**. After it is saved, the dashboard fetches live numbers
against your design with no Claude in the loop. So the thing you produce is a *structure*, never
a set of numbers.

That changes what "good" means. A report shaped around today's data is the wrong output. Design
something that is still right in six weeks, on a month where spend tripled, or a week where one
campaign was paused.

More detail, read when it applies:

- [date-ranges.md](date-ranges.md) — every spec has a range; read it before writing one, and for
  any widget grouped by week or month
- [breakdowns.md](breakdowns.md) — gender, age, audience, creative type, and splitting
  conversions by action
- [example.md](example.md) — a complete spec for a video brand campaign

## What the campaign can report decides the shape

`get_catalog` with the campaign's id returns only what it can report, worked out from its type
and whether conversion data actually arrives, with the reason for everything left out. Design only
from that list — preview and save refuse anything else. The capabilities behind it:

- `[]` — no conversion data. Build a **reach and efficiency** report: spend, impressions,
  clicks, CTR, CPC, CPM, and video metrics where the campaign runs video. Do **not** include
  conversions, cpa, roas, aov or conversion_rate. They will render blank.
- `["conversion_tracking"]` — add conversions, CPA, conversion rate. Still no ROAS or AOV.
- `["conversion_tracking", "conversion_value"]` — the full e-commerce shape is available.

Brand and awareness campaigns frequently have no conversion tracking at all. That is normal, not
a misconfiguration to work around.

A widget that needs a capability declares it:

```json
{ "type": "kpi", "title": "ROAS", "slots": { "value": { "metric": "roas" } },
  "requires": ["conversion_value"] }
```

Declared widgets are **skipped** where the capability is missing, so the same design still works
elsewhere. This is what makes a template reusable across a whole client roster.

## Composing the report

A good report has 3–5 sections and reads top-down from summary to detail:

1. **Headline** — a `kpi_row` of the 3–5 numbers the client checks first.
2. **Trend** — a `line` chart over `date` (or `week` for ranges longer than ~60 days).
3. **Breakdown** — where the money went: `pie` or `bar` over a low-cardinality dimension.
4. **Detail** — a `table`. Agencies live in tables; make it substantial, 5–8 metric columns.

Give every widget a title a client would understand. "Spend by Campaign Type", not
"campaign_type × cost_micros". Never write a date into a title — see
[date-ranges.md](date-ranges.md).

## Tables bring their own chart

A table widget draws a chart of the same figures directly beneath it — a timeline gets a line, a
category gets a bar — from the table's own query, so it cannot drift from the numbers above it.

So **do not add a separate chart widget for data a table already shows**. Two widgets for one set
of numbers is two queries and two things to disagree. Set `pairedChart` to `none` only if the
table genuinely should stand alone. A pie is never paired: it divides a whole into parts, which
is meaningless for a ratio.

## Rules the validator enforces

Every id comes from `get_catalog`. Never invent one — call it rather than guessing a similar name.
Getting these right first time is faster than reading the error:

- **Pie and stacked-bar values must be additive** — spend, impressions, clicks, conversions,
  conversion_value. A pie of CPA or ROAS is rejected.
- **A line chart's x-axis must be `date`, `week` or `month`.** `day_of_week` is a cycle, not a
  timeline — use a bar chart for it.
- **Low-cardinality dimensions only** in pie categories and line series: `device`, `network`,
  `campaign_type`, `day_of_week`. `campaign_name` and `ad_group_name` belong in tables.
- **Sort by a metric the widget actually displays.**
- **`compareTo` only works on `kpi` and `kpi_row`.**

Unsure whether a metric has data for this campaign? `preview_metric` checks one cheaply before
you commit it to the design.

## Things you don't need to do

- **Ratios.** CTR, CPC, CPM, CPA, ROAS, conversion rate and AOV are computed after aggregation,
  correctly. Just name them.
- **Currency.** Spend comes back in the account's own currency, already scaled.
- **Slice caps and row limits.** Omit them and sensible defaults are filled in.
- **Number formatting.** Inferred from each metric unless you override it.

## When a preview or save is refused

The error names the exact path and the fix. Correct only what it names and try again — don't
redesign the whole report. If a fix would change what the user agreed to — dropping a widget they
asked for, swapping a metric, changing the range — do not make it quietly. Tell them the problem
and the smallest change you would suggest, and let them decide.
