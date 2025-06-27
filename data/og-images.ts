import 'server-only'
import { env } from '@/env'
import { Config, Effect, Redacted } from 'effect'
import { FetchHttpClient, HttpClient } from '@effect/platform'

type AllowedFonts = "Geist-Bold.otf" | "Geist-SemiBold.otf"

const getFontData = (font: AllowedFonts) => Effect.gen(function*(){
  const httpClient = yield* HttpClient.HttpClient
  const automationBypassSecret = yield* Config.redacted("VERCEL_AUTOMATION_BYPASS_SECRET")
  const baseURL = yield* Config.string("VERCEL_URL").pipe(Effect.catchAll(() => Effect.succeed(env.NEXT_PUBLIC_WEBSITE_URL)))

  const response = yield* httpClient.get(`${baseURL}/fonts/${font}`, {
    headers: {
      'x-vercel-protection-bypass': Redacted.value(automationBypassSecret)
    }
  })

  return yield* response.arrayBuffer
}).pipe(Effect.withLogSpan("get_font_data"))

export const loadFonts = Effect.gen(function*(){
  const [boldFont, semiBoldFont] = yield* Effect.all([
    getFontData("Geist-Bold.otf"),
    getFontData("Geist-SemiBold.otf")
  ], { concurrency: "unbounded" })

  return { boldFont, semiBoldFont }
}).pipe(
  Effect.withLogSpan("load_fonts"),
  Effect.tapError(Effect.logError),
  Effect.catchAll(() => Effect.succeed(null)),
  Effect.provide(FetchHttpClient.layer),
  Effect.runPromise
)