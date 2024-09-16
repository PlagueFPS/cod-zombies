"use server"
import type { ContactFormState, NewsletterFormState } from "@/types/FormStates"
import { ContactFormSchema, ContactGoogleForm, ContactGoogleFormSchema, NewsletterFormSchema } from "@/utils/validationSchemas"
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

export async function submitContactForm(prevState: ContactFormState, formData: FormData): Promise<ContactFormState> {
  const validatedFields = ContactFormSchema.safeParse(Object.fromEntries(formData))
  if (!validatedFields.success) return {
    success: false,
    message: 'Invalid Fields. Failed to submit form',
    errors: validatedFields.error.flatten().fieldErrors
  }

  const contactGoogleForm: ContactGoogleForm = {
    "entry.404032380": validatedFields.data.email,
    "entry.1808584294": validatedFields.data.subject,
    "entry.1626527007": validatedFields.data.body
  }
  const { data, success } = ContactGoogleFormSchema.safeParse(contactGoogleForm)
  if (!success) return {
    success: false,
    message: 'Invalid Data. Failed to submit form',
  }

  const encodedFormData = new URLSearchParams(data).toString()
  const res = await fetch(env.GOOGLE_FORM_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: encodedFormData
  })
  if (!res.ok) return {
    success: false,
    message: 'Something Went Wrong! Failed to submit form',
  }

  return { success: true, message: 'Thank you for submitting! Your submission has been received' }
}