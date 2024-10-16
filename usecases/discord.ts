import { env } from "@/env";
import type { FeaturedMap } from "@/types/FeaturedMap";

export const sendDiscordMessageUseCase = async (map: FeaturedMap, createdAt: string) => {
  try {
    const res = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: `<@&1296066655226433607> ${map.title} Guide Release!`,
        embeds: [
          {
            title: map.title,
            description: map.description,
            url: `${env.NEXT_PUBLIC_WEBSITE_URL}/${map.category.slug}/${map.slug}`,
            color: 15364108,
            image: {
              url: `https:${map.image.url}?fm=jpg`,
            },
            fields: [
              {
                name: "Category",
                value: `[${map.category.title}](${env.NEXT_PUBLIC_WEBSITE_URL}/${map.category.slug})`,
                inline: true
              },
            ],
            timestamp: new Date(createdAt).toISOString(),
            footer: {
              text: "Provided by Call of Duty: Zombies Guides"
            }
          },
        ],
      }),
    })

    if (!res.ok) return {
      error: {
        message: "Failed to send message to Discord"
      }
    }

    return {
      error: null
    }
  } catch (error) {
    console.error(error)
    return {
      error
    }
  }
}
