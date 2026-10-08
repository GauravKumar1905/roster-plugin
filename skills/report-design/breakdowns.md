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

`get_task` sorts this out for the task's campaign: `canReport.breakdowns` cover its whole spend,
and `canReport.partialBreakdowns` return real rows that do not add up to it. Use a partial
breakdown only with a widget title that says so, and never total it.

# Splitting conversions into actions

`conversion_action` (the name in the account) and `conversion_category` (Google's own grouping —
Purchase, Add To Cart, Begin Checkout) turn one conversions number into the actions behind it.

Spend cannot appear beside them. Google refuses `cost_micros` alongside a conversion-action
segment outright, so a widget asking for both is rejected at design time. Build two widgets: one
for spend and delivery, one for conversions split by action.
