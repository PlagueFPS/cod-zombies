import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_WEBSITE_URL: z.string().url(),
  NEXT_PUBLIC_ENVIRONMENT: z.string(),
  CONTENTFUL_ENVIRONMENT: z.string(),
  CONTENTFUL_SPACE_ID: z.string(),
  CONTENTFUL_HOSTNAME: z.string().optional(),
  CONTENTFUL_ACCESS_TOKEN: z.string().optional(),
  CONTENTFUL_PREVIEW_HOSTNAME: z.string(),
  CONTENTFUL_PREVIEW_ACCESS_TOKEN: z.string(),
  REVALIDATE_SECRET: z.string(),
})

const parsedEnv = envSchema.safeParse(process.env)
const errorMessage = 'Invalid Environment Variables. Be sure to not reference this object in a client boundary, instead import `clientEnv` to use environment variables on the client'

if (!parsedEnv.success) {
  console.error(errorMessage, parsedEnv.error.format())
  throw new Error(errorMessage)
}

export const env = parsedEnv.data