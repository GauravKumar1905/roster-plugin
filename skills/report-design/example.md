# A worked example

For a video brand campaign with no conversion tracking (`canReport` capabilities `[]`):

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
      { "type": "pie", "title": "Spend by Device",
        "slots": { "category": {"dimension":"device"}, "value": {"metric":"spend"} } },
      { "type": "bar", "title": "CPM by Network",
        "slots": { "category": {"dimension":"network"}, "value": [ {"metric":"cpm"} ] } } ] },
    { "title": "Detail", "widgets": [
      { "type": "table", "title": "{{month}} by Day of Week",
        "slots": { "rows": [ {"dimension":"day_of_week"} ],
                   "values": [ {"metric":"spend"}, {"metric":"impressions"},
                               {"metric":"clicks"}, {"metric":"ctr"}, {"metric":"cpm"} ] },
        "sort": { "metric": "spend", "dir": "desc" } } ] }
  ]
}
```

Why it is shaped this way:

- No conversion metrics anywhere — the campaign has no conversion data, so they would be blank.
- The pie holds spend, which is additive; the CPM comparison is a bar, because a ratio cannot be
  divided into slices.
- The table draws its own bar chart beneath it, so there is no separate chart of the same figures.
- The range is one whole month and the title uses `{{month}}`, so it is still right next month.
