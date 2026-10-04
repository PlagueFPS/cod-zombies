# Call of Duty: Zombies Guides verification map

This directory is the maintained source for verifying the user-facing website. Read the index before driving the app, then use the matching feature file as the recipe.

## Baseline preconditions

- Launch with `.cursor/skills/verify-cod-zombies/scripts/codz-verify launch` and require `ready=yes`.
- Run `.cursor/skills/verify-cod-zombies/scripts/codz-verify doctor` and require `healthy=yes` for that `runId`.
- Keep `VERIFY_RUN_ID` set to the printed run id for every later command.
- The site has no account and no writable content store. Do not seed data.
- Never drive a Vite process this verification run did not start. One checkout supports one dev server.

## Driving conventions

- Start every recipe from the home page the drive command opens.
- Prefer the accessible names in the feature file. Sort and map-layer menus use `data-slot="select-trigger"` and `data-slot="select-item"`.
- Treat every command as literal. Feature names stay `main-quests`, `side-quests`, `relics`, `bestiary`, and `maps`.
- Run the browser only through `codz-verify drive <feature>`.
- Restore nothing after a drive. Filters live in the URL of that browser session, which the command closes.
- Do not remove proof artifacts during cleanup.

## Proof and skip reporting

- Capture the user action and the resulting state, not only the final screen.
- UI proof includes `steps.log`, a PNG that shows the header logo, and an ARIA snapshot of the resulting page.
- Record the feature id and the entry point (`steps.log` lines starting with `entry=`).
- Report an unreachable path with the attempted command and the unmet precondition.
- Do not report a skipped entry point as verified through a different path.

## Feature entry contract

Each feature file starts with an H1 title and one paragraph describing the user-visible behavior. It then uses exactly four H2 sections in this order.

1. `Sub-features` lists short IDs with one line for each behavior.
2. `How to get to it (user POV)` lists every user entry point.
3. `Driving it with codz-verify` starts with `Preconditions:` and uses labeled bullets that pair each user action with the Playwright call inside the drive command and the observable result.
4. `Gotchas` lists traps that can waste or invalidate a verification run.

## Features

- [Main quest guides](./main-quests.md) covers header, home, mobile, and search entry, then game filter, sort, and opening the Totenreich guide.
- [Side quest guides](./side-quests.md) covers the side-quest listing, a Black Ops 3 filter, and the Free 500 Points guide.
- [Cursed relics](./relics.md) covers the relic listing, a Grim type filter, and the Lawyer's Pen guide.
- [Bestiary](./bestiary.md) covers the bestiary listing, a Boss filter, and the Avogadro detail page.
- [Interactive maps](./maps.md) covers the map listing, a Black Ops 6 filter, Terminus marker toggles, and the Totenreich layer switch.
