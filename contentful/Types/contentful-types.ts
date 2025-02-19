import type { ChainModifiers, Entry, EntryFieldTypes, EntrySkeletonType, LocaleCode } from "contentful";

export interface TypeAmmoModsFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
}

export type TypeAmmoModsSkeleton = EntrySkeletonType<TypeAmmoModsFields, "ammoMods">;
export type TypeAmmoMods<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeAmmoModsSkeleton, Modifiers, Locales>;

export interface TypeFeaturedMapsFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    releaseDate: EntryFieldTypes.Date;
    isComingSoon?: EntryFieldTypes.Boolean;
    difficulty: EntryFieldTypes.Symbol<"Easy" | "Hard" | "Medium">;
    timeToRead: EntryFieldTypes.Integer;
    gameCategory: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
    body: EntryFieldTypes.RichText;
}

export type TypeFeaturedMapsSkeleton = EntrySkeletonType<TypeFeaturedMapsFields, "featuredMaps">;
export type TypeFeaturedMaps<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeFeaturedMapsSkeleton, Modifiers, Locales>;

export interface TypeFieldUpgradesFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
}

export type TypeFieldUpgradesSkeleton = EntrySkeletonType<TypeFieldUpgradesFields, "fieldUpgrades">;
export type TypeFieldUpgrades<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeFieldUpgradesSkeleton, Modifiers, Locales>;

export interface TypeGameCategoryFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    releaseDate: EntryFieldTypes.Date;
    description: EntryFieldTypes.Symbol;
    image: EntryFieldTypes.AssetLink;
}

export type TypeGameCategorySkeleton = EntrySkeletonType<TypeGameCategoryFields, "gameCategory">;
export type TypeGameCategory<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeGameCategorySkeleton, Modifiers, Locales>;

export interface TypeGobblegumsFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    rarity: EntryFieldTypes.Symbol<"Classic" | "Epic" | "Legendary" | "Mega" | "Rare" | "Rare-Mega" | "Ultra" | "Ultra-Rare Mega">;
    type?: EntryFieldTypes.Symbol<"Immediate" | "Player-Activated" | "Round-Based" | "Time-Based">;
    game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
}

export type TypeGobblegumsSkeleton = EntrySkeletonType<TypeGobblegumsFields, "gobblegums">;
export type TypeGobblegums<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeGobblegumsSkeleton, Modifiers, Locales>;

export interface TypePerksFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
}

export type TypePerksSkeleton = EntrySkeletonType<TypePerksFields, "perks">;
export type TypePerks<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypePerksSkeleton, Modifiers, Locales>;

export interface TypeSideQuestsFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    timeToRead: EntryFieldTypes.Integer;
    game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>;
    map: EntryFieldTypes.EntryLink<TypeFeaturedMapsSkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
    content: EntryFieldTypes.RichText;
}

export type TypeSideQuestsSkeleton = EntrySkeletonType<TypeSideQuestsFields, "sideQuests">;
export type TypeSideQuests<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeSideQuestsSkeleton, Modifiers, Locales>;

export interface TypeZombiesFields {
    name: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    description: EntryFieldTypes.Symbol;
    image: EntryFieldTypes.AssetLink;
    type: EntryFieldTypes.Symbol<"Boss" | "Elite" | "Normal" | "Special">;
    games: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>>;
    weaknesses?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAmmoModsSkeleton>>;
    weakPoints: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    speed: EntryFieldTypes.Symbol<"Fast" | "Medium" | "Slow">;
    spawnBehavior: EntryFieldTypes.Symbol;
    attacks: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    baseHealth: EntryFieldTypes.Integer;
    doesHealthScale: EntryFieldTypes.Boolean;
    combatStrategy: EntryFieldTypes.RichText;
}

export type TypeZombiesSkeleton = EntrySkeletonType<TypeZombiesFields, "zombies">;
export type TypeZombies<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeZombiesSkeleton, Modifiers, Locales>;