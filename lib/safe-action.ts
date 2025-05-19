import "server-only"
import { createSafeActionClient, DEFAULT_SERVER_ERROR_MESSAGE } from "next-safe-action"
import { z } from "zod"
import { headers } from "next/headers"
import { generateToken, hashIdentifier } from "@/utils/functions"
import { ratelimit } from "./redis"

export class ActionError extends Error {}

export const createAction = createSafeActionClient({
  defineMetadataSchema: () => z.object({
    actionName: z.string(),
  }),
  handleServerError: (error) => {
    console.error(error)

    if (error instanceof ActionError) {
      return error.message
    }

    return DEFAULT_SERVER_ERROR_MESSAGE
  }
})

export const ratelimitAction = createSafeActionClient({
  defineMetadataSchema: () => z.object({
    actionName: z.string(),
  }),
  handleServerError: (error) => {
    console.error(error)

    if (error instanceof ActionError) {
      return error.message
    }

    return DEFAULT_SERVER_ERROR_MESSAGE
  }
}).use(async ({ next }) => {
  const headerList = await headers()
  const ip = headerList.get('x-forwarded-for') || '127.0.0.1'
  const hash = hashIdentifier(ip)

  const { success, reset, remaining } = await ratelimit.limit(hash)
  const timeRemaining = Math.max(0, (reset - Date.now()) / 1000)
  const time = timeRemaining > 60 
    ? `${Math.ceil(timeRemaining / 60)} minutes` 
    : `${Math.ceil(timeRemaining)} seconds`
    
  if (!success) {
    const message = `Too many requests. Please try again in ${time}`
    return next({ ctx: { limited: true, message, remaining }})
  }

  return next({ ctx: { limited: false }})
})