import type { Entry } from "contentful";
import type { TypeFeaturedMapsSkeleton } from "@/contentful/Types/contentful-types";

export interface Map extends Entry<TypeFeaturedMapsSkeleton, undefined, string> {
  hasChanged?: boolean
  isUnpublished?: boolean
}