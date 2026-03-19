# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This is a **Next.js 16** content-driven website ("Call of Duty: Zombies Guides") using **Bun** as runtime/package manager. No database or Docker required — all content is static MDX/TypeScript files.

### Key commands

| Task | Command |
|---|---|
| Install deps | `bun install` |
| Dev server | `bun run dev` (starts on port 3000) |
| Lint | `bun run lint` (Biome) |
| Test | `bun run test` (Vitest, 24 tests) |
| Build | `bun run build` |
| Email preview | `bun run email` |

### Environment variables

The dev server **will not start** without all 10 server-side env vars defined (validated by `@t3-oss/env-nextjs` + Effect schemas in `env.ts`). A `.env.local` file with dummy values is sufficient for local browsing/development. Required vars:

- `RESEND_API_KEY`, `RESEND_AUDIENCE_ID` — email service (Resend)
- `HASH_SALT` — newsletter token salt
- `LINEAR_API_KEY`, `LINEAR_WORKSPACE`, `LINEAR_USER_FEEDBACK_LABEL` (must be valid UUID), `LINEAR_DEFAULT_ASSIGNEE_ID` — feedback issue tracking (Linear)
- `VERCEL_ENV` — must be `development`, `preview`, or `production`
- `VERCEL_URL`, `VERCEL_PROJECT_PRODUCTION_URL` — deployment URLs

### Gotchas

- The workspace rule `.cursor/rules/use-bun.mdc` requires using `bun`/`bunx` instead of `npm`/`npx`.
- `LINEAR_USER_FEEDBACK_LABEL` must be a valid UUID format or env validation will fail.
- `VERCEL_ENV` only accepts the literal strings `development`, `preview`, or `production`.
- The lint command (`bun run lint`) has pre-existing errors/warnings in the codebase — these are not caused by your changes.
- Bun must be installed separately (not provided by nvm). The update script handles this.
