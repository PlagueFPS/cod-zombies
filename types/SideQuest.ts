import type { Document } from "@contentful/rich-text-types";

export interface SideQuest {
  id: string;
  updatedAt: `${number}-${number}-${number}T${number}:${number}:${number}Z`;
  slug: string;
  title: string;
  description: string;
  content: Document;
  image: {
      url: string | undefined;
      width: number | undefined;
      height: number | undefined;
  };
  game: {
    title: string
    slug: string
  };
  map: {
    title: string
    slug: string
  };
  isDraft: boolean;
  isChanged: boolean;
}