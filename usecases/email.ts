import { env } from "@/env"
import { Resend } from "resend"

interface InternalEmailProps {
  subject: string
  message: string
}

export const sendInternalEmailUseCase = async ({ subject, message }: InternalEmailProps) => {
  const resend = new Resend(env.RESEND_API_KEY)
  await resend.emails.send({
    from: `Cod Zombies Guides <support@codzombiesguides.com>`,
    to: ['codzombiesguidesteam@gmail.com'],
    subject,
    html: `<p>${ message }</p>`
  })
}