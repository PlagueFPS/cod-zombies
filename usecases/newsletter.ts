import "server-only"
import { Resend } from 'resend'
import { env } from '@/env'
import { unstable_after } from "next/server"

export const subscribeEmailUseCase = async (email: string) => {
  const resend = new Resend(env.RESEND_API_KEY)
  const { data: contacts, error } = await resend.contacts.list({ audienceId: env.RESEND_AUDIENCE_ID })

  if (error || !contacts) {
    console.error(error?.message)
    return {
      success: false,
      message: "Something Went Wrong! Please Try Again.",
    }
  }

  unstable_after(() => {
    const unsubscribedContacts = contacts.data.filter(contact => contact.unsubscribed)
    if (unsubscribedContacts.length > 0) {
      unsubscribedContacts.forEach(async (contact) => {
        const { error: removeError } = await resend.contacts.remove({ 
          audienceId: env.RESEND_AUDIENCE_ID, 
          id: contact.id 
        })

        if (removeError) {
          console.error(removeError.message)
        }
      })
    }
  })
  
  const contact = contacts.data.find(contact => contact.email === email)
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