# Date ranges roll — write them that way

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
quarter 2, year 1. Leave `includeCurrent` off unless the client wants the period in progress — it
makes the newest bucket a partial one.

**Grouping by month or week needs a matching range.** A table grouped by `month` over
`{"unit":"day","count":90}` shows four rows, the first and last covering part-months, which reads
as a collapse in performance that never happened. Use `{"unit":"month","count":3}`. Roster will
correct this for you and say it did, but get it right in the spec.

## Never write a date into a title

"July–September Performance" is wrong by October. Titles take placeholders, resolved against the
window the widget actually queried:

| Placeholder | Renders as |
|---|---|
| `{{month}}` | September 2026 |
| `{{window}}` | 13 Aug – 11 Sep |
| `{{period}}` | Last 3 complete months |
| `{{year}}` | 2026 |

So `"title": "{{month}} Performance"` stays correct forever.

The older string ranges (`last_30_days`, `this_month`, …) still work and existing reports use
them, but they cannot express whole calendar periods. Prefer the object.
