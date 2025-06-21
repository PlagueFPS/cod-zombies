import { SchemaValidationError } from "@/types/Error"
import { OGParamsSchema } from "@/utils/validationSchemas"
import type { NextRequest } from "next/server"
import MapOpenGraphImage from "@/app/(main)/[game]/[slug]/opengraph-image"
import SideQuestOpenGraphImage from "@/app/(main)/side-quests/[game]/[map]/[slug]/opengraph-image"
import ZombieOpenGraphImage from "@/app/(main)/bestiary/[slug]/opengraph-image"
import type { ImageResponse } from "next/og"

interface RouteParams {
  params: Promise<{ slug: string[] }>
}

export async function GET(_: NextRequest, { params }: RouteParams) {
  const result = OGParamsSchema.safeParse(params)
  if (!result.success) {
    const error = new SchemaValidationError(`Invalid Params`, { cause: result.error.flatten().fieldErrors })
    console.error(error)
    return Response.json(error.message, { status: 400 })
  }

  const { slug } = await result.data
  const type = slug[0]
  const entrySlug = slug[1]
  const newParams: Promise<{ slug: string }> = new Promise((resolve) => resolve({ slug: entrySlug }))
  let response: ImageResponse | null = null

  switch(type) {
    case "maps":
      response = await MapOpenGraphImage({ params: newParams })
      break
    case "side-quests":
      response = await SideQuestOpenGraphImage({ params: newParams })
      break
    case "zombies":
      response = await ZombieOpenGraphImage({ params: newParams })
      break
    default:
      return new Response('Not Found', { status: 404 })
  }

  if (!response || !response.ok) return new Response('Invalid Request', { status: 400 })
  return response
}