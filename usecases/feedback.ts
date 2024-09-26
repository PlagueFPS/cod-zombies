import { env } from "@/env"
import type { FeedbackForm } from "@/utils/validationSchemas"

export const submitFeedbackUseCase = async (input: FeedbackForm) => {
  const { title, name, email, label, feedback } = input
  const res = await fetch("https://projectplannerai.com/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId: env.PROJECT_PLANNER_ID,
      title,
      name,
      email,
      label,
      feedback,
    }),
  })
  
  if (!res.ok) return {
    success: false,
    message: 'Something Went Wrong! Failed to submit form',
  }

  return { success: true, message: 'Thank you for submitting! Your submission has been received' }
}