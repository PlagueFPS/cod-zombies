import { env } from "@/env";
import { authorizedRequest } from "@/utils/functions";
import { RevalidateHandlers } from "@/utils/revalidation-handlers";
import { AllowedSlugsSchema, RevalidateWebhookBodySchema } from "@/utils/validationSchemas";
import { headers } from "next/headers";
import type { NextRequest } from "next/server";

interface RouteParams {
  params: Promise<{ slug: string[] }>
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const [{ slug }, headerList] = await Promise.all([params, headers()])
    const secret = headerList.get('X-Contentful-Revalidate-Secret') || ''
    const payloadPromise = req.json()
  
    if (!authorizedRequest(secret, env.REVALIDATE_SECRET)) {
      return new Response("Unauthorized Request", { status: 401 })
    }
  
    const payload = await payloadPromise
    const body = RevalidateWebhookBodySchema.safeParse(payload)
    if (!body.success) {
      return new Response(`Invalid Payload Body: ${body.error.flatten().fieldErrors}`, { status: 400 })
    }
  
    const slugResult = AllowedSlugsSchema.safeParse(slug[0])
    if (!slugResult.success) return new Response(`Invalid Params: ${slugResult.error.flatten().fieldErrors}`, { status: 400 })
  
    const handler = RevalidateHandlers[slugResult.data]
    return handler(body.data)
  } catch(error) {
    console.error(`Revalidation Error:`, error)
    return new Response(`Internal Server Error`, { status: 500 })
  }
}