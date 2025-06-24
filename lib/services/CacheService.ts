import { Effect } from "effect";
import { redis } from "../redis";
import { CacheProviderError } from "@/types/Error";


export class CacheService extends Effect.Service<CacheService>()("CacheService", {
  effect: Effect.gen(function*() {
    return {
      hget<T>(key: string, value: string) {
        return Effect.gen(function*() {
          const response = yield* Effect.tryPromise({
            try: () => redis.hget<T>(key, value),
            catch: (error) => new CacheProviderError({ 
              message: "Failed to get cached value",
              cause: error 
            })
          })

          if (!response) return yield* Effect.succeed(null)

          return response
        })
      },
      hgetall(key: string) {
        return Effect.gen(function*() {
          const response = yield* Effect.tryPromise({
            try: () => redis.hgetall(key),
            catch: (error) => new CacheProviderError({ 
              message: "Failed to get cached value",
              cause: error 
            })
          })

          if (!response) return yield* Effect.succeed({})

          return response
        })
      },
      hset(key: string, kv: Record<string, string>) {
        return Effect.tryPromise({
          try: () => redis.hset(key, kv),
          catch: (error) => new CacheProviderError({ 
            message: "Failed to set cached value",
            cause: error 
          })
        })
      },
      hdel(key: string, value: string[]) {
        return Effect.tryPromise({
          try: () => redis.hdel(key, ...value),
          catch: (error) => new CacheProviderError({ 
            message: "Failed to delete cached value",
            cause: error 
          })
        })
      }
    }
  })
}) {}