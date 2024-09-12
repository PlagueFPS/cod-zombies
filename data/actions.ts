"use server"
import { FormState } from "@/types/FormState"
import { ContactFormSchema, ContactGoogleForm, ContactGoogleFormSchema } from "@/utils/validationSchemas"

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
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
  const res = await fetch(`https://docs.google.com/forms/u/0/d/e/1FAIpQLScKL8ybe9YXuG_snRdu-2L--6pGtuSv-RYm7_RmRP11SA_yOw/formResponse`, {
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