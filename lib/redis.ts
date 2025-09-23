import "server-only"
import { createHash } from "node:crypto"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { Duration, Redacted } from "effect"
import { headers } from "next/headers"
import { after } from "next/server"
import { env } from "@/env"
import { RatelimitExceededError } from "@/types/errors"

export const redis = new Redis({
	url: Redacted.value(env.REDIS_URL),
	token: Redacted.value(env.REDIS_TOKEN),
})

export const ratelimit = new Ratelimit({
	redis,
	limiter: Ratelimit.tokenBucket(5, "1m", 10),
	analytics: true,
	enableProtection: true,
})

export const checkRatelimit = async () => {
	const headerList = await headers()
	const ip = headerList.get("x-forwarded-for") || "127.0.0.1"
	const userAgent = headerList.get("user-agent")
	const identifier = createHash("sha256").update(`${ip}:${userAgent}`).digest("hex")
	const { success, pending, reason, reset } = await ratelimit.limit(identifier, { ip })

	after(async () => await pending)

	if (!success) {
		const resetTime = new Date(reset).getTime()
		const remainingTime = Duration.subtract(resetTime, Date.now()).pipe(Duration.toMillis)

		const error = new RatelimitExceededError({
			message: `Too many requests. Please try again in ${remainingTime}ms`,
			cause: reason,
		})

		console.error(error)

		return {
			success: false,
			message: error.message,
		}
	}

	return { success }
}
