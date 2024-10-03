import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"

/**
 * 
 * @param amount amount of user requests to allow
 * @param duration duration window in which users can make requests
 */
export const rateLimitByIp = async (ip: string, amount: number, duration: number) => {
  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(amount, `${duration} s`)
  })
  const { success, reset } = await ratelimit.limit(ip)
  const retryAfter = reset - Date.now()
  return { rateLimited: !success, retryAfter }
}