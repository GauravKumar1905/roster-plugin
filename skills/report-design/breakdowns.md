# Breakdowns that live on their own resource

`gender`, `age_range`, `audience` and `asset_type` each come from a different Google Ads
resource, and GAQL has no joins. **At most one of them per widget.** Gender crossed with age, or
gender crossed with creative type, is not a query that exists — you get a design-time error
naming both. Use one widget each.

They also depend on the campaign mix. Demographic and audience rows only exist where an ad-group
criterion does, so **Performance Max, Smart and Shopping campaigns contribute nothing** to them.
On a Performance-Max-heavy account a gender table returns rows that look perfectly reasonable and
account for a fraction of the spend — which the client will notice when they reconcile it against
their invoice.

`get_catalog` with the campaign's id sorts this out: breakdowns that would return nothing are left
out, and those that return real rows not adding up to the spend are marked `partial`. Use a
partial breakdown only with "partial" in the widget title — the preview refuses it otherwise —
and never total it.

# Splitting conversions into actions

`conversion_action` (the name in the account) and `conversion_category` (Google's own grouping —
Purchase, Add To Cart, Begin Checkout) turn one conversions number into the actions behind it.

Spend cannot appear beside them. Google refuses `cost_micros` alongside a conversion-action
segment outright, so a widget asking for both is rejected at design time. Build two widgets: one
for spend and delivery, one for conversions split by action.

# Keywords, search terms, ads, ad copy, videos and locations

Each of these comes from its own Google Ads report too, so the same rule holds: **one family per
widget** (`cannotCombineWith` in `get_catalog` names them). Each can sit beside `campaign_name`,
and all but locations beside `ad_group_name`.

| Family | Breakdowns | Where it works |
|---|---|---|
| Keywords | `keyword`, `match_type`, `quality_score` | Search |
| Search terms | `search_term`, `search_term_status`, `search_term_match_type` | Search, Shopping |
| Ads | `ad`, `ad_type` | Everything but Performance Max and Smart |
| Ad copy | `asset_text`, `asset_field`, `asset_performance` | Search and Display ads |
| Videos | `video` | Video, Demand Gen |
| Locations | `country`, `region`, `city`, `postal_code` | Everywhere — where people physically were |

They are high-cardinality: a **table sorted by spend or conversions, limited to 10–25 rows**, is
the usual shape. Typical asks:

- *Top keywords* — `keyword`, `match_type`, `quality_score` × spend, clicks, conversions, CPA,
  `search_impression_share`.
- *Search terms* — `search_term`, `search_term_status` × clicks, spend, conversions. The status
  shows which were added as keywords or excluded as negatives.
- *Ad copy* — `ad` × impressions, CTR, conversions; and `asset_text`, `asset_field`,
  `asset_performance` × impressions, CTR. Headlines are served in combination, so ad copy rows
  overlap: compare them, never total them.
- *Cost per lead by area* — `city` or `postal_code` × spend, conversions, CPA.
- *Where viewers are* — `region` × impressions, clicks, CTR, spend, sorted by impressions: the table
  draws its ranked bar beneath it.

Locations never add up to the campaign: Google can't place some impressions. Roster shows the gap
as an **Unattributed** row and a line under the widget, and a location table's Total is the
campaign's own, so it matches the headline numbers. Say so when you preview one — a client who
adds up the regions will otherwise find the gap themselves.

`search_impression_share` is reported by campaign, ad group or keyword only — never beside a
location, demographic, search term, ad or video.

# Comparing tables

`compareTo` works on tables as well as headline numbers. Every row is set against the same row in
the earlier window — Campaign A against Campaign A, an ad by its id — with the change beneath each
figure, and rows that did not exist before marked new. Use it for "this month vs last month by
campaign" or "keywords vs last year". A table whose rows are dates, weeks or months cannot compare;
its rows already show change over time.

# Targets

Targets — "120 conversions a month", "CPA under $40" — are not part of the spec. Set them with
`set_report_targets` on a saved report, using only numbers the user gave you. Each headline tile
then shows % of target and hit or missed. Volumes are stated per week, month or quarter and scaled
to the window the report shows; ratios are plain values. Make sure every metric with a target is on
a `kpi` or `kpi_row` — a target nobody can see is reported back as a warning.
