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