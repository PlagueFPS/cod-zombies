# anti-slop provenance

Source: [dmmulroy/anti-slop](https://github.com/dmmulroy/anti-slop), commit `c44ef22ca116d0ba62a3ff663a0bd13a3f3fa40b` (2026-09-10, "Merge pull request #36 from K-Mistele/contrib/effect-tag-match-rules").

Copied from this repository's skill bundle at `.agents/skills/install-anti-slop/assets/anti-slop/`. Byte-identical to upstream `src/` at that commit, excluding upstream RuleTester files (`*.test.ts`) which the skill bundle does not ship.

## Installed plugin paths

- Generic: `tools/oxlint/anti-slop/index.ts` (`anti-slop`)
- Effect: `tools/oxlint/anti-slop/effect/index.ts` (`anti-slop-effect`)

Effect rules are enabled because this repository declares a direct `effect` dependency. Nested ESLint Stylistic provenance remains in `vendor/eslint-stylistic/UPSTREAM.md`.

## Intentional deviations

`rules/no-array-filter-map.ts` rejects adjacent filter/map chains on property and unknown receivers instead of requiring local array evidence. `shared/array-method.ts` recognizes explicit lazy iterator producers and local iterator bindings so iterator pipelines remain allowed. This fixes missed chains on imported metadata properties such as `variants.widths`. Preserve these changes during vendor updates.

Application `tsconfig.json` excludes `tools/oxlint/anti-slop` and `.agents` so project typecheck does not compile the plugin (`.ts` import extensions and `noUncheckedIndexedAccess` differ from this repository's compiler options).

## Known limitations

`anti-slop-effect/no-service-constructor-imports` covers relative project imports. Path-alias imports such as `@/` are not enforced by that rule.
