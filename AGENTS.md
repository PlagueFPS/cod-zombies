# Agent Verification Guide

All agents must run the verification steps below after making code changes and before opening or updating a pull request. These checks mirror the CI pipeline in [`.github/workflows/ci.yml`](.github/workflows/ci.yml) and ensure changes are functional, typed correctly, and follow project standards.

## Prerequisites

- Use [Bun](https://bun.sh/) for all package and script commands (`bun`, `bunx`). Do not use `npm` or `npx`.
- Install dependencies once per environment (or after dependency changes):

```bash
bun install --frozen-lockfile
```

## Verification Checklist

Run these commands from the repository root in order. Fix any failures before considering the work complete.

### 1. Format

Check that all files match the project's formatting rules ([oxfmt](https://github.com/oxc-project/oxc), configured in [`.oxfmtrc.json`](.oxfmtrc.json)):

```bash
bun run fmt:check
```

If formatting fails, apply fixes automatically:

```bash
bun run fmt
```

Re-run `bun run fmt:check` to confirm the check passes.

### 2. Lint

Run the linter ([oxlint](https://github.com/oxc-project/oxc), configured in [`.oxlintrc.json`](.oxlintrc.json)):

```bash
bun run lint
```

Resolve all reported lint errors. Do not disable rules or suppress findings unless the codebase already uses that pattern for the same case.

### 3. Typecheck

Generate Next.js route types, then run the TypeScript checker:

```bash
bun run typegen
bun run typecheck
```

`typegen` must run before `typecheck` when routes, layouts, or other Next.js-generated types may have changed. Fix all type errors before proceeding.

### 4. Test

Run the full test suite once (non-watch mode):

```bash
bun run test
```

All tests must pass. If you changed behavior intentionally, update or add tests as appropriate for the change.

## Quick Reference

| Step       | Check command           | Fix command (if applicable) |
| ---------- | ----------------------- | --------------------------- |
| Format     | `bun run fmt:check`     | `bun run fmt`               |
| Lint       | `bun run lint`          | —                           |
| Typecheck  | `bun run typegen && bun run typecheck` | —              |
| Test       | `bun run test`          | —                           |

## One-Shot Verification

To run the full pipeline in a single pass (same order as CI):

```bash
bun run fmt:check && bun run lint && bun run typegen && bun run typecheck && bun run test
```

## Optional: Production Build

CI does not run a production build, but agents may run it when changes affect routing, bundling, or server/client boundaries:

```bash
bun run build
```

## Codebase Conventions

While verifying, keep these project conventions in mind:

- **Imports:** Use the `@/*` path alias instead of relative imports (see [`.cursor/rules/alias-imports.mdc`](.cursor/rules/alias-imports.mdc)).
- **Package manager:** Always use `bun` / `bunx` for scripts and tooling.
- **Scope:** Make focused changes; avoid unrelated refactors or drive-by edits.

## When Verification Fails

1. Read the full command output and fix the root cause.
2. Re-run only the failing step first, then re-run the full checklist before finishing.
3. Do not commit with known failing checks unless explicitly instructed otherwise.

## Definition of Done

A change is ready for review when:

1. All four verification steps pass locally.
2. Changes are committed with a clear message.
3. The pull request is created or updated with a summary of what changed and why.
