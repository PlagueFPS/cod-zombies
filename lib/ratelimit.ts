import "server-only"
import { Ratelimit } from "@upstash/ratelimit"
import { kv } from "@vercel/kv"
import { createHash } from "crypto"
import { headers } from "next/headers"

/**
 * 
 * @param amount amount of user requests to allow
 * @param duration duration window in which users can make requests
 */
export const rateLimitByIp = async (amount: number, duration: number) => {
  const ratelimit = new Ratelimit({
    redis: kv,
    limiter: Ratelimit.slidingWindow(amount, `${duration} s`)
  })
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for') ?? "127.0.0.1"

  const hashedIp = createHash('sha256').update(ip).digest('hex')
  const { success, reset } = await ratelimit.limit(hashedIp)
  const retryAfter = reset - Date.now()
  
  return { rateLimited: !success, retryAfter }
}