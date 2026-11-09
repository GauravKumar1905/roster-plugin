# Designing a Google Analytics report

Read this when `get_task` says `platform: "analytics"`, or the account id is a GA4 property —
`properties/123456789`. Everything in `SKILL.md` still holds where it applies; these are the ways a
website report differs. `get_catalog` with the report's `reportId` (or, for a template, the property
as `accountId`) lists only what GA4 reports, in its own words, and the preview and save tools hold
the design to it.

## A website, not campaigns

- **The whole property is the scope.** There are no Roster campaigns: never pass `campaignIds` or a
  `campaignId`. `ga_campaign` is a dimension — the UTM campaign a visit arrived from — not a scope.
- **Visits from every source.** No spend and no ads. A report on how the client's website is
  visited: sessions, users, engagement, and what visitors did.
- **Dates are the property's own time zone**, and a report ends yesterday. Say the zone once when
  it is not the agency's.

## Users never add up

`users` and `new_users` are people. Someone who came on two days, or from two channels, is one
user, so a split by day, channel or country counts more users than the site had.

- A widget's **total** is Google's own de-duplicated count, never the sum of its rows. Never add
  rows up yourself, and never present a sum of users.
- Users are **never a pie or a stacked bar** — the tools refuse it.
- **Weekly and monthly** users are Google's count for each week or month, not a sum of days.

## Pages and events overlap

A session that saw three pages counts once for each, so a split by `page_path`, `page_title` or
`event_name` adds up sessions and users to more than the site. Such widgets never show a total row
(`options.showTotals` is refused) and are never a pie or stacked bar. `page_views` and
`event_count` do add up by page and by event — use those for page and event tables.

## Rows Google withholds

Where Google signals are on, Google leaves out rows with few users to protect them. Roster keeps the
site's own total and adds a muted line naming the sessions a breakdown left out. Mention it when you
present one; never call the sum of rows the site's total.

## The figures

| Metric | What it is |
| --- | --- |
| `sessions` | Visits. Add up across days, channels, landing pages, countries and devices |
| `users`, `new_users` | People — never summed across rows |
| `engagement_rate`, `bounce_rate` | Engaged (or not engaged) sessions as a share of sessions; GA4's definitions |
| `avg_engagement_time` | Average seconds of engagement per session |
| `page_views`, `views_per_session` | Pages viewed, and per session |
| `key_events`, `key_events_per_session` | What the property marks as key events (GA4's conversions) |
| `revenue`, `transactions`, `revenue_per_transaction` | Purchases — only where the property records them |

Rates are computed from counts after aggregation; never build them yourself.

## Key events

`key_events` counts **every** key event the property marks, together. The brief lists them
(`keyEvents`, most first). Only when the agency's note asks for one — "form submissions", "booked
calls" — use that event's `eventName` as `conversionAction` in `get_catalog`,
`preview_report_page` and `save_report_page`, and name it in the titles ("Form submissions by
channel"). Otherwise ask nothing about it. A property with no key events has no key event widgets
and no `key_events` page; say so in one line.

## E-commerce

Revenue, transactions and average order value exist only where the property recorded purchases in
the last 28 days; `get_catalog` leaves them out otherwise. Never promise them before the catalog
offers them.

## Pages that suit a website report

| Page | What it holds |
| --- | --- |
| `overview` | Sessions, users, engagement rate, key events (and revenue where there is any) with `compareTo` the period before; a trend of sessions or users |
| `acquisition` | Channels (`channel_group`) with sessions, users, engagement rate and key events; source / medium; UTM campaigns. A channel table can open to its source / medium |
| `pages` | Landing pages by sessions and engagement; pages viewed by `page_views` (limit 10–25) |
| `audience` | Countries, devices, new vs returning |
| `key_events` | Key events by event name, by channel and over time — only where the property records any |

Ad reports' pages — `ad_groups`, `creative`, `demographics`, `platform`, `geo_device` — don't exist
on a website report, and the tools refuse them.
