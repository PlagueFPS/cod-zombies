import { describe, it, expect, vi } from "vitest"
import * as emails from "@/usecases/email"
import { Effect } from "effect"
import { EmailServiceMock } from "@/lib/services/EmailService"

vi.mock("@/env", () => ({
  env: {
    RESEND_AUDIENCE_ID: "test-audience-id",
    RESEND_API_KEY: "test-api-key",
    NEXT_PUBLIC_WEBSITE_URL: "http://localhost:300",
  }
}))

describe("Email Use Cases", () => {
  describe("requestSubscribe", () => {
    it("should send a confirmation email for new subscribers", async () => {
      const email = "test@example.com"
      const result = await emails.requestSubscribe(email).pipe(Effect.provide(EmailServiceMock), Effect.runPromise)
      expect(result).toStrictEqual({ success: true, message: "Confirmation email sent! Check your inbox." })
    })
  })
})