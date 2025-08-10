import { Layer } from "effect"
import { Cache } from "@/lib/services/Cache"
import { CMS } from "@/lib/services/CMS"

export const DataLayer = Layer.mergeAll(Cache.Default, CMS.Default)
