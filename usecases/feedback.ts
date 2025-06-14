import "server-only"
import { env } from "@/env"
import type { FeedbackForm } from "@/utils/validationSchemas"
import { sendInternalEmail } from "./email"
import { after } from "next/server"
import { tryCatch } from "@/utils/functions"
import { err, ok, Result } from "neverthrow"
import { FetchError } from "@/types/Error"

interface Input extends FeedbackForm {
  title?: string
  label?: "idea" | "issue" | "question" | "complaint" | "featureRequest" | "other"
}

interface Feedback {
  message: string
}

export const submitFeedbackUseCase = async (input: Input): Promise<Result<Feedback, FetchError>> => {
  const { title, label, feedback } = input
  const { data: res, error } = await tryCatch(fetch("https://projectplannerai.com/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId: env.PROJECT_PLANNER_ID,
      title: title ?? "Website Feedback",
      label: label ?? "other",
      feedback,
    }),
  }))

  if (!res?.ok || error) return err(new FetchError(
    "Failed to submit feedback due to a technical issue on our end. Please try again.", 
    { cause: error }
  ))

  after(async () => {
    await sendInternalEmail({
      subject: `New Feedback Submission`,
      message: `You have a new feedback submission that needs review.`
    })
  })
  return ok({ message: 'Thank you for submitting! Your submission has been received' })
}