import { createEnv } from "@t3-oss/env-nextjs"
import { Schema } from "effect";

export const env = createEnv({
  server: {
    REVALIDATE_SECRET: Schema.standardSchemaV1(Schema.NonEmptyString),
    CONTENTFUL_SPACE_ID: Schema.standardSchemaV1(Schema.NonEmptyString),
    DRAFT_SECRET: Schema.standardSchemaV1(Schema.NonEmptyString),
    CONTENTFUL_MANAGEMENT_ACCESS_TOKEN: Schema.standardSchemaV1(Schema.NonEmptyString),
    RESEND_API_KEY: Schema.standardSchemaV1(Schema.NonEmptyString),
    RESEND_AUDIENCE_ID: Schema.standardSchemaV1(Schema.NonEmptyString),
    CONTENTFUL_ACCESS_TOKEN: Schema.standardSchemaV1(Schema.NonEmptyString),
    CONTENTFUL_PREVIEW_ACCESS_TOKEN: Schema.standardSchemaV1(Schema.NonEmptyString),
    PROJECT_PLANNER_ID: Schema.standardSchemaV1(Schema.NonEmptyString),
    CRON_SECRET: Schema.standardSchemaV1(Schema.NonEmptyString),
    REDIS_URL: Schema.standardSchemaV1(Schema.URL),
    REDIS_TOKEN: Schema.standardSchemaV1(Schema.NonEmptyString),
    HASH_SALT: Schema.standardSchemaV1(Schema.NonEmptyString),
  },
  client: {
    NEXT_PUBLIC_WEBSITE_URL: Schema.standardSchemaV1(Schema.URL),
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_WEBSITE_URL: process.env.NEXT_PUBLIC_WEBSITE_URL,
  },
});