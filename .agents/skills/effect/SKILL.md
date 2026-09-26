---
name: effect
description: Guidelines for writing Effect-TS code. Apply when the user requests Effect code changes, when editing files that import from "effect", or when authoring, reviewing, or refactoring Effect.gen, Effect.try, Effect.fn, Effect.fnUntraced, tagged errors, or Effect.fail usage.
---

# Effect Code Guidelines

## Creating Effectful functions
Prefer using `Effect.fnUntraced` over `Effect.gen` for untraced construction, and use `Effect.fn` for traced construction when observability is important and squeezing out the 
most performance isn't neccessary.

```typescript
// ❌ BAD
const foo = (input: string) = Effect.gen(function*() {
	const myService = yield* Service
	const result = yield* myService.doWork(input)
	return result
})

// ✅ GOOD
const foo = Effect.fnUntraced(function*(input: string) {
	const myService = yield* Service
	const result = yield* myService.doWork(input)
	return result
})

// OR - when tracing is requested/needed
const foo = Effect.fn("foo")(function*(input: string){
	const myService = yield* Service
	const result = yield* myService.doWork(input)
	return result
})
```

### When `Effect.gen` is appropriate
Use `Effect.gen` for service constructors that do not require any parameters.

```typescript
class MyService extends Context.Service<MyService>()("UniqueServiceKey") {
	make: Effect.gen(function*() {
		// Default implementation
	}),
}
```


## Tagged errors

Never wrap tagged errors in an Effect.fail, tagged errors are directly yieldable.

`Schema.TaggedError` instances implement Effect's yieldable failure protocol. Yield or return them directly.

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
Avoid returning Effectful values from plain functions. Instead write the function itself as an Effect to make it clear what it returns.

```typescript
// ❌ BAD
function requireText(value: string, label: string) {
  if (value.trim().length === 0) {
    return Effect.fail(
      new BroadcastInputError({
        message: `${label} is required.`,
        cause: value,
      }),
    )
  }
  return Effect.succeed(value)
}

// ✅ GOOD
const requireText = Effect.fnUntraced(function*(value: string, label: string) {
  if (value.trim().length === 0) {
    return yield* new BroadcastInputError({
      message: `${label} is required.`,
      cause: value,
    })
  }

  return value
})
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

Use `Schema.TaggedError` with a `cause` and optional `message` if the error is user-facing:

```typescript
export class ImageOptimizationError extends Schema.TaggedError<ImageOptimizationError>()(
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

For domain errors with a `_tag`, always use a tagged error schema instead.

## Validation
Never manually validate input/output from unknown sources without using `Schema`. Use `Schema.Struct` or other APIs to define the data model you expect and 
validate against that model using the built-in APIs.

```typescript
// ❌ BAD
interface Input {
	value: string
	label: string
}

function someFunction(input: Input) {
	if (input.value.trim().length === 0) {
		return Effect.fail("Expected input value to exist.")
	}
}

// ✅ GOOD
const InputSchema = Schema.Struct({
	value: Schema.NonEmptyString,
	label: Schema.NonEmptyString
})
type Input = InputSchema.Type

const someFunction = Effect.fnUntraced(function*(input: Input) {
	const validInput = yield* Schema.decodeUnknownEffect(InputSchema)(input)
})

// OR - create a reusable validator function if it's used in multiple places
const validateInput = Schema.decodeUnknownEffect(InputSchema)

const someFunction = Effect.fnUntraced(function*(input: Input) {
	const validInput = yield* validateInput(input)
})
```

## Review checklist

When writing or reviewing Effect code:

- [ ] Tagged errors are yielded directly, never wrapped in `Effect.fail` unless returned from a plain function
- [ ] Error classes use `Schema.TaggedError` with a stable `_tag`
- [ ] `Effect.gen` uses `yield*` for fallible operations and tagged failures
- [ ] `Effect.try` / `Effect.tryPromise` `catch` callbacks produce tagged errors, not raw `Error` throws
- [ ] Success paths use plain values in function body or `Effect.succeed` where an Effect must be returned; failures use tagged errors or `Effect.fail` for untagged values only
