"use server"
import { FormState } from "@/types/FormState"
import { ContactFormSchema, ContactGoogleForm, ContactGoogleFormSchema } from "@/types/validationSchemas"

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ContactFormSchema.safeParse(Object.fromEntries(formData))
  if (!validatedFields.success) return {
    success: false,
    message: 'Invalid Fields. Failed to submit form',
    errors: validatedFields.error.flatten().fieldErrors
  }
  try {
    const contactGoogleForm: ContactGoogleForm = {
      "entry.404032380": validatedFields.data.email,
      "entry.1808584294": validatedFields.data.subject,
      "entry.1626527007": validatedFields.data.body,
    }
    const data = ContactGoogleFormSchema.parse(contactGoogleForm)
    const encodedFormData = new URLSearchParams(data).toString()
    await fetch(`https://docs.google.com/forms/u/0/d/e/1FAIpQLScKL8ybe9YXuG_snRdu-2L--6pGtuSv-RYm7_RmRP11SA_yOw/formResponse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: encodedFormData
    })

    return { success: true, message: 'Thank you for submitting! Your submission has been received.' }
  } catch (error) {
    if (error instanceof Error) return { success: false, message: error.message }
    else return {
      success: false,
      message: 'Failed to submit form.'
    }
  }
}