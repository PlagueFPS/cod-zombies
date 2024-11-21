import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";
export interface TypeFeaturedMapsFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    gameCategory: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
    body: EntryFieldTypes.RichText;
}

export type TypeFeaturedMapsSkeleton = EntrySkeletonType<TypeFeaturedMapsFields, "featuredMaps">;
export type TypeFeaturedMaps<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeFeaturedMapsSkeleton, Modifiers, Locales>;

export interface TypeGameCategoryFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Symbol;
    image: EntryFieldTypes.AssetLink;
}

export type TypeGameCategorySkeleton = EntrySkeletonType<TypeGameCategoryFields, "gameCategory">;
export type TypeGameCategory<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeGameCategorySkeleton, Modifiers, Locales>;

export interface TypePerksFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
}

export type TypePerksSkeleton = EntrySkeletonType<TypePerksFields, "perks">;
export type TypePerks<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypePerksSkeleton, Modifiers, Locales>;

export interface TypeGobblegumsFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    rarity: EntryFieldTypes.Symbol<"Classic" | "Epic" | "Legendary" | "Mega" | "Rare" | "Rare-Mega" | "Ultra" | "Ultra-Rare Mega">;
    type?: EntryFieldTypes.Symbol<"Round-Based" | "Time-Based" | "Player-Activated" | "Immediate">;
    game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
}

export type TypeGobblegumsSkeleton = EntrySkeletonType<TypeGobblegumsFields, "gobblegums">;
export type TypeGobblegums<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeGobblegumsSkeleton, Modifiers, Locales>;

export interface TypeFieldUpgradesFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
}

export type TypeFieldUpgradesSkeleton = EntrySkeletonType<TypeFieldUpgradesFields, "fieldUpgrades">;
export type TypeFieldUpgrades<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeFieldUpgradesSkeleton, Modifiers, Locales>;

export interface TypeAmmoModsFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
}

export type TypeAmmoModsSkeleton = EntrySkeletonType<TypeAmmoModsFields, "ammoMods">;
export type TypeAmmoMods<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeAmmoModsSkeleton, Modifiers, Locales>;

export type ZombieItem = Entry<TypeAmmoModsSkeleton, undefined, string> | Entry<TypeFieldUpgradesSkeleton, undefined, string> 
    | Entry<TypeGobblegumsSkeleton, undefined, string> | Entry<TypePerksSkeleton, undefined, string>