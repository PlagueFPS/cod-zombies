import "server-only"
import { env } from "@/env"
import type { FeedbackForm } from "@/utils/validationSchemas"
import { sendInternalEmailUseCase } from "./email"
import { after } from "next/server"
import { tryCatch } from "@/utils/functions"

export const submitFeedbackUseCase = async (input: FeedbackForm) => {
  const { feedback } = input
  const { data: res, error } = await tryCatch(fetch("https://projectplannerai.com/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId: env.PROJECT_PLANNER_ID,
      feedback,
    }),
  }))

  if (!res?.ok || error) return {
    success: false,
    message: 'Something Went Wrong! Failed to submit form',
  }

  after(async () => {
    await sendInternalEmailUseCase({
      subject: `New Feedback Submission`,
      message: `You have a new feedback submission that needs review.`
    })
  })
  return { success: true, message: 'Thank you for submitting! Your submission has been received' }
}