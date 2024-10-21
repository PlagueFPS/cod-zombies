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

export interface TypeItemCategoryFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
}

export type TypeItemCategorySkeleton = EntrySkeletonType<TypeItemCategoryFields, "itemCategory">;
export type TypeItemCategory<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeItemCategorySkeleton, Modifiers, Locales>;

export interface TypeZombieItemsFields {
    title: EntryFieldTypes.Symbol;
    slug: EntryFieldTypes.Symbol;
    category: EntryFieldTypes.EntryLink<TypeItemCategorySkeleton>;
    image: EntryFieldTypes.AssetLink;
    description: EntryFieldTypes.Text;
}

export type TypeZombieItemsSkeleton = EntrySkeletonType<TypeZombieItemsFields, "zombieItems">;
export type TypeZombieItems<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<TypeZombieItemsSkeleton, Modifiers, Locales>;