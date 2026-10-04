# Bestiary

The bestiary lists zombie types, filters them by type, game, map, or weakness, and opens one zombie's detail page.

## Sub-features

- `bestiary-open` opens the listing from the desktop header.
- `bestiary-filter-boss` applies the Boss type filter and shows that chip.
- `bestiary-open-detail` opens the Avogadro detail page.

## How to get to it (user POV)

- Choose `Bestiary` in the desktop header.
- On the home page, choose `View All` in the Bestiary section.
- Below the `lg` breakpoint, choose `Toggle Nav`, then `Bestiary`.
- Choose `Search` and pick an entry under the `Zombies` group.
- Open `/bestiary/` or a shared filter URL such as `/bestiary/?type=["boss"]&sort="oldest"`.

## Driving it with codz-verify

Preconditions:

- Doctor reports `healthy=yes` for this `VERIFY_RUN_ID`.
- Run `.agents/skills/verify-cod-zombies/scripts/codz-verify drive bestiary`. The command performs the bullets below in order from the home page at 1280×900.

- **Header nav.** The command runs `page.getByRole("link", { name: "Go to Bestiary page" }).click()`. The heading `Bestiary` is visible. Screenshot `01-listing.png`.
- **Boss filter.** Click the combobox named `Filter: Type, Game, Map, or Weakness`, then `[data-slot="combobox-item"]` with exact text `Boss`. A chip named `Boss` is visible and the URL matches `type=.*boss`.
- **Open a detail page.** The command runs `page.getByRole("link", { name: "View details for Avogadro" }).click()`. The URL is `/bestiary/avogadro` and the text `Avogadro` is visible. Screenshot `02-detail.png` and ARIA snapshot `02-detail.aria.txt`.

## Gotchas

- Detail titles are card text, not an H1 named with `getByRole("heading")` alone. Assert the URL and the visible name.
- Avogadro must be on the filtered page the drive lands on. If pagination hides it, the link click fails; do not substitute a different boss and call this entry verified.
- The base enemy link is `View details for Zombie`, which is a different page (`/bestiary/zombie`).
- An unknown id such as `/bestiary/not-a-zombie` shows the heading `Zombie could not be found`. That is the not-found state, not a successful detail view.
