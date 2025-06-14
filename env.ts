import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod";

export const env = createEnv({
  server: {
    REVALIDATE_SECRET: z.string().nonempty(),
    CONTENTFUL_SPACE_ID: z.string().nonempty(),
    DRAFT_SECRET: z.string().nonempty(),
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: z.string().nonempty(),
    RESEND_API_KEY: z.string().nonempty(),
    RESEND_AUDIENCE_ID: z.string().nonempty(),
    CONTENTFUL_ACCESS_TOKEN: z.string().nonempty(),
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: z.string().nonempty(),
    PROJECT_PLANNER_ID: z.string().nonempty(),
    CRON_SECRET: z.string().nonempty(),
    REDIS_URL: z.string().url(),
    REDIS_TOKEN: z.string().nonempty(),
    HASH_SALT: z.string().nonempty(),
  },
  client: {
    NEXT_PUBLIC_WEBSITE_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
  }
});