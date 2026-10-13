# Interactive maps

Interactive maps list published maps, filter them by game, and open a map where marker groups and layers can be toggled. Marker and layer choices are written into the URL. Maps also have marker popups, zoom controls, sharing, and appearance settings saved in the browser.

## Sub-features

- `maps-open` opens the listing from the desktop header.
- `maps-filter-game` applies a Black Ops 6 filter and shows that chip.
- `maps-open-terminus` opens the Terminus map.
- `maps-toggle-markers` hides every marker, then shows them again.
- `maps-switch-layer` switches Totenreich from Eidskallen to Boss Fight Arena.
- `maps-current-map` switches from Terminus to Totenreich through the sidebar menu.
- `maps-settings` saves Disable Zoom Animation and keeps it after a reload.

## How to get to it (user POV)

- Choose `Maps` in the desktop header.
- On the home page, choose `View All` in the Interactive Maps section.
- Choose a map preview card on home to open it directly.
- Below the `lg` breakpoint, choose `Toggle Nav`, then `Maps`.
- Choose `Search` and pick `<map> Interactive Map` under `Interactive Maps`.
- From the listing, choose a card named `View <map> interactive map`.
- Open `/maps/<mapId>` directly.
- Choose another map in the sidebar's `Current Map` menu.

## Driving it with codz-verify

Preconditions:

- Doctor reports `healthy=yes` for this `VERIFY_RUN_ID`.
- Run `.agents/skills/verify-cod-zombies/scripts/codz-verify drive maps`. The command performs the bullets below in order from the home page at 1280×900.

- **Header nav.** The command runs `page.getByRole("link", { name: "Go to Maps page" }).click()`. The heading `Interactive Maps` is visible. Screenshot `01-listing.png`.
- **Game filter.** Click the combobox named `Filter: Game`, then `[data-slot="combobox-item"]` with exact text `Black Ops 6`. A chip named `Black Ops 6` is visible and the URL matches `game=.*black-ops-6`.
- **Open Terminus.** Click `page.getByRole("link", { name: "View Terminus interactive map" })`. The URL matches `/maps/terminus` and `Hide All Markers` is visible. Wait until `.leaflet-image-layer` is complete with positive natural width and `.leaflet-marker-icon` nodes exist. Record their count. Screenshot `02-terminus.png`.
- **Toggle markers.** Click `Hide All Markers`. The URL has `exclude=` and `.leaflet-marker-icon` has count 0. Capture `03-markers-hidden.png` and its ARIA snapshot. Click `Show All Markers`; `exclude=` disappears and the original marker count returns. Screenshot `04-markers-restored.png`.
- **Current Map menu.** Use `[data-slot="select-trigger"]` text `Terminus` and choose `[data-slot="select-item"]` text `Totenreich`. The URL is `/maps/totenreich`.
- **Switch layer.** Use the select trigger `Eidskallen` and item `Boss Fight Arena`. The URL matches `layer=.*boss-fight-arena`. The selected trigger says `Boss Fight Arena`, and the loaded Leaflet image source ends in `totenreich-boss-fight-arena-layer.webp`. Screenshot `05-totenreich-layer.png` and ARIA snapshot `05-totenreich-layer.aria.txt`.
- **Saved settings.** Click `Map Settings. Keyboard Shortcut: ?`. In the dialog `Interactive Map Settings`, choose the `General` tab and toggle the switch `Disable Zoom Animation` on. Capture `06-map-settings.png` and its ARIA snapshot. Click `Save`, reload, reopen the dialog, and choose `General`. The switch remains checked. Click `Cancel` to close the dialog.

## Gotchas

- Map pages set `ssr: "data-only"`. Wait for `Hide All Markers`, then wait separately for a loaded Leaflet image and rendered markers. A sidebar button alone does not prove map readiness.
- `Hide All Markers` and `Show All Markers` are the accessible names. The visible button text is `None` and `All`.
- The layer trigger shows the current layer name. On Totenreich the default used here is `Eidskallen`. A different map does not have that option.
- Search leaves out `Coming Soon` maps. The listing does not; a Coming Soon interactive map would render as a disabled card. The current catalog has none.
- Marker visibility is URL state, not an account preference. A new browser context starts with every marker shown.
- Settings persist in `localStorage["map-settings"]`. Each drive has an isolated browser context, so its saved settings disappear when that context closes.
- The sidebar can toggle individual marker types and collapse categories. Clicking a marker opens its popup. `Zoom In`, `Zoom Out`, and `Reset Zoom` control the map. Settings have Markers, Popups, and General tabs, with Save, Cancel, and per-setting resets.
- Home, mobile, search, shared URLs, individual marker types, popups, zoom, sharing, and every setting are not exercised by this drive. `Mod+B` toggles the sidebar, `?` opens settings, and `Mod+Shift+C` copies the map URL.
