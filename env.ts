import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod";

export const env = createEnv({
  server: {
    REVALIDATE_SECRET: z.string().min(32),
    CONTENTFUL_SPACE_ID: z.string().min(1),
    DRAFT_SECRET: z.string().min(32),
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    RESEND_AUDIENCE_ID: z.string().min(1),
    CONTENTFUL_ACCESS_TOKEN: z.string().min(1),
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: z.string().min(1),
    PROJECT_PLANNER_ID: z.string().min(1),
    CRON_SECRET: z.string().min(32),
    // KV_URL: z.string().min(1),
    // KV_REST_API_URL: z.string().url(),
    // KV_REST_API_TOKEN: z.string().min(1),
    // KV_REST_API_READ_ONLY_TOKEN: z.string().min(1),
    DATABASE_URL: z.string().url(),
  },
  client: {
    NEXT_PUBLIC_WEBSITE_URL: z.string().url(),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
  }
});