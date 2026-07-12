---
name: effect
description: Guidelines for writing Effect-TS code with Schema.TaggedErrorClass and Effect.gen. Apply when the user requests Effect code changes, when editing files that import from "effect", or when authoring, reviewing, or refactoring Effect.gen, Effect.try, tagged errors, or Effect.fail usage.
---

# Effect Code Guidelines

## Tagged errors

Never wrap tagged errors in an Effect.fail, tagged errors are directly yieldable.

`Schema.TaggedErrorClass` instances implement Effect's yieldable failure protocol. Yield or return them directly.

### Inside `Effect.gen`

```typescript
// ❌ BAD
if (args.preview && args.map) {
  return yield* Effect.fail(
    new ImageOptimizationError({
      message: "Cannot use --preview and --map together.",
      cause: args,
    }),
  )
}

// ✅ GOOD
if (args.preview && args.map) {
  return yield* new ImageOptimizationError({
    message: "Cannot use --preview and --map together.",
    cause: args,
  })
}
```

### Returning `Effect` from plain functions

Since errors aren't Effect themselves, you must wrap them in Effect.fail to be part of the returned Effect's error channel from a plain function.

```typescript
// ❌ BAD
if (metadata.width === undefined) {
  return new ImageOptimizationError({
    message: `Image has no width metadata: ${asset}`,
    cause: asset,
  })
}

// ✅ GOOD
if (metadata.width === undefined) {
  return Effect.fail(
    new ImageOptimizationError({
      message: `Image has no width metadata: ${asset}`,
      cause: asset,
    }),
  )
}
```

### In `catch` callbacks

Construct the tagged error and yield/return it — do not wrap with `Effect.fail`.

```typescript
// ✅ GOOD
catch: cause =>
  new ImageOptimizationError({
    message: `Failed to read image metadata: ${relativeAsset}`,
    cause,
  }),
```

When the callback must return an `Effect`, yield the error inside a generator or return the instance directly.

## Defining tagged errors

Use `Schema.TaggedErrorClass` with a `cause` and optional `message` if the error is user-facing:

```typescript
export class ImageOptimizationError extends Schema.TaggedErrorClass<ImageOptimizationError>()(
  "ImageOptimizationError",
  {
    message: Schema.String,
    cause: Schema.Defect(),
  },
) {}
```

Prefer exporting error classes that are part of a module's public failure channel.

## When `Effect.fail` is appropriate

Use `Effect.fail` only for **non-tagged** failure values (strings, defects, or ad-hoc values):

```typescript
if (!exists) return yield* Effect.fail(`Public directory does not exist: ${publicDir}`)
```

For domain errors with a `_tag`, always use a tagged error class instead.

## Review checklist

When writing or reviewing Effect code:

- [ ] Tagged errors are yielded directly, never wrapped in `Effect.fail` unless returned from a plain function
- [ ] Error classes use `Schema.TaggedErrorClass` with a stable `_tag`
- [ ] `Effect.gen` uses `yield*` for fallible operations and tagged failures
- [ ] `Effect.try` / `Effect.tryPromise` `catch` callbacks produce tagged errors, not raw `Error` throws
- [ ] Success paths use plain values in function body or `Effect.succeed` where an Effect must be returned; failures use tagged errors or `Effect.fail` for untagged values only
