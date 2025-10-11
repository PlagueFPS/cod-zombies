import { createEnv } from "@t3-oss/env-nextjs";
import { Schema } from "effect";

export const env = createEnv({
  server: {
    RESEND_API_KEY: Schema.standardSchemaV1(
      Schema.Redacted(Schema.NonEmptyString),
    ),
    RESEND_AUDIENCE_ID: Schema.standardSchemaV1(
      Schema.Redacted(Schema.NonEmptyString),
    ),
    HASH_SALT: Schema.standardSchemaV1(Schema.Redacted(Schema.NonEmptyString)),
    LINEAR_API_KEY: Schema.standardSchemaV1(
      Schema.Redacted(Schema.NonEmptyString),
    ),
    LINEAR_DEFAULT_ASSIGNEE_ID: Schema.standardSchemaV1(
      Schema.Redacted(Schema.NonEmptyString),
    ),
    VERCEL_ENV: Schema.standardSchemaV1(Schema.Redacted(Schema.NonEmptyString)),
    VERCEL_URL: Schema.standardSchemaV1(Schema.Redacted(Schema.NonEmptyString)),
    VERCEL_PROJECT_PRODUCTION_URL: Schema.standardSchemaV1(
      Schema.Redacted(Schema.NonEmptyString),
    ),
  },
  experimental__runtimeEnv: {},
});
