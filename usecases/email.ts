import { env } from "@/env"
import { Resend } from "resend"

export const sendInternalEmailUseCase = async (subject: string, message: string) => {
  const resend = new Resend(env.RESEND_API_KEY)
  await resend.emails.send({
    from: `Cod Zombies Guides <support@codzombiesguides.com>`,
    to: ['anticrebel@gmail.com'],
    subject,
    html: `<p>${ message }</p`
  })
}