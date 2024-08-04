import type { Asset } from "contentful";
import type { GameCategory } from "./GameCategory";

export interface Game {
  slug: GameCategory
  title: string
  image: Asset<undefined, string> | undefined
}