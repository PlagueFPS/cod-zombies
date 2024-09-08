import type { Asset, Entry } from "contentful";
import type { TypeFeaturedMapsSkeleton, TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types";
import type { Document } from "@contentful/rich-text-types"
export interface Map extends Omit<Entry<TypeFeaturedMapsSkeleton, undefined, string>, "fields"> {
  fields: {
    image: Asset<undefined, string> | undefined;
    gameCategory: Entry<TypeGameCategorySkeleton, undefined, string> | undefined;
    title: string;
    slug: string;
    description: string;
    body: Document;
  }
  hasChanged?: boolean
  isUnpublished?: boolean
}