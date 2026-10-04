---
name: verify-cod-zombies
description: Launch and drive the Call of Duty: Zombies Guides website (Vite web UI) to prove a user-facing guide, map, bestiary, or relic flow. Use when a change touches routes, listings, search, filters, or interactive maps and needs evidence from the running app.
---

# Verify Call of Duty: Zombies Guides

Primary surface: the website. A user reads main-quest, side-quest, and cursed-relic guides, filters those listings, opens the bestiary, and uses interactive maps. Search, the header, and the home page are how they get there.

Other surfaces, not driven by this skill:

- Newsletter subscribe and unsubscribe forms (`/` and `/newsletter/unsubscribe/`). Launch sets `E2E_MOCK_EMAIL=success`, so those forms return a fake success and do not call Resend. A cleared email field is not proof that mail was sent.
- React Email preview via `bun run email` (port chosen by the `email` CLI, separate from the site).
- Content broadcast scripts (`bun run content:broadcast:test` and `content:broadcast:send`). The send script delivers real email. Do not run it for verification.

Content is compiled into the repo. There is no database to seed and no login.

## Launch

From the repo root:

```bash
.agents/skills/verify-cod-zombies/scripts/codz-verify launch
```

That starts `bun run dev -- --host 127.0.0.1 --port <free port in 4180-4279>` with the same dummy Linear and Resend env as `playwright.config.ts`, plus `E2E_MOCK_EMAIL=success`. It writes `/tmp/codz-verify/<runId>/meta.json` and `/tmp/codz-verify/latest`.

Ready means `GET /` returns HTTP 200 and the HTML contains `Call of Duty: Zombies Guides`. The command prints `ready=yes`, `runId`, `baseUrl`, `pid`, and `git`. Cold start can take up to 120 seconds.

Set `VERIFY_RUN_ID` before launch when you need a chosen id. Later commands read `VERIFY_RUN_ID` or `/tmp/codz-verify/latest`.

One checkout can run one Vite dev server. Launch refuses when another verification run is alive or when any other `vite` / `dev` process has this repo as its cwd (including a normal `bun run dev` on port 3000 and Playwright's server on port 4173). Do not attach the harness to a server this run did not start.

## Doctor

```bash
.agents/skills/verify-cod-zombies/scripts/codz-verify doctor
```

Read-only. It passes only when all of these are true:

- `meta.json` exists for this run and `pid` is alive
- that process tree owns the listen socket for `baseUrl`
- `GET /` is HTTP 200, the title contains `Call of Duty: Zombies Guides`, and `git` is the revision recorded at launch

Run doctor before every drive, and again whenever a page looks stale or the port is unexpected. Exit code 1 means do not drive.

## Drive

Harness: `codz-verify drive <feature>` opens headless Google Chrome (`channel: "chrome"`, sandbox off) at a 1280×900 viewport against this run's `baseUrl`. It uses accessible names from the app. Listing filters use the combobox whose name is the placeholder (`Filter: …`) and `[data-slot="combobox-item"]`. Sort menus and map layer menus use `data-slot="select-trigger"` and `data-slot="select-item"`, the same handles as `tests/e2e/helpers/ui.ts`.

```bash
.agents/skills/verify-cod-zombies/scripts/codz-verify drive main-quests
.agents/skills/verify-cod-zombies/scripts/codz-verify drive side-quests
.agents/skills/verify-cod-zombies/scripts/codz-verify drive relics
.agents/skills/verify-cod-zombies/scripts/codz-verify drive bestiary
.agents/skills/verify-cod-zombies/scripts/codz-verify drive maps
```

Read [features/README.md](features/README.md) first. A drive of one feature does not cover the other feature files.

Desktop header links (`Go to Main Quests page`, and the same pattern for Side Quests, Relics, Bestiary, and Maps) are hidden below the `lg` breakpoint. The mobile path is the `Toggle Nav` button, then `Navigate to <title> page`. The search control's accessible name is `Search Ctrl+K`, so match it with `/^Search/`.

## Evidence

Proof goes to `/opt/cursor/artifacts/verify-cod-zombies/<runId>/<feature>/`. Override the parent with `VERIFY_EVIDENCE_DIR` (the run id is still appended).

Each drive writes `steps.log` (action, then resulting URL or title) plus PNG screenshots and Playwright ARIA snapshots. The header logo alt text is `Call of Duty: Zombies Guides Logo`; a shot that does not show the header is not identity proof.

`bun run dev` also mounts React Scan and TanStack Devtools. Before each screenshot and ARIA snapshot the harness removes `[data-react-scan]`, `#react-scan-toolbar-root`, `#react-scan-root`, and fixed canvases, and it pre-sets `localStorage["react-scan-options"]` to `enabled: false`. Those nodes are dev chrome, not the guide.

Standards:

- Use the real click path in the feature file. Do not call loaders, set search params from a unit test, or hit a test-only route.
- Capture the screen before the action and the screen after the URL, heading, or marker control changes.
- Listing filters and map marker toggles prove themselves through the address bar (`game`, `type`, `sort`, `exclude`, `layer`) as well as the visible chip or button.
- Guides are static pages. The side effect to check is the guide URL and its heading, not a database row.
- `E2E_MOCK_EMAIL=success` skips Resend. Do not claim an email was delivered. Page HTML also requests `pagead2.googlesyndication.com`; that request is the ads script on every page, not the feature under test.
- There is no dry-run mode. The dev server is the app.

## Cleanup

```bash
.agents/skills/verify-cod-zombies/scripts/codz-verify cleanup
```

Sends `SIGTERM` to the process group recorded for this run (or every live run when `VERIFY_RUN_ID` is unset) and deletes `/tmp/codz-verify/<runId>`. It does not delete `/opt/cursor/artifacts/verify-cod-zombies`. Confirm the screenshots and `steps.log` are still there after cleanup.

Do not kill processes by name. If the pid is already gone, cleanup only removes that run's state directory.

## Helpers

Both files live in `.agents/skills/verify-cod-zombies/scripts/`. Invoke the bash wrapper so `bun` is on `PATH`:

```bash
.agents/skills/verify-cod-zombies/scripts/codz-verify launch
.agents/skills/verify-cod-zombies/scripts/codz-verify doctor
.agents/skills/verify-cod-zombies/scripts/codz-verify drive main-quests
.agents/skills/verify-cod-zombies/scripts/codz-verify cleanup
```

`codz-verify.ts` is the implementation. Arguments are `launch`, `doctor`, `drive <feature>`, and `cleanup`.
