---
name: setup
description: "Connect this assistant to your Roster account and finish Roster's onboarding. Use for \"set up Roster\", \"connect Roster\", or when the Roster dashboard says setup isn't finished."
---

# Set up Roster

The user has come from Roster's setup page, and the rest of the dashboard stays locked until this
records that setup finished. Get them connected and record completion. Nothing else: connecting
Google Ads or Meta Ads, adding clients and their reports are the dashboard's next steps, and every
report asked for in the dashboard comes with its own link.

**Keep it short.** Say what you are doing, do it, stop.

## 1. Connect

Call `check_setup`. It is here to confirm the connection works; do not report what it says about
clients, Google Ads, Meta Ads or reports waiting to be built, and do not call `list_clients`,
`list_reports` or `get_catalog`. Setup does not look at clients at all.

If the Roster tools are missing, or it fails with an authorization error, Roster is not signed in
yet. Codex signs in to Roster when the plugin is installed. If that was skipped or has expired, tell
them to sign in to Roster from Codex's plugin list (`/plugins`) — a browser opens; they approve
with their Roster login — then try again.

If two attempts fail, stop and say what the error was — setup cannot be recorded without a
connection, so the dashboard stays locked until this works.

## 2. Record completion

Call `complete_setup`. Always — on a re-run too. This is what unlocks the dashboard; skip it and
the user is stuck on the setup screen with no idea why.

If it fails, say so plainly and try once more. Do not tell them setup is finished until it has
succeeded.

## 3. Orientation — first run only

Only when `complete_setup` returned `firstTime: true`. Three lines at most. The first is exactly
this, word for word — it names the button the setup page is waiting on, and what comes after it:

> Setup is recorded. Go back to Roster and press **Done** — it asks what you'd like to do first.

Then these, and nothing beyond them:

- Next, in Roster: pick Google Ads report or Meta Ads report. It asks for the sign-in and the ad
  account, then gives you a message to paste here.
- You see the plan and the figures before anything is saved. You refresh a saved report in Roster
  whenever you want new figures, and each link you share keeps the figures you checked.

## Tone

Report what happened, not the mechanics. "You're connected, and setup is recorded." is the right
shape. Do not name tools or protocol detail unless something failed and the detail is what
fixes it.
