import { serverEnv } from "@/env/server";
import { ContentfulWebhookBodySchema } from "@/utils/validationSchemas";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { Resend, CreateBatchOptions } from "resend";

export async function POST(req: NextRequest) {
  const headersList = headers()
  const secret = headersList.get('X-Contentful-Newsletter-Secret')

  if (secret !== serverEnv.NEWSLETTER_SECRET) {
    return Response.json({ emailSent: false, message: 'Unauthorized Request' }, { status: 401 })
  }

  const bodyValidation = ContentfulWebhookBodySchema.safeParse(await req.json())
  if (!bodyValidation.success) {
    return Response.json({ emailSent: false, message: 'Invalid Request Body' }, { status: 400 })
  }

  const { version } = bodyValidation.data
  if (version !== 2) {
    return Response.json({ emailSent: false, message: 'Entry is not new so no email will be sent' }, { status: 204 })
  }

  const resend = new Resend(serverEnv.RESEND_API_KEY)
  const { data: contacts, error } = await resend.contacts.list({ audienceId: serverEnv.RESEND_AUDIENCE_ID })
  if (error || !contacts) {
    return Response.json({ emailSent: false, message: error?.message, error: error?.name }, { status: 500 })
  }

  const emails: CreateBatchOptions = []
  contacts.data.forEach(contact => {
    emails.push({
      from: 'Team@codzombiesguides.com',
      to: [contact.email],
      subject: 'New Guide Release',
      html: '<p>it works</p>'
    })
  })

  const { error: batchError } = await resend.batch.send(emails)
  if (batchError) {
    return Response.json({ emailSent: false, message: batchError.message, error: batchError.name }, { status: 500 })
  }

  return Response.json({ emailSent: true, message: 'Successfully sent batch emails to audience' }, { status: 201 })
}