"use server"
import { revalidateTag } from "next/cache"
import { FormState } from "@/types/FormState"
import { ContactFormSchema, ContactGoogleForm, ContactGoogleFormSchema } from "@/types/validationSchemas"

// THIS SERVER ACTION IS ONLY FOR UPDATING CACHED DATA
// IN A DEVELOPMENT ENVIRONMENT, PRODUCTION DATA WILL BE
// REVALIDATED VIA A CONTENTFUL WEBHOOK at /api/revalidate
// THIS IS ONLY NEEDED SINCE UNSTABLE_CACHE IS STILL IN BETA
export async function updateData() {
  if (process.env.NEXT_PUBLIC_ENVIRONMENT === 'development') {
    console.log('Revalidating data...')
    revalidateTag('maps')
    revalidateTag('categories')
    console.log('Maps and Categories Revalidated')
  }
}

export async function submitContactForm(prevState: FormState, formData: FormData): Promise<FormState> {
  const validatedFields = ContactFormSchema.safeParse(Object.fromEntries(formData))
  if (!validatedFields.success) return {
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

    return { message: 'Thank you for submitting! Your submission has been received.' }
  } catch (error) {
    if (error instanceof Error) return { message: error.message }
    else return {
      message: 'Failed to submit form.'
    }
  }
}