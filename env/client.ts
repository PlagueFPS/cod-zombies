import { createEnv } from "@t3-oss/env-nextjs"
import { z } from "zod";

export const clientEnv = createEnv({
  client: {
    NEXT_PUBLIC_WEBSITE_URL: z.string().url()
  },
  runtimeEnv: {
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL
  }
});