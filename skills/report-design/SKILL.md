---
name: report-design
description: How to design a Roster report spec — which metrics and charts a campaign supports, the chart rules the validator enforces, rolling date ranges and breakdowns. Load it before writing or changing any Roster report or template spec.
user-invocable: false
---

# Designing a Roster report

You are designing a report **once**, a page at a time. After it is saved, the dashboard fetches live numbers
against your design with no Claude in the loop. So the thing you produce is a *structure*, never
a set of numbers.

That changes what "good" means. A report shaped around today's data is the wrong output. Design
something that is still right in six weeks, on a month where spend tripled, or a week where one
campaign was paused.

More detail, read when it applies:

- [date-ranges.md](date-ranges.md) — every spec has a range; read it before writing one, and for
  any widget grouped by week or month
- [breakdowns.md](breakdowns.md) — gender, age, audience, creative type, splitting conversions
  by action; keywords, search terms, ads, ad copy, videos and locations; comparing tables; targets
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

A report is a set of **pages**, and you design and preview one page at a time — never the whole
report in one go. Each page is a few sections; a section's `segment` is the page it is on, and the
page tools set it for you.

The Overview page reads top-down from summary to detail:

1. **Headline** — a `kpi_row` of the 3–5 numbers the client checks first.
2. **Trend** — a `line` chart over `date` (or `week` for ranges longer than ~60 days).
3. **Breakdown** — where the money went: `pie` or `bar` over a low-cardinality dimension, or a
   `grouped_bar` to compare groups across one — ad group × age, network × device.
4. **Detail** — a `table`. Agencies live in tables; make it substantial, 5–8 metric columns.

The pages, and what each answers. The reader picks them from a menu, the report opens on
Overview, and a PDF starts each on a new sheet:

| `segment` | Answers | Typical sections |
| --- | --- | --- |
| `overview` | How is the campaign doing overall? | Headline numbers, trend, split by campaign |
| `ad_groups` | Which ad groups work best? | Ad group table, ad group × age grouped bar, keywords |
| `creative` | Which ads work best? | Ads, ad copy, videos |
| `demographics` | Who is watching? | Age, gender, audience |
| `platform` | Where did the ads run? | Network (YouTube, Display, Search), ad format, hour of day |
| `geo_device` | Where are viewers, and on what devices? | Regions, cities, devices |

Leave out a page the campaign has no data for (no Demographics on Performance Max). A short
report is Overview alone. A page holds 1–4 sections, and a section 1–4 widgets; past that, it is
two pages, or a table doing the work of several charts.

## Before you preview a page — every time

Run down this list. Each item is a refusal or a bad report that has actually happened:

1. **This page only.** Its own sections, nothing from other pages, nothing for "later".
2. **Every id is in `get_catalog`** for this campaign — metrics, dimensions, chart types. Not a
   similar name, not one from another campaign. Unsure whether a metric has data here?
   `preview_metric` first.
3. **Capabilities.** Conversions, CPA, ROAS, AOV and conversion rate only where the catalog's
   capabilities allow them, and a widget that needs one declares `requires`.
4. **Each widget's shape fits its chart** — the rules below: additive values in pies and stacked
   bars, a time axis on lines, small `series`, sort by a metric that is shown.
5. **No age × gender in one widget,** and no breakdown estimated from two others.
6. **A breakdown that doesn't cover everything says so in its title** ("partial").
7. **No chart that repeats a table's figures** — the table draws its own.
8. **Titles a client understands, with no dates or numbers in them.**
9. **Overview starts with the headline numbers** — a `kpi_row` — and every other page starts with
   the widget that answers its question.

Then preview. If it is refused, the next section says what to do.

Give every widget a title a client would understand. "Spend by Campaign Type", not
"campaign_type × cost_micros". Never write a date into a title — see
[date-ranges.md](date-ranges.md).

## Tables bring their own chart

A table widget draws a chart of the same figures directly beneath it — a timeline gets a line, a
category gets a bar — from the table's own query, so it cannot drift from the numbers above it.
A table grouped two ways gets one too when its second column is small: a timeline × device table
a line per device, an ad group × age or network × device table a grouped bar of its first metric.

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
- **`grouped_bar` takes a small `series`** (age, gender, device, network) inside a `category` that
  can be large (ad groups). Its `value` can be a rate — CTR, view rate — which a stacked bar can't
  show. Its `limit` counts groups (default 8, ranked by the metric, or by impressions when the
  metric is a rate) and every bar of a kept group is drawn.
- **`breakdown_picker`** shows ad groups against one breakdown at a time, picked by the reader:
  `category` the ad groups, `series` two to five small breakdowns (age, gender, device, network),
  `value` one metric. It opens as a shaded matrix or grouped bars and the reader can switch. Each
  breakdown is its own query, so it is the one widget that may offer age and gender together —
  as two choices, never combined. It is the natural heart of an `ad_groups` segment.
- **`options.expandable`** turns a table with two row dimensions into one row per group of the
  first (ad group, campaign, network) with its subtotal, opening to its breakdown by the second
  (age, gender, device, ad group). Subtotals add up counts and recompute rates; the limit counts
  groups. Neither dimension a date, and no `compareTo` yet. Where the breakdown doesn't cover the
  whole group — ages never cover every impression — a line under the table says how much it does.
- **Age and gender never go together.** Google does not report them in one breakdown, so a widget
  with both is refused. Put an age chart beside a gender chart, or ad group × age beside ad group ×
  gender — and never estimate the combination from the two splits: that invents figures.
- **Sort by a metric the widget actually displays.**
- **`compareTo` works on `kpi`, `kpi_row` and `table`** — not on a table whose rows are dates.

Unsure whether a metric has data for this campaign? `preview_metric` checks one cheaply before
you commit it to the design.

## Things you don't need to do

- **Ratios.** CTR, CPC, CPM, CPA, ROAS, conversion rate and AOV are computed after aggregation,
  correctly. Just name them.
- **Currency.** Spend comes back in the account's own currency, already scaled.
- **Slice caps and row limits.** Omit them and sensible defaults are filled in.
- **Number formatting.** Inferred from each metric unless you override it.

## When a preview or save is refused

The error names the exact path and the fix. Correct only what it names and preview again — don't
redesign the page, and never move on to the next page with this one unresolved. A refusal is
expected and cheap at the preview; it is the reason pages are previewed one at a time. If a fix would change what the user agreed to — dropping a widget they
asked for, swapping a metric, changing the range — do not make it quietly. Tell them the problem
and the smallest change you would suggest, and let them decide.
