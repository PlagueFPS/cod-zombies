## MDX Rewrite

- Preview Grids will use a registery for main-quests, side-quests, and zombies to dynamically import only the metadata from
their respective modules. This metadata will then be used to display the preview cards and link to the actual MDX page.

- Pagination will still be implemented on the client-side, we don't need to worry about server-side, since the metadata is small and it allows for instant feeling naviation, in the future we can always use server-side pagination if needed, and with file system I/O it'll also be fast.

- Previous/Next quest/zombies cards will be embedded into the MDX pages themselves as a custom component that you pass the filename of the previous/next quest/zombie
to and the type (main-quest, side-quest, or zombie), in order to dynamic import that module's metadata and display preview cards

- (Relations) Weapons, Perks, Augments, Field Upgrades, Weak Points, Zombie Attacks, Weapon Builds, Ammo Mods and Zombies will have their own registery, but instead of linking to a module, they will directly create an object with the metadata. For example, a weapons module will have a key for each type of weapon and the value of that key will be that weapons metadata. This will allow for easy linking within the MDX page of any weapon, via a component to display that metadata in a nice UI. The same will be done for perks, augments, field upgrades, and zombies. The spawn behavior and combat strategy of zombies will be written in MDX however, and dynamically imported into the zombie's page.

- Table of Contents for MDX pages will be generated via a plugin for MDX like `@mdx-js/remark-toc`