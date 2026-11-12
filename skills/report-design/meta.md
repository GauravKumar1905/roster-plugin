# Designing a Meta Ads report

Read this when `get_task` says `platform: "meta"`, or the account id starts `act_`. Everything in
`SKILL.md` still holds; these are the ways Meta differs. `get_catalog` with a Meta Ads report's
`reportId` lists only what Meta reports for its campaigns, in Meta's words, and the preview and
save tools hold the design to it.

## Choose the conversion first

Meta has no single conversion. `get_catalog` with the report's `reportId` lists the account's
`conversionActions` — purchases, leads, registrations, a custom conversion — most frequent first
(a template is designed from `get_catalog` with `platform: "meta"`, and counts whichever action
each report has). Before designing anything with conversions in it, ask the user which one this
report counts, by label, or none. Set its `actionType` with `set_report_conversion_action` and the
`reportId`, then call `get_catalog` again: every catalog, preview and save then counts it.

- Then name the action in titles: "Purchases", "Cost per lead" — not "Conversions".
- No action chosen, or none recorded: the report has no conversions, CPA or ROAS. That is a fine
  reach-and-engagement report, not a problem to work round.
- Changing it later is the same call, which redraws a saved report.

## Meta's structure and words

- **Campaign → ad set → ad.** An ad set is Meta's ad group: `ad_set_name` where a Google Ads report
  has `ad_group_name`. The `ad_groups` page is called **Ad sets** on a Meta Ads report.
- **Clicks are link clicks** — clicks to the ad's destination, not Meta's "Clicks (all)". CTR and
  CPC are built on them. Title them "Link clicks" and "Link CTR".
- **Video:** `video_plays_3s` is Meta's 3-second play (what Ads Manager calls a video view) —
  never compare it with Google's video views. `thruplays` (to the end, or 15 seconds) is what
  Meta's video campaigns optimise for; `thruplay_rate`, `cost_per_thruplay` and
  `video_completion_rate` (VCR) are built on Meta's own counts.
- **Where it ran:** `publisher_platform` is the app (Facebook, Instagram, Messenger, Audience
  Network, Threads); `placement` is the spot in it (Instagram Reels, Facebook Feed …); `device` is
  what people saw it on.
- **Reach** is Meta's own deduplicated count for each row it returns — the whole window, a month,
  a campaign, an age band. A table's total across days or campaigns is left blank rather than
  counting people twice.

## What Meta reports together

Meta combines breakdowns only within these families:

| Family | Dimensions |
| --- | --- |
| Demographics | `age_range`, `gender` |
| Location | `country`, `region` |
| Placement | `publisher_platform`, `placement`, `device` |
| Time of day | `hour` |

One family per widget, beside dates, campaigns, ad sets or ads — never two families (no age ×
placement, no country × device). `cannotCombineWith` in the catalog lists them.

- **Age × gender works on Meta.** A `grouped_bar` of age split by gender, or a table of both, is
  real data — the opposite of Google.
- **No reach or frequency by hour.**
- **No website conversions or landing page views by region or by hour** — Meta leaves them out of
  those breakdowns. Keep region and hour for delivery: spend, impressions, link clicks, reach,
  video.
- A `breakdown_picker` may offer breakdowns from different families — age, gender, platform,
  device — because each is its own query. Its series take small breakdowns only: `placement` has
  too many values; use `publisher_platform`.

## Pages that suit Meta Ads

| Page | On a Meta Ads report |
| --- | --- |
| `overview` | Spend, reach, frequency, link clicks, link CTR, CPM (and the chosen conversion with its cost); a trend; a campaign split |
| `ad_groups` (Ad sets) | Ad set table; ad set × age; a picker of ad sets against age, gender, platform, device |
| `creative` | Ads, with ThruPlays and engagement where they ran video |
| `demographics` | Age × gender grouped bar; age and gender tables |
| `platform` | Platform, placement (with device), hour of day |
| `geo_device` | Countries and regions; devices |
