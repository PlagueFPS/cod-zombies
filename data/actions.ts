"use server"
import type { FeedbackFormState, NewsletterFormState } from "@/types/FormStates"
import { FeedbackFormSchema, NewsletterFormSchema } from "@/utils/validationSchemas"
import { Resend } from 'resend'
import { env } from "@/env"

export async function subscribeToNewsletter(prevState: NewsletterFormState, formData: FormData): Promise<NewsletterFormState> {
  const validatedFields = NewsletterFormSchema.safeParse(Object.fromEntries(formData))
  if (!validatedFields.success) return {
    success: false,
    message: 'Invalid Email. Failed to subscribe to newsletter',
    errors: validatedFields.error.flatten().fieldErrors
  }

  const resend = new Resend(env.RESEND_API_KEY)
  const { email } = validatedFields.data
  
  const { data, error } = await resend.contacts.list({ audienceId: env.RESEND_AUDIENCE_ID })
  if (error || !data) {
    console.error(error?.message)
    return {
      success: false,
      message: "Something Went Wrong! Please Try Again.",
    }
  }
  
  const contact = data.data.find(contact => contact.email === email)
  if (contact) return {
    success: false,
    message: 'That email has already subscribed!'
  }

  
  const { error: createError } = await resend.contacts.create({
    email: email,
    audienceId: env.RESEND_AUDIENCE_ID 
  })
  if (createError) {
    console.error(createError.message)
    return {
      success: false,
      message: 'Failed to Subscribe! Please Try Again.'
    }
  }

  return {
    success: true,
    message: 'Thank You For Subscribing!'
  }
}

export async function submitFeedbackForm(prevState: FeedbackFormState, formData: FormData): Promise<FeedbackFormState> {
  const validatedFields = FeedbackFormSchema.safeParse(Object.fromEntries(formData))
  if (!validatedFields.success) return {
    success: false,
    message: 'Invalid Fields. Failed to submit form',
    errors: validatedFields.error.flatten().fieldErrors
  }
  
  const res = await fetch("https://projectplannerai.com/api/feedback", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      projectId: env.PROJECT_PLANNER_ID,
      title: validatedFields.data.title,
      name: validatedFields.data.name,
      email: validatedFields.data.email,
      label: validatedFields.data.label,
      feedback: validatedFields.data.feedback,
    }),
  })
  
  if (!res.ok) return {
    success: false,
    message: 'Something Went Wrong! Failed to submit form',
  }

  return { success: true, message: 'Thank you for submitting! Your submission has been received' }
}