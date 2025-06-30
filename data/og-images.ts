import 'server-only'
import { env } from '@/env'
import { Effect, Redacted, Schedule } from 'effect'
import { IN_DEVELOPMENT } from '@/utils/constants'
import { FetchHttpClient, HttpClient } from '@effect/platform'

export const getFontData = Effect.gen(function*(){
  const httpClient = (yield* HttpClient.HttpClient).pipe(HttpClient.retryTransient({
    times: 5,
    schedule: Schedule.exponential("200 millis"),
  }), HttpClient.filterStatusOk)
  
  const automationBypassSecret = Redacted.make(env.VERCEL_AUTOMATION_BYPASS_SECRET)
  const baseURL = IN_DEVELOPMENT ? env.NEXT_PUBLIC_WEBSITE_URL : `https://${env.VERCEL_URL}`

  const [boldFont, semiBoldFont] = yield* Effect.all([
    httpClient.get(`${baseURL}/fonts/Geist-Bold.otf`, {
      headers: {
        'x-vercel-protection-bypass': Redacted.value(automationBypassSecret)
      }
    }).pipe(Effect.flatMap(response => response.arrayBuffer)),
    httpClient.get(`${baseURL}/fonts/Geist-SemiBold.otf`, {
      headers: {
        'x-vercel-protection-bypass': Redacted.value(automationBypassSecret)
      }
    }).pipe(Effect.flatMap(response => response.arrayBuffer))
  ], { concurrency: "unbounded" })

  return { boldFont, semiBoldFont }
}).pipe(
  Effect.withLogSpan("get_font_data"),
  Effect.tapError(Effect.logError),
  Effect.catchAll(() => Effect.succeed(null)),
  Effect.provide(FetchHttpClient.layer),
  Effect.runPromise
)