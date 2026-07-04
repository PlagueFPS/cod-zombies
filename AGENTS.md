## Verification commands

Run in this order after any code change (see `package.json` scripts):

```bash
bun run typecheck   # tsc --noEmit
bun run lint        # oxlint (warnings are expected; 0 errors = pass)
bun run fmt         # oxfmt (auto-formats in place)
bun run test        # bun test
```

### Expectations

- Do not skip these steps for "small" edits — run them unless the user explicitly says not to
- If `lint` reports issues, fix them (use `bun run lint:fix` when appropriate) and re-run `lint`
- If `fmt` reformats files, include those changes in the result
- If `test` fails, fix the regression or explain why it is unrelated only when clearly pre-existing and the user did not ask for a fix

### When to skip

- Question-only or review-only tasks with no file edits
- The user explicitly asks to skip verification
- Docs-only changes with no TypeScript/test impact (still run checks if TS or tests were touched)

Report a brief summary of pass/fail for each command when done.
