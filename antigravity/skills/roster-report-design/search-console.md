# Designing a Search Console report

Read this when `get_task` says `platform: "search_console"`, or the account id is a site —
`sc-domain:example.com` or `https://www.example.com/`. Everything in `SKILL.md` still holds where it
applies; these are the ways a site report differs. `get_catalog` with the report's `reportId` (or,
for a template, the property as `accountId`) lists only what Search Console reports, in its own
words, and the preview and save tools hold the design to it.

## A site, not campaigns

- **The whole site is the scope.** There are no campaigns: never pass `campaignIds` or a
  `campaignId`. The report is about one property, and a client has one report per property.
- **Organic search only.** No spend, cost, conversions or ads. A report on how the site does in
  Google's results: clicks, impressions, CTR and average position.
- **Dates are Pacific Time**, for every site, and Google needs two or three days to finish counting.
  A report ends on the last finished day (`dataThrough` in the brief), not yesterday. Say "through
  30 Oct" when you present figures, and never call the last days a fall.

## The four figures

| Metric | What it is |
| --- | --- |
| `clicks` | Clicks from Google's results to the site — organic, never paid |
| `impressions` | Times a link to the site appeared in results |
| `ctr` | Clicks ÷ impressions, from the summed counts — what Search Console shows |
| `avg_position` | The site's average position, **1 is the top and lower is better**; weighted by impressions, so it combines correctly |

- **Never sort by `avg_position`** — ranking is highest first, which would put the worst positions
  on top. Sort by clicks or impressions, and show position as a column.
- A fall in position is an improvement. Say so in words when you present a change ("up from 6.2 to
  4.8 on average").

## Two ways the figures don't add up

- **Queries add up to less than the site.** Google leaves rare queries out to protect searchers.
  A query table's total is the site's own, with a muted **Private queries** row and a line saying
  how much came from them. Mention it when you present one; never call the sum of queries the
  site's total.
- **Pages add up to more than the site.** A search showing two of the site's pages counts for each.
  A page widget never shows a total row (`options.showTotals` is refused) and is never a pie or a
  stacked bar. A table that opens queries to their pages shows each query's own total.

## Search types

Each widget reads web results unless it sets `searchType`: `image`, `video`, `news`, `discover` or
`googleNews`. Put the type in the title of any widget that is not web ("Image search: top pages").
Discover and Google News have no queries and no position.

## What Search Console reports together

- `search_appearance` (rich results, product snippets, videos …) stands alone or by date — never
  beside query, page, country or device. Show it only if `preview_metric` finds the site has any.
- Everything else combines: query × page, country × device, any of them by date.

## Pages that suit a site report

| Page | What it holds |
| --- | --- |
| `overview` | Clicks, impressions, CTR and average position with `compareTo` the period before; a daily trend of clicks (and impressions) |
| `queries` | Top queries by clicks (limit 10–25) with CTR and position; a query table that opens to the pages shown for each |
| `pages` | Top pages by clicks; a page table that opens to its queries |
| `countries_devices` | Countries; devices; country × device |
| `search_appearance` | Clicks and impressions by appearance, when the site has any |

Ad reports' pages — `ad_groups`, `creative`, `demographics`, `platform`, `geo_device` — don't exist
on a site report, and the tools refuse them.
