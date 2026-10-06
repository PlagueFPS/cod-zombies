# Side quest guides

Side quest guides list secrets and rewards outside the main story, filter them by game or map, and open one quest's steps.

## Sub-features

- `side-quests-open` opens the listing from the desktop header.
- `side-quests-filter` applies a Black Ops 3 filter and shows that chip.
- `side-quests-sort-oldest` switches the listing to Oldest so Shadows of Evil quests are on the first page.
- `side-quests-open-guide` opens the Free 500 Points guide on Shadows of Evil.

## How to get to it (user POV)

- Choose `Side Quests` in the desktop header.
- On the home page, choose `View All` in the Side Quests section.
- Below the `lg` breakpoint, choose `Toggle Nav`, then `Side Quests`.
- Choose `Search`, type a side-quest title, and choose it under a `<map> Side Quests` group.
- Open `/side-quests` or a shared filter URL such as `/side-quests?game=["black-ops-3"]&sort=oldest`.

## Driving it with codz-verify

Preconditions:

- Doctor reports `healthy=yes` for this `VERIFY_RUN_ID`.
- Run `.agents/skills/verify-cod-zombies/scripts/codz-verify drive side-quests`. The command performs the bullets below in order from the home page at 1280×900.

- **Header nav.** The command runs `page.getByRole("link", { name: "Go to Side Quests page" }).click()`. The heading `Side Quests` is visible. Screenshot `01-listing.png`.
- **Filter.** Click the combobox named `Filter: Game or Map`, then `[data-slot="combobox-item"]` with exact text `Black Ops 3`. A chip named `Black Ops 3` is visible and the URL matches `game=.*black-ops-3`. The click waits until the combobox input is hydrated.
- **Oldest sort.** Open the select whose trigger text is `Latest` via `[data-slot="select-trigger"]` and choose `[data-slot="select-item"]` text `Oldest`. The URL matches `sort=.*oldest`.
- **Open the guide.** The command runs `page.getByRole("link", { name: "View Guide for Free 500 Points" }).click()`. The URL is `/side-quests/black-ops-3/shadows-of-evil/free-500-points`. The page title heading is `Free 500 Points`, and the guide body repeats that name as a second heading, so the drive waits on `.first()`. Screenshot `02-guide.png` and ARIA snapshot `02-guide.aria.txt`.

## Gotchas

- Home and mobile entry points are real and are not part of `drive side-quests`. Driving only the header does not verify them.
- `Free 500 Points` is the Shadows of Evil quest. Other maps can reuse similar reward names; assert the full URL. The guide MDX also has an `h2` with that title, so `getByRole("heading", { name: "Free 500 Points", exact: true })` matches two nodes.
- Default sort is Latest, which lists newer Black Ops 3 maps first. Shadows of Evil and The Giant share the earliest Black Ops 3 release date, so Oldest is what puts Free 500 Points on page 1 (alongside The Giant's quests). Do not open a different Black Ops 3 quest on page 1 and call this entry verified.
- The filter placeholder is `Filter: Game or Map`. A substring match on `Filter: Game` can hit the wrong field on another page.
- The filter click waits until the combobox input is hydrated. A click on the server-rendered input does not open the list.
- `Coming Soon` side quests are left out of search.
