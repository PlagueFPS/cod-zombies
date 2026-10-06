# Main quest guides

Main quest guides list every easter-egg guide, narrow that list by game, difficulty, completion time, and sort order, and open a single map's step-by-step guide.

## Sub-features

- `main-quests-open-nav` opens the listing from the desktop header.
- `main-quests-open-home` opens the listing from the home section's View All link.
- `main-quests-open-mobile` opens the listing from the mobile navigation sheet.
- `main-quests-open-search` opens the Totenreich guide from header search.
- `main-quests-filter-sort` keeps a Black Ops 7 filter and Oldest sort in the URL and on the chip.
- `main-quests-open-guide` opens the Totenreich guide from the filtered listing.

## How to get to it (user POV)

- Choose `Main Quests` in the desktop header.
- On the home page, choose `View All` in the Main Quests section.
- Below the `lg` breakpoint, choose `Toggle Nav`, then `Main Quests`.
- Choose `Search` in the header (or press `Mod+K`), type a quest name, and choose that quest.
- Open a shared listing URL such as `/main-quests?game=["black-ops-7"]&sort=oldest`.

## Driving it with codz-verify

Preconditions:

- Doctor reports `healthy=yes` for this `VERIFY_RUN_ID`.
- Viewport for the desktop steps is 1280×900. The mobile step resizes to 390×844 and restores 1280×900.
- Run `.agents/skills/verify-cod-zombies/scripts/codz-verify drive main-quests`. The command performs the bullets below in order.

- **Header nav.** From home, choose Main Quests. The command runs `page.getByRole("link", { name: "Go to Main Quests page" }).click()`. The heading `Main Quests` is visible. Screenshot `02-main-quests-nav.png`.
- **Home View All.** Return with `page.getByRole("link", { name: "Go to Home Page" }).first().click()`, then click `View All` on the parent of the heading `Main Quests` (`getByRole("heading", { name: "Main Quests", exact: true }).locator("..").getByRole("link", { name: "View All" })`). The heading `Main Quests` is visible again.
- **Mobile nav.** From home at 390×844, the command runs `page.getByRole("button", { name: "Toggle Nav" }).click()` and then `page.getByRole("link", { name: "Navigate to Main Quests page" }).click()`. The heading `Main Quests` is visible. Screenshot `03-main-quests-mobile.png`.
- **Search.** From home, the command runs `page.getByRole("button", { name: /^Search/ }).click()` (the accessible name is `Search Ctrl+K`), fills the placeholder `Search quests, relics, zombies, maps` with `Totenreich`, and clicks `page.getByRole("option", { name: "Totenreich", exact: true })`. The URL matches `/main-quests/black-ops-7/totenreich` and the heading is `Totenreich`. Screenshot `04-search-totenreich.png`.
- **Filter and sort.** Open the listing again with `Go to Main Quests page`. Click the combobox named `Filter: Game, Difficulty, Completion Time`, then `[data-slot="combobox-item"]` with exact text `Black Ops 7`. A chip named `Black Ops 7` is visible and the URL matches `game=.*black-ops-7`. Open the select whose trigger text is `Latest` via `[data-slot="select-trigger"]` and choose `[data-slot="select-item"]` text `Oldest`. The URL matches `sort=.*oldest`. Screenshot `05-filtered.png`.
- **Open the guide.** The command runs `page.getByRole("link", { name: "View Guide for Totenreich" }).click()`. The URL matches `/main-quests/black-ops-7/totenreich`, the heading is `Totenreich`, and the document title contains `Totenreich Main Quest`. Screenshot `06-guide.png` and ARIA snapshot `06-guide.aria.txt`.
- **Proof.** `steps.log` lists each `entry=` line before the matching `url=` line. `01-home.png` shows the home heading before the first navigation.

## Gotchas

- Header links with `Go to … page` are `display: none` below 1024px. The mobile labels are `Navigate to … page`.
- The search button's accessible name is `Search Ctrl+K` (or `Search ⌘K` on macOS). `exact: true` with the name `Search` does not match.
- Several `View All` links exist on the home page. The outer home `section` contains every one of them. Click the `View All` that is a sibling of the `Main Quests` heading, not a link inside an ancestor section.
- `Totenreich` search has one exact option for the main quest. `Totenreich Interactive Map` is a different option and opens `/maps/totenreich`.
- Multi-value filters are JSON arrays in the query string (`game=["black-ops-7"]`). Sort is a plain token (`sort=oldest`), not a JSON string. Match a filter slug with a substring, not `game=black-ops-7` alone.
- Filter suggestions are `[data-slot="combobox-item"]`. They are not `role="option"` (search results are). Click the combobox whose name is the placeholder, including the `Filter: ` prefix. The drive waits until that input is hydrated; a click on the server-rendered input focuses it and does not open the list.
- The sort trigger's visible label is the current value (`Latest` on a fresh listing). After a previous sort, the trigger text changes.
- Guides whose map state is `Coming Soon` are omitted from search and return not-found on a direct URL.
- Dev mode draws React Scan outlines and a toolbar over the page. The drive removes that chrome before screenshots. A picture full of component labels is a failed capture, not a successful guide view.
