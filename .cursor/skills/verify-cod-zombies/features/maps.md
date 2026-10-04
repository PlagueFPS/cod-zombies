# Interactive maps

Interactive maps list published maps, filter them by game, and open a map where marker groups and layers can be toggled. The toggles are written into the URL.

## Sub-features

- `maps-open` opens the listing from the desktop header.
- `maps-filter-game` applies a Black Ops 6 filter and shows that chip.
- `maps-open-terminus` opens the Terminus map.
- `maps-toggle-markers` hides every marker, then shows them again.
- `maps-switch-layer` switches Totenreich from Eidskallen to Boss Fight Arena.

## How to get to it (user POV)

- Choose `Maps` in the desktop header.
- On the home page, choose `View All` in the Interactive Maps section.
- Below the `lg` breakpoint, choose `Toggle Nav`, then `Maps`.
- Choose `Search` and pick `<map> Interactive Map` under `Interactive Maps`.
- From the listing, choose a card named `View <map> interactive map`.
- Open `/maps/<mapId>` directly.

## Driving it with codz-verify

Preconditions:

- Doctor reports `healthy=yes` for this `VERIFY_RUN_ID`.
- Run `.cursor/skills/verify-cod-zombies/scripts/codz-verify drive maps`. The command performs the bullets below in order from the home page at 1280×900.

- **Header nav.** The command runs `page.getByRole("link", { name: "Go to Maps page" }).click()`. The heading `Interactive Maps` is visible. Screenshot `01-listing.png`.
- **Game filter.** Click the combobox named `Filter: Game`, then `[data-slot="combobox-item"]` with exact text `Black Ops 6`. A chip named `Black Ops 6` is visible and the URL matches `game=.*black-ops-6`.
- **Open Terminus.** The command runs `page.getByRole("link", { name: "View Terminus interactive map" }).click()`. The URL matches `/maps/terminus` and the button `Hide All Markers` is visible. Screenshot `02-terminus.png`.
- **Toggle markers.** The command clicks `Hide All Markers`, waits until the URL matches `exclude=`, then clicks `Show All Markers` and waits until `exclude=` is gone.
- **Switch layer.** The command opens `/maps/totenreich` on the same origin, waits for `Hide All Markers`, then uses `[data-slot="select-trigger"]` text `Eidskallen` and `[data-slot="select-item"]` text `Boss Fight Arena`. The URL matches `layer=.*boss-fight-arena` and the text `Current Layer` is visible. Screenshot `03-totenreich-layer.png` and ARIA snapshot `03-totenreich-layer.aria.txt`.

## Gotchas

- Map pages set `ssr: "data-only"`. Wait for `Hide All Markers` (up to 20 seconds). The first paint is not the map.
- `Hide All Markers` and `Show All Markers` are the accessible names. The visible button text is `None` and `All`.
- The layer trigger shows the current layer name. On Totenreich the default used here is `Eidskallen`. A different map does not have that option.
- `Coming Soon` maps are omitted from the listing and from search.
- Marker visibility is URL state, not an account preference. A new browser context starts with every marker shown.
