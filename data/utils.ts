import { Layer } from "effect"
import { Cache } from "@/lib/services/Cache"
import { Payload } from "@/lib/services/Payload"

export const DataLayer = Layer.merge(Cache.Default, Payload.Default)
