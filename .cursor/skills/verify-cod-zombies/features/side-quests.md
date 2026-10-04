# Side quest guides

Side quest guides list secrets and rewards outside the main story, filter them by game or map, and open one quest's steps.

## Sub-features

- `side-quests-open` opens the listing from the desktop header.
- `side-quests-filter` applies a Black Ops 3 filter and shows that chip.
- `side-quests-open-guide` opens the Free 500 Points guide on Shadows of Evil.

## How to get to it (user POV)

- Choose `Side Quests` in the desktop header.
- On the home page, choose `View All` in the Side Quests section.
- Below the `lg` breakpoint, choose `Toggle Nav`, then `Side Quests`.
- Choose `Search`, type a side-quest title, and choose it under a `<map> Side Quests` group.
- Open `/side-quests/` or a shared filter URL.

## Driving it with codz-verify

Preconditions:

- Doctor reports `healthy=yes` for this `VERIFY_RUN_ID`.
- Run `.cursor/skills/verify-cod-zombies/scripts/codz-verify drive side-quests`. The command performs the bullets below in order from the home page at 1280×900.

- **Header nav.** The command runs `page.getByRole("link", { name: "Go to Side Quests page" }).click()`. The heading `Side Quests` is visible. Screenshot `01-listing.png`.
- **Filter.** Click the combobox named `Filter: Game or Map`, then `[data-slot="combobox-item"]` with exact text `Black Ops 3`. A chip named `Black Ops 3` is visible and the URL matches `game=.*black-ops-3`.
- **Open the guide.** The command runs `page.getByRole("link", { name: "View Guide for Free 500 Points" }).click()`. The URL is `/side-quests/black-ops-3/shadows-of-evil/free-500-points` and the heading is `Free 500 Points`. Screenshot `02-guide.png` and ARIA snapshot `02-guide.aria.txt`.

## Gotchas

- Home and mobile entry points are real and are not part of `drive side-quests`. Driving only the header does not verify them.
- `Free 500 Points` is the Shadows of Evil quest. Other maps can reuse similar reward names; assert the full URL.
- The filter placeholder is `Filter: Game or Map`. A substring match on `Filter: Game` can hit the wrong field on another page.
- `Coming Soon` side quests are left out of search.
