---
name: setup
description: "Connect this assistant to your Roster account and finish Roster's onboarding. Use for \"set up Roster\", \"connect Roster\", or when the Roster dashboard says setup isn't finished."
---

# Set up Roster

The user has come from the Roster dashboard, which stays on its setup screen until this records
that it finished. Get them connected and record completion. Nothing else: clients, their Google
Ads and their reports are the dashboard's next steps.

**Keep it short.** Say what you are doing, do it, stop.

## 1. Connect

Call `check_setup`. It is here to confirm the connection works; do not report what it says about
clients, Google Ads or queued reports.

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

Only when `complete_setup` returned `firstTime: true`. Four lines at most:

- Back in the dashboard, press **Done** — it opens now.
- Next, the dashboard walks you through adding a client, connecting its Google Ads and picking
  its accounts. That part happens there, not here.
- A report starts as a task in the dashboard: choose one campaign, say what you need, copy the
  request and paste it here.
- You see the figures before anything is saved, and each link you send keeps the figures you
  checked.

## Tone

Report what happened, not the mechanics. "You're connected, and the dashboard is open." is the
right shape. Do not name tools or protocol detail unless something failed and the detail is what
fixes it.
