# Cursed relics

Cursed relic guides list relics, filter them by map and type, and open one relic's unlock steps.

## Sub-features

- `relics-open` opens the listing from the desktop header.
- `relics-filter-special` applies the Special type filter, writes `?type=["special"]`, and lists Mister Peeks Mayhem.
- `relics-filter-type` applies Grim together with Special, then leaves Grim selected and shows that chip.
- `relics-open-guide` opens the Lawyer's Pen guide.

## How to get to it (user POV)

- Choose `Relics` in the desktop header.
- On the home page, choose `View All` in the Cursed Relics section. The listing heading is also `Cursed Relics`. The breadcrumb link says `Relics`.
- Below the `lg` breakpoint, choose `Toggle Nav`, then `Relics`.
- Choose `Search` and pick a relic under a `<map> Relics` group.
- Open `/relics` or a shared filter URL such as `/relics?type=["grim"]`.

## Driving it with codz-verify

Preconditions:

- Doctor reports `healthy=yes` for this `VERIFY_RUN_ID`.
- Run `.agents/skills/verify-cod-zombies/scripts/codz-verify drive relics`. The command performs the bullets below in order from the home page at 1280×900.

- **Header nav.** The command runs `page.getByRole("link", { name: "Go to Relics page" }).click()`. The heading `Cursed Relics` is visible. Screenshot `01-listing.png`.
- **Special type filter.** Click the combobox named `Filter: Map, Type`, then `[data-slot="combobox-item"]` with exact text `Special`. A chip named `Special` is visible, the URL `type` param is `["special"]`, and `View Guide for the Mister Peeks Mayhem relic` is visible. Screenshot `02-special.png` and ARIA snapshot `02-special.aria.txt`.
- **Grim with Special.** Click `Grim` in the same combobox. The URL `type` param is a JSON array containing `grim` and `special`. Screenshot `03-combined.png`. Click `Special` again to clear it. A chip named `Grim` is visible and the URL `type` param is `["grim"]`.
- **Open the guide.** The command runs `page.getByRole("link", { name: "View Guide for the Lawyer's Pen relic" }).click()`. The URL is `/relics/black-ops-7/lawyers-pen` and the heading is `Lawyer's Pen`. Screenshot `04-guide.png` and ARIA snapshot `04-guide.aria.txt`.

## Gotchas

- The home section title and the listing H2 are both `Cursed Relics`. The header link and breadcrumb say `Relics`.
- The filter click waits until the combobox input is hydrated. A click on the server-rendered input does not open the list.
- Lawyer's Pen is on Ashes of the Damned, and the route game id is `black-ops-7`.
- Relic link names include `the` and `relic`: `View Guide for the Lawyer's Pen relic`.
- Sort options are discovery date, type, and unlock time (`Newest Discovered` is the default trigger text). This drive does not change sort.
- The Special type option is the relic type label. Mister Peeks Mayhem is the relic that filter lists.
- Choosing Special again while Grim is also selected removes only Special. The type param stays a JSON array.
