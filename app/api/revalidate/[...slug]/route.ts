import { env } from "@/env";
import { RevalidationError, SchemaValidationError } from "@/types/Error";
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
    const authResult = authorizedRequest(secret, env.REVALIDATE_SECRET)

    if (authResult.isErr()) {
      console.error(authResult.error)
      return Response.json(authResult.error.message, { status: 401 })
    }
  
    const payload = await payloadPromise
    const body = RevalidateWebhookBodySchema.safeParse(payload)
    if (!body.success) {
      const error = new SchemaValidationError(`Invalid Payload Body`, { cause: body.error.flatten().fieldErrors })
      console.error(error)
      return Response.json(error.message, { status: 400 })
    }
  
    const slugResult = AllowedSlugsSchema.safeParse(slug[0])
    if (!slugResult.success) {
      const error = new SchemaValidationError(`Invalid Params`, { cause: slugResult.error.flatten().fieldErrors })
      console.error(error)
      return Response.json(error.message, { status: 400 })
    }
  
    const handler = RevalidateHandlers[slugResult.data]
    return handler(body.data)
  } catch(e) {
    const error = new RevalidationError(`Revalidation Error`, { cause: e })
    console.error(error)
    return Response.json(error.message, { status: 500 })
  }
}