import { Effect } from "effect";
import { redis } from "../redis";
import { CacheProviderError } from "@/types/Error";


export class Cache extends Effect.Service<Cache>()("Cache", {
  effect: Effect.gen(function*() {
    const hget = (key: string, value: string) => Effect.tryPromise({
      try: () => redis.hget(key, value),
      catch: (error) => new CacheProviderError({ 
        message: `Failed to get value for key: ${key}`,
        cause: error 
      })
    })
    const hgetall = (key: string) => Effect.tryPromise({
      try: () => redis.hgetall(key),
      catch: (error) => new CacheProviderError({ 
        message: `Failed to get all values for key: ${key}`,
        cause: error 
      })
    })
    const hset = (key: string, kv: Record<string, string>) => Effect.tryPromise({
      try: () => redis.hset(key, kv),
      catch: (error) => new CacheProviderError({ 
        message: `Failed to set value for key: ${key}`,
        cause: error 
      })
    })
    const hdel = (key: string, value: string[]) => Effect.tryPromise({
      try: () => redis.hdel(key, ...value),
      catch: (error) => new CacheProviderError({ 
        message: `Failed to delete value for key: ${key}`,
        cause: error 
      })
    })

    return { hget, hgetall, hset, hdel } as const
  })
}) {}