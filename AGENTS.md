## Toolchain and checks

Use `bun` for dependency management, linting, formatting, type checks, and tests. Use `bun run test` for the repository test task, which includes lint regressions.

| Command                         | Purpose                                                  |
| ------------------------------- | -------------------------------------------------------- |
| `bun install --frozen-lockfile` | Install pinned dependencies and run the toolchain patch. |
| `bun run dev`                   | Start the web development server alone.                  |
| `bun run typecheck`             | Check types.                                             |
| `bun run test`                  | Run lint regressions and workspace tests.                |
| `bun run build`                 | Build the web application.                               |
| `bun run lint`                  | Check linting.                                           |
| `bun run format`                | Format the repository.                                   |

## Imports

Use the `@/*` alias from `tsconfig.json` for imports inside the repo. The alias points at `./src/*`. Import `cn` from the `cn` package. In `import.meta.glob` and in dynamic `import()`, use `./` or `../`. Vite resolves those strings itself. An `@/` path in them breaks the build.
