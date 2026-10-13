# Main quest guides

Main quest guides list available and Coming Soon map guides, narrow that list by game, difficulty, completion time, and sort order, and open a single map's walkthrough. Guides have section navigation, images, contextual tooltips, and map-specific puzzle tools.

## Sub-features

- `main-quests-open-nav` opens the listing from the desktop header.
- `main-quests-open-home` opens the listing from the home section's View All link.
- `main-quests-open-mobile` opens the listing from the mobile navigation sheet.
- `main-quests-open-search` opens the Totenreich guide from header search.
- `main-quests-filter-sort` keeps a Black Ops 7 filter and Oldest sort in the URL and on the chip.
- `main-quests-open-guide` opens the Totenreich guide from the filtered listing.
- `main-quests-pagination` opens page 2 and checks that a filter change returns to page 1.
- `main-quests-guide-contents` jumps to a guide section and collapses and expands the contents.
- `main-quests-carousel` browses enlarged images and retains the selected slide and focus on dismissal.
- `main-quests-image` enlarges a standalone image independently of the carousel.
- `main-quests-disk-tool` solves and resets the Beast from Beyond floppy-disk order.

## How to get to it (user POV)

- Choose `Main Quests` in the desktop header.
- On the home page, choose `View All` in the Main Quests section.
- Choose a main-quest preview card on home to open its guide directly.
- Below the `lg` breakpoint, choose `Toggle Nav`, then `Main Quests`.
- Choose `Search` in the header (or press `Mod+K`), type a quest name, and choose that quest.
- Open a shared listing URL such as `/main-quests?game=["black-ops-7"]&sort=oldest`.
- From a guide, use the game breadcrumb to open a filtered listing, or a Previous Map or Next Map card to open an adjacent guide.
- Follow a main-quest link in another guide or bestiary strategy.

## Driving it with codz-verify

Preconditions:

- Doctor reports `healthy=yes` for this `VERIFY_RUN_ID`.
- Viewport for the desktop steps is 1280×900. The mobile step resizes to 390×844 and restores 1280×900.
- Run `.agents/skills/verify-cod-zombies/scripts/codz-verify drive main-quests`. The command performs the bullets below in order.

- **Header nav.** From home, choose Main Quests. The command runs `page.getByRole("link", { name: "Go to Main Quests page" }).click()`. The heading `Main Quests` is visible. Screenshot `02-main-quests-nav.png`.
- **Home View All.** Return with `page.getByRole("link", { name: "Go to Home Page" }).first().click()`, then click `View All` on the parent of the heading `Main Quests` (`getByRole("heading", { name: "Main Quests", exact: true }).locator("..").getByRole("link", { name: "View All" })`). The heading `Main Quests` is visible again.
- **Mobile nav.** From home at 390×844, the command runs `page.getByRole("button", { name: "Toggle Nav" }).click()` and then `page.getByRole("link", { name: "Navigate to Main Quests page" }).click()`. The heading `Main Quests` is visible. Screenshot `03-main-quests-mobile.png`.
- **Search.** From home, the command runs `page.getByRole("button", { name: /^Search/ }).click()` (the accessible name is `Search Ctrl+K`), fills the placeholder `Search quests, relics, zombies, maps` with `Totenreich`, and clicks `page.getByRole("option", { name: "Totenreich", exact: true })`. The URL matches `/main-quests/black-ops-7/totenreich` and the heading is `Totenreich`. Screenshot `04-search-totenreich.png`.
- **Pagination, filter, and sort.** Open the listing again with `Go to Main Quests page`. Click `page.getByRole("button", { name: "Next", exact: true })`. The URL has `page=2` and `Page 2` has `aria-current="page"`. Click the combobox named `Filter: Game, Difficulty, Completion Time`, then `[data-slot="combobox-item"]` with exact text `Black Ops 7`. A chip named `Black Ops 7` is visible, the URL matches `game=.*black-ops-7`, and `page` disappears. `Page 1` is current again. Choose `Oldest` through the select whose trigger says `Latest`. The URL matches `sort=.*oldest`. Screenshot `05-filtered.png`.
- **Open the guide.** The command runs `page.getByRole("link", { name: "View Guide for Totenreich" }).click()`. The URL matches `/main-quests/black-ops-7/totenreich`, the heading is `Totenreich`, and the document title contains `Totenreich Main Quest`. Screenshot `06-guide.png` and ARIA snapshot `06-guide.aria.txt`.
- **Guide contents.** Click the link `Step 2: Obtain the Wunderbarrage Controller` inside `page.locator("aside")`. Its heading enters the viewport and the URL ends in `#step-2-obtain-the-wunderbarrage-controller`. Click the buttons `Collapse table of contents` and `Expand table of contents` in turn.
- **Expanded carousel.** In the first `[data-slot="carousel"]`, wait for `Next slide` to be enabled and click it. `Slide 2 of 4` becomes current. Click the caption button `Dry Dock - behind the boat in the bottom right corner`. In the dialog `Image carousel`, click `Next slide`. `Slide 3 of 4` becomes current and the War Factory image is in the viewport. Press Escape. The inline carousel remains on slide 3 and that image button has focus. Screenshots `07-inline-carousel.png` and `08-expanded-carousel.png`, plus `08-expanded-carousel.aria.txt`.
- **Standalone image.** Click `Crane Button`. The dialog with that name contains one image and no `Next slide` button. Click `dialog.locator("img")` to close it. Screenshot `09-standalone-image.png`.
- **Disk tool.** Search for `The Beast from Beyond` and choose that exact option. The URL is `/main-quests/infinite-warfare/the-beast-from-beyond`. In the group `Disk symbols`, choose `Skewed plus`, `Three slashes`, `Wings and diamond`, and `Lambda`, in that order. The result says `Insert the disks from left to right.` and lists `Three slashes`, `Wings and diamond`, `Lambda`, `Skewed plus`. Unselected symbols have `aria-disabled="true"`. Click `Reset`; no symbol remains pressed and the result disappears. Screenshots `10-disk-puzzle-before.png` and `11-disk-puzzle-order.png`, plus `11-disk-puzzle-order.aria.txt`.
- **Proof.** `steps.log` lists each `entry=` line before the matching `url=` line. `01-home.png` shows the home heading before the first navigation.

## Gotchas

- Header links with `Go to … page` are `display: none` below 1024px. The mobile labels are `Navigate to … page`.
- Header buttons can appear before hydration. The drive waits for React to attach before its first navigation; otherwise a mobile-menu click can do nothing.
- The search button's accessible name is `Search Ctrl+K` (or `Search ⌘K` on macOS). `exact: true` with the name `Search` does not match.
- Several `View All` links exist on the home page. The outer home `section` contains every one of them. Click the `View All` that is a sibling of the `Main Quests` heading, not a link inside an ancestor section.
- `Totenreich` search has one exact option for the main quest. `Totenreich Interactive Map` is a different option and opens `/maps/totenreich`.
- Multi-value filters are JSON arrays in the query string (`game=["black-ops-7"]`). Sort is a plain token (`sort=oldest`), not a JSON string. Match a filter slug with a substring, not `game=black-ops-7` alone.
- Filter suggestions are `[data-slot="combobox-item"]`. They are not `role="option"` (search results are). Click the combobox whose name is the placeholder, including the `Filter: ` prefix. The drive waits until that input is hydrated; a click on the server-rendered input focuses it and does not open the list.
- The sort trigger's visible label is the current value (`Latest` on a fresh listing). After a previous sort, the trigger text changes.
- Guides whose map state is `Coming Soon` are omitted from search and return not-found on a direct URL.
- Listings show 12 cards per page. Filters use OR within a group and AND between groups. Filter changes reset the page, while sort changes preserve it.
- The drive samples shared guide components on Totenreich and the disk tool on The Beast from Beyond. It does not exercise every guide, other puzzle tools, sharing, tooltips, touch swipes, mobile contents, or every entry point. The Final Reich guide is `/main-quests/wwii/the-final-reich` and contains Fireworks and Dark Reunion instructions.
- Standalone image enlargement is disabled below 640px. Expanded carousel images support touch navigation separately. A standalone dialog's image can have empty alt text; locate it inside the named dialog.
- Dev mode draws React Scan outlines and a toolbar over the page. The drive removes that chrome before screenshots. A picture full of component labels is a failed capture, not a successful guide view.
