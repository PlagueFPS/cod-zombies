import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod";

export const serverEnv = createEnv({
  server: {
    REVALIDATE_SECRET: z.string().min(32),
    CONTENTFUL_SPACE_ID: z.string().min(1),
    DRAFT_SECRET: z.string().min(32),
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    RESEND_AUDIENCE_ID: z.string().min(1),
    CONTENTFUL_ACCESS_TOKEN: z.string().min(1),
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: z.string().min(1),
    GOOGLE_FORM_ENDPOINT: z.string().url(),
  },
  experimental__runtimeEnv: process.env
});