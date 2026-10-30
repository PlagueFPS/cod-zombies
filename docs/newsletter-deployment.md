# Deploy newsletter signing

Before deploying this change, configure `NEWSLETTER_TOKEN_SECRET` in each Worker environment that handles newsletter requests. Use 32 cryptographically random bytes encoded as exactly 64 hexadecimal characters. Store the value as a Worker secret, not in `wrangler.jsonc` or source control. Keep the same value across deployments and instances.

For local development, put a separate key in the gitignored `.dev.vars` file. Playwright supplies a dummy key and sets `E2E_MOCK_EMAIL=success`, which prevents newsletter and contact email dispatch during form tests.

Run `bun run typegen -- --include-runtime=false` to regenerate the gitignored Worker environment bindings. Omitting `--include-runtime=false` also generates Worker globals that conflict with DOM types used by the UI tests.

Existing newsletter confirmation links become invalid with this release. Ask users with old links to submit another request. New links expire after one day. Rotating the secret invalidates every outstanding link.

Missing or invalid signing configuration prevents token issuance and verification. Newsletter request forms still acknowledge valid submissions with the same generic response. Check internal logs for `Newsletter request failed` when investigating delivery failures. Layers are provided per request at server boundaries. Contact submissions use only the email layer and do not require this secret.
