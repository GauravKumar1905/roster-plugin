#!/usr/bin/env node
// Builds the Codex and Antigravity packages from the Claude plugin at the root of this repo.
//
//   node scripts/build-packages.mjs           # write codex/, antigravity/ and the Codex marketplace
//   node scripts/build-packages.mjs --check   # fail if what is committed is not what this builds
//
// The root is the Claude plugin and the only copy anyone edits. The other two are generated,
// because the same skills written three times drift within a week — and committed, because Codex
// and Antigravity install straight from this repository, with no build step of their own.
//
// What changes on the way out, and why:
// - The plugin-version block goes. Only Claude's requests carry a version, and the server gives the
//   `pluginVersion` argument to Claude alone; another assistant passing it would be refused.
// - The plugin's update step and Claude's background agent are rewritten. The reviewer agent
//   becomes a skill: Codex does not load agents from a plugin, and Antigravity rejects a plugin's
//   agents when they are called (agy issue #551).
// - The dashboard's buttons and statuses that name Claude (Copy for Claude, Change with Claude,
//   Waiting for Claude, Claude is building it) are described rather than quoted. The server still
//   quotes them to every assistant where it matters — get_task's errors, list_reports' `status`.
// - Setup is written fresh per assistant. Claude's builds a local folder (its CLAUDE.md, copies of
//   the skills, the read-only allow-list in .claude/settings.json) and runs `claude plugin`
//   commands; elsewhere, connecting is the whole of setup.
// - Antigravity's skill names are prefixed `roster-`, since a plugin's skills there sit beside every
//   other plugin's as slash commands. Codex namespaces them by plugin already. Only a name used as
//   a skill is renamed — "the `report` skill", "`report-design`'s" — never `report` the argument.
//
// Every rewrite must match exactly once, and the output is scanned for Claude-only words, so an
// edit to a Claude skill that would leak into the others fails the build instead of shipping.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CHECK = process.argv.includes("--check");

const claudeManifest = readJson(".claude-plugin/plugin.json");
const VERSION = claudeManifest.version;
const MCP_URL = readJson(".mcp.json").mcpServers.roster.url;
const DESCRIPTION = claudeManifest.description;
const SITE = "https://useroster.xyz";
const REPO = "https://github.com/GauravKumar1905/roster-plugin";

/** The skills every package carries, in the order they are listed. */
const SKILLS = ["report", "edit-report", "template", "report-design"];

const TARGETS = {
  codex: { dir: "codex", prefix: "", assistant: "Codex" },
  antigravity: { dir: "antigravity", prefix: "roster-", assistant: "Antigravity" },
};

// ── Text rewrites ─────────────────────────────────────────────────────────────────────────────────

/** A phrase that may wrap across lines in the source: each space matches any run of whitespace. */
function phrase(text) {
  return new RegExp(text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&").replace(/ /g, "\\s+"), "g");
}

/** [file, from, to]: each must match exactly once in that file. */
const REWRITES = [
  // The report skill: the request's button, the statuses it is offered by, the plugin's update
  // step, and the reviewer agent.
  [
    "skills/report/SKILL.md",
    phrase("and presses **Copy for Claude**. That makes the report — its link exists before it has a design — and copies a message like this:"),
    "and presses the button that copies the\nrequest. That makes the report — its link exists before it has a design — and copies a message\nlike this:",
  ],
  [
    "skills/report/SKILL.md",
    phrase(
      "Offer the reports Roster shows as **Waiting for Claude** or **Claude is building it**, and ask which to start. Do not start one on your own initiative.",
    ),
    "Offer the reports\nwhose `status` says they are waiting or being built, and ask which to start. Do not start one on\nyour own initiative.",
  ],
  [
    "skills/report/SKILL.md",
    phrase("press Copy for Claude and paste the message here."),
    "copy the message Roster gives them and paste\nit here.",
  ],
  [
    "skills/report/SKILL.md",
    phrase(
      "Roster shows the report as **Claude is building it · 1 of 3 pages**, and it can't be shared. If they add or drop a page partway, `set_report_pages` with the new list;",
    ),
    "Roster shows the report as still being built —\n**1 of 3 pages** — and it can't be shared. If they add or drop a page partway, `set_report_pages`\nwith the new list;",
  ],
  [
    "skills/report/SKILL.md",
    phrase("the plugin is out of date: say so and offer to update it (the `setup` skill does it)."),
    "Roster's tools here are out of date: say so, and tell\n  them to update the Roster plugin.",
  ],
  [
    "skills/report/SKILL.md",
    phrase(
      "and in the same turn start the `report-reviewer` agent in the background with the reportId, the pages they approved and their note. They look at the report while the reviewer does. When the reviewer's findings arrive, pass them on briefly. A fix they agree to goes through the same loop as building: preview",
    ),
    "then review it with the `review-report` skill — the reportId, the pages they approved\nand their note. They look at the report while you do.\n\nPass your findings on briefly. A fix they agree to goes through the same loop as building:\npreview",
  ],
  [
    "skills/report/SKILL.md",
    phrase(
      "**Use the dashboard's words:** Waiting for Claude, Claude is building it, Ready to share, Share with client, Refresh figures. Never \"task\", \"queue\"",
    ),
    "**Use the dashboard's words:** Ready to share, Share with client, Refresh figures. Never \"task\",\n  \"queue\"",
  ],

  // The edit-report skill: the same, for the report page's change button.
  [
    "skills/edit-report/SKILL.md",
    phrase("The report page's **Change with Claude** copies a message like this:"),
    "The report's page in Roster has a button that copies a message like this:",
  ],
  [
    "skills/edit-report/SKILL.md",
    phrase(
      "If Roster shows it as **Waiting for Claude** or **Claude is building it** (no spec yet, or `beingBuilt`), it isn't finished, and finishing it is the `report` skill's:",
    ),
    "If Roster shows it as waiting or still being built (no spec yet, or `beingBuilt`), it isn't\nfinished, and finishing it is the `report` skill's:",
  ],
  [
    "skills/edit-report/SKILL.md",
    phrase("the plugin is out of date: say so and offer to update it (the `setup` skill does it)."),
    "Roster's tools here are out of date: say so, and\ntell them to update the Roster plugin.",
  ],
  [
    "skills/edit-report/SKILL.md",
    phrase(
      "Then start the `report-reviewer` agent in the background with the reportId, what they approved and what they asked to change. Pass on the reviewer's findings briefly when they arrive; agreed",
    ),
    "Then review it with the `review-report` skill — the\nreportId, what they approved and what they asked to change. Pass on your findings\nbriefly; agreed",
  ],

  ["skills/report-design/SKILL.md", phrase("with no Claude in the loop"), "with no assistant in the loop"],
];

/**
 * Words that mean a Claude-only instruction slipped through: Claude by name (the dashboard's
 * Claude-named buttons included), the plugin-version machinery, the background agent, Claude's tool
 * names, and the Roster folder setup builds — its version stamp, its allow-list, the plugin cache.
 */
const FORBIDDEN = [
  /claude/i,
  /CLAUDE\.md/,
  /pluginVersion/,
  /ROSTER PLUGIN/,
  /report-reviewer/,
  /mcp__/,
  /\/roster:/,
  /in the background/i,
  /settings\.json/,
  /permissions\.allow/,
  /Roster folder/i,
  /\.roster\//,
  /installed_plugins/,
  /reload-plugins/,
];

function stripVersionBlock(text, file) {
  const block = /^Plugin version: [^\n]*\n\n(?:[^\n]+\n)+\n/m;
  if (!block.test(text)) fail(`${file}: no plugin-version block to remove`);
  return text.replace(block, "");
}

/** Keeps only the frontmatter every host reads — name and description — under the target's name. */
function frontmatter(text, file, name, description) {
  const match = text.match(/^---\n([\s\S]*?)\n---\n/);
  if (!match) fail(`${file}: no frontmatter`);
  const raw = description ?? match[1].match(/^description: (.*)$/m)?.[1];
  if (!raw) fail(`${file}: no description`);
  // Always quoted: a plain YAML scalar breaks on ": " or a leading quote, and a host that parses
  // strictly drops the skill without a word. A JSON string is a valid double-quoted YAML scalar.
  const desc = /^".*"$/.test(raw) ? raw : JSON.stringify(raw);
  return `---\nname: ${name}\ndescription: ${desc}\n---\n` + text.slice(match[0].length);
}

/**
 * A skill named as one — "the `report` skill", "`report-design`'s checklist" — takes the prefix.
 * The same word as anything else stays: `get_task` with `report` = the link is an argument.
 */
function renameSkillRefs(text, prefix) {
  if (!prefix) return text;
  const names = [...SKILLS, "setup", "review-report"].sort((a, b) => b.length - a.length);
  return text.replace(new RegExp("`(" + names.join("|") + ")`(?=\\s+skill|'s)", "g"), (_, n) => "`" + prefix + n + "`");
}

// ── Skills ────────────────────────────────────────────────────────────────────────────────────────

function sourceSkills() {
  const out = new Map(); // relative path in package → text
  for (const skill of SKILLS) {
    for (const file of fs.readdirSync(path.join(ROOT, "skills", skill))) {
      const rel = `skills/${skill}/${file}`;
      let text = read(rel);
      if (file === "SKILL.md" && /^Plugin version: /m.test(text)) text = stripVersionBlock(text, rel);
      out.set(rel, text);
    }
  }
  for (const [file, pattern, replacement] of REWRITES) {
    const text = out.get(file);
    const hits = text.match(pattern)?.length ?? 0;
    if (hits !== 1) fail(`${file}: expected one match for ${pattern}, found ${hits}. Update REWRITES.`);
    out.set(file, text.replace(pattern, replacement));
  }

  // The reviewer agent, as a skill the conversation runs itself.
  const reviewer = stripVersionBlock(read("agents/report-reviewer.md"), "agents/report-reviewer.md")
    .replace(/^---\n[\s\S]*?\n---\n\s*/, "");
  out.set(
    "skills/review-report/SKILL.md",
    `---\nname: review-report\ndescription: ${REVIEW_DESCRIPTION}\n---\n\n# Review a saved report\n\n${reviewer}`,
  );
  return out;
}

const REVIEW_DESCRIPTION =
  "Review a Roster report that was just saved, before it goes to the client: is it what was agreed, does it answer the note the agency wrote for it, are the figures believable. Use straight after the last page of a report is saved, or when the user asks you to check a report. Read-only; it changes nothing.";

const SETUP_DESCRIPTION =
  "Connect this assistant to your Roster account and finish Roster's onboarding. Use for \"set up Roster\", \"connect Roster\", or when the Roster dashboard says setup isn't finished.";

function setupSkill(target) {
  const signIn =
    target === "codex"
      ? "Codex signs in to Roster when the plugin is installed. If that was skipped or has expired, tell\nthem to sign in to Roster from Codex's plugin list (`/plugins`) — a browser opens; they approve\nwith their Roster login — then try again."
      : "Antigravity signs in to Roster the first time a Roster tool is used: a browser opens and they\napprove with their Roster login. If no browser opened, tell them to open Agent settings →\nCustomizations, find roster and press Authenticate — then try again.";
  return `---
name: setup
description: ${SETUP_DESCRIPTION}
---

# Set up Roster

The user has come from Roster's setup page, and the rest of the dashboard stays locked until this
records that setup finished. Get them connected and record completion. Nothing else: connecting
Google Ads or Meta Ads, adding clients and their reports are the dashboard's next steps, and every
report asked for in the dashboard comes with its own link.

**Keep it short.** Say what you are doing, do it, stop.

## 1. Connect

Call \`check_setup\`. It is here to confirm the connection works; do not report what it says about
clients, Google Ads, Meta Ads or reports waiting to be built, and do not call \`list_workspaces\`,
\`list_reports\` or \`get_catalog\`. Setup does not look at clients at all.

If the Roster tools are missing, or it fails with an authorization error, Roster is not signed in
yet. ${signIn}

If two attempts fail, stop and say what the error was — setup cannot be recorded without a
connection, so the dashboard stays locked until this works.

## 2. Record completion

Call \`complete_setup\`. Always — on a re-run too. This is what unlocks the dashboard; skip it and
the user is stuck on the setup screen with no idea why.

If it fails, say so plainly and try once more. Do not tell them setup is finished until it has
succeeded.

## 3. Orientation — first run only

Only when \`complete_setup\` returned \`firstTime: true\`. Three lines at most. The first is exactly
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
`;
}

// ── Packages ──────────────────────────────────────────────────────────────────────────────────────

function packageFiles(target) {
  const { dir, prefix } = TARGETS[target];
  const files = new Map();

  for (const [rel, text] of sourceSkills()) {
    const skill = rel.split("/")[1];
    const name = prefix + skill;
    let out = text;
    if (rel.endsWith("/SKILL.md")) out = frontmatter(out, rel, name);
    files.set(`${dir}/skills/${name}/${rel.split("/").slice(2).join("/")}`, renameSkillRefs(out, prefix));
  }
  files.set(`${dir}/skills/${prefix}setup/SKILL.md`, renameSkillRefs(frontmatter(setupSkill(target), "setup", `${prefix}setup`), prefix));

  if (target === "codex") {
    files.set(`${dir}/plugin.json`, json({
      $schema: "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
      name: "roster",
      version: VERSION,
      description: DESCRIPTION,
      author: { name: claudeManifest.author.name },
      homepage: `${SITE}/`,
      repository: REPO,
      keywords: ["google-ads", "meta-ads", "reporting", "campaigns", "agency", "marketing"],
      extensions: {
        "com.openai": {
          onboardingSkill: "./skills/setup/SKILL.md",
          interface: {
            displayName: claudeManifest.displayName,
            shortDescription: "Ads reports and campaign setup",
            // The four things Roster does, as the root README says them: Google Ads and Meta Ads
            // reporting, Google Ads and Meta Ads campaign creation — never reporting alone. Meta's
            // campaigns open first, in early access (turned on agency by agency); Google's are said
            // to open soon until they do.
            longDescription:
              "Google Ads and Meta Ads client reports, and new Meta Ads campaigns. Design a report once, in plain language; Roster refreshes it from live data whenever you're ready, and you send your client a link to the figures you've checked. Campaigns are drafted with you and created paused, only after your yes. Meta Ads campaigns are in early access, turned on agency by agency. Google Ads campaigns open soon; until then Roster only reads your Google Ads accounts.",
            developerName: claudeManifest.author.name,
            category: "Productivity",
            websiteURL: `${SITE}/`,
            privacyPolicyURL: `${SITE}/privacy.html`,
            termsOfServiceURL: `${SITE}/terms.html`,
            defaultPrompt: ["Set up Roster", "What reports are waiting for a client?"],
          },
        },
      },
    }));
    // Agent Plugins MCP config: `type` is required, and Codex refuses any other key on a server.
    files.set(`${dir}/mcp.json`, json({
      $schema: "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
      mcpServers: { roster: { type: "streamable-http", url: MCP_URL } },
    }));
    // Read before .claude-plugin/marketplace.json, so Codex gets this package and Claude keeps the
    // root one. Paths resolve from the repository root.
    files.set(".agents/plugins/marketplace.json", json({
      name: "roster",
      interface: { displayName: "Roster" },
      plugins: [
        {
          name: "roster",
          source: { source: "local", path: "./codex" },
          policy: { installation: "AVAILABLE", authentication: "ON_INSTALL" },
          category: "Productivity",
        },
      ],
    }));
  } else {
    // Antigravity's manifest allows name and description only (additionalProperties: false).
    files.set(`${dir}/plugin.json`, json({
      $schema: "https://antigravity.google/schemas/v1/plugin.json",
      name: "roster",
      description: DESCRIPTION,
    }));
    // `serverUrl`, not `url` — Antigravity ignores the legacy field names. OAuth is discovered and
    // registered dynamically, so nothing else is needed.
    files.set(`${dir}/mcp_config.json`, json({ mcpServers: { roster: { serverUrl: MCP_URL } } }));
  }

  files.set(`${dir}/README.md`, generatedReadme(target));

  // Skills only: they are what the model reads. The README is for people, and says where it came from.
  for (const [file, text] of files) {
    if (!file.includes("/skills/")) continue;
    text.split("\n").forEach((line, i) => {
      for (const word of FORBIDDEN) {
        if (word.test(line)) fail(`${file}:${i + 1} still says ${word}: ${line.trim()}`);
      }
    });
  }
  return files;
}

function generatedReadme(target) {
  const { assistant } = TARGETS[target];
  const install =
    target === "codex"
      ? "codex plugin marketplace add GauravKumar1905/roster-plugin\ncodex plugin add roster@roster"
      : "agy plugin install https://github.com/GauravKumar1905/roster-plugin/antigravity";
  return `# Roster for ${assistant}

Generated by \`scripts/build-packages.mjs\` from the Claude plugin at the root of this repository.
Edit the skills there, then run \`node scripts/build-packages.mjs\` — never edit these files.

Install:

\`\`\`
${install}
\`\`\`

Then sign in with your Roster login when asked, and say "set up Roster".
`;
}

// ── Write or check ────────────────────────────────────────────────────────────────────────────────

const all = new Map([...packageFiles("codex"), ...packageFiles("antigravity")]);
const owned = ["codex", "antigravity", ".agents"];

if (CHECK) {
  const stale = [];
  for (const [file, text] of all) {
    const full = path.join(ROOT, file);
    if (!fs.existsSync(full) || fs.readFileSync(full, "utf8") !== text) stale.push(file);
  }
  for (const file of owned.flatMap((d) => listFiles(d))) if (!all.has(file)) stale.push(`${file} (not generated)`);
  if (stale.length) fail(`out of date — run node scripts/build-packages.mjs:\n  ${stale.join("\n  ")}`);
  console.log(`build-packages: up to date (${all.size} files, v${VERSION})`);
} else {
  for (const dir of owned) fs.rmSync(path.join(ROOT, dir), { recursive: true, force: true });
  for (const [file, text] of all) {
    fs.mkdirSync(path.dirname(path.join(ROOT, file)), { recursive: true });
    fs.writeFileSync(path.join(ROOT, file), text);
  }
  console.log(`build-packages: wrote ${all.size} files for v${VERSION}`);
}

// ── Helpers ───────────────────────────────────────────────────────────────────────────────────────

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function readJson(rel) {
  return JSON.parse(read(rel));
}

function json(value) {
  return JSON.stringify(value, null, 2) + "\n";
}

function listFiles(dir) {
  const full = path.join(ROOT, dir);
  if (!fs.existsSync(full)) return [];
  return fs.readdirSync(full, { recursive: true, withFileTypes: true })
    .filter((e) => e.isFile())
    .map((e) => path.relative(ROOT, path.join(e.parentPath ?? e.path, e.name)));
}

function fail(message) {
  console.error(`build-packages: ${message}`);
  process.exit(1);
}

