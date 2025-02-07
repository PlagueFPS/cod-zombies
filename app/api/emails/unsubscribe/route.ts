import { env } from "@/env";
import { getContactById } from "@/usecases/email";
import { unsubscribeEmailUseCase } from "@/usecases/newsletter";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const contactId = req.nextUrl.searchParams.get("contactId")
  if (!contactId) return new Response("Invalid Request", { status: 400 })

  const { contact } = await getContactById(contactId)
  if (!contact) return new Response("Contact does not exist", { status: 404 })

  return Response.redirect(`${env.NEXT_PUBLIC_WEBSITE_URL}/unsubscribe?token=${contact.id}&email=${contact.email}`, 200)
}

export async function POST(req: NextRequest) {
  const contactId = req.nextUrl.searchParams.get("contactId")
  if (!contactId) return new Response("Invalid Request", { status: 400 })

  const { contact } = await getContactById(contactId)
  if (!contact) return new Response("Contact does not exist", { status: 404 })
  
  const { success, message } = await unsubscribeEmailUseCase(contact.email)
  if (!success) return new Response(message, { status: 400 })
  
  return new Response(message, { status: 202 })
}