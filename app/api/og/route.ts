import MapOpenGraphImage from "@/app/(main)/[game]/[slug]/opengraph-image"
import SideQuestOpenGraphImage from "@/app/(main)/side-quests/[game]/[map]/[slug]/opengraph-image"
import ZombieOpenGraphImage from "@/app/(main)/bestiary/[slug]/opengraph-image"
import { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")
  const type = request.nextUrl.searchParams.get("type")

  if (!slug || !type) return new Response('Invalid Request', { status: 400 })

  switch(type) {
    case "map":
      const response = await MapOpenGraphImage({ params:  new Promise((resolve) => resolve({ slug }))})
      if (!response || !response.ok) return new Response('Invalid Request', { status: 400 })
      return response
    case "side-quest":
      const sideQuestResponse = await SideQuestOpenGraphImage({ params: new Promise((resolve) => resolve({ slug })) })
      if (!sideQuestResponse || !sideQuestResponse.ok) return new Response('Invalid Request', { status: 400 })
      return sideQuestResponse
    case "zombie":
      const zombieResponse = await ZombieOpenGraphImage({ params: new Promise((resolve) => resolve({ slug })) })
      if (!zombieResponse || !zombieResponse.ok) return new Response('Invalid Request', { status: 400 })
      return zombieResponse
    default:
      return new Response('Not Found', { status: 404 })
  }
}