import { env } from "@/env"
import { AuthorizationError, TokenExpirationError, TokenGenerationError, TokenVerificationError } from "@/types/Error"
import { createHash, randomBytes, timingSafeEqual } from "crypto"
import { Console, Effect, Duration } from "effect"
import type { DurationInput } from "effect/Duration"
import { stringToNumber } from "./validationSchemas"

/**
 * Capitalizes the first letter of each word in a string, replacing hyphens with spaces.
 * @param text - The input string to be capitalized.
 * @returns The capitalized string with spaces instead of hyphens.
 */
export const capatilize = (text: string) => {
  return text
    .replace(/-/g, " ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

/**
 * Converts a string to a URL-friendly slug.
 * @param text - The input string to be slugified.
 * @returns The slugified string in lowercase, with spaces, slashes, and commas replaced by hyphens, and '&' replaced with 'and'.
 */
export const slugify = (text: string) => {
  return text.toLowerCase()
    .replace(/[ /,]+/g, '-')
    .replace(/&/g, "and")
}

/**
 * Extracts the YouTube video ID from a given URL.
 * @param url - The YouTube video URL.
 * @returns The extracted video ID, or null if not found.
 */
export const getYouTubeVideoID = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

/**
 * Performs a timing-safe comparison of two secrets.
 * @param secret - The secret to be validated.
 * @param validSecret - The known valid secret.
 * @returns True if the secrets match.
 */
export const authorizedRequest = (secret: string, validSecret: string) => 
  Effect.gen(function*() {
    const encoder = new TextEncoder()
    const secretBuffer = encoder.encode(secret)
    const validSecretBuffer = encoder.encode(validSecret)
    return yield* Effect.try({
      try: () => timingSafeEqual(secretBuffer, validSecretBuffer),
      catch: (error) => new AuthorizationError({ message: "Authorization Failed", cause: error })
    })
  }).pipe(
    Effect.withLogSpan("authorized_request"),
    Effect.tapError(error => Console.error(error)),
  )
// export const authorizedRequest = (secret: string, validSecret: string): NeverThrowResult<true, AuthorizationError> => {
//   const encoder = new TextEncoder()
//   const secretBuffer = encoder.encode(secret)
//   const validSecretBuffer = encoder.encode(validSecret)
//   const { error } = tryCatchSync(timingSafeEqual(secretBuffer, validSecretBuffer))

//   if (error) {
//     const authError = new AuthorizationError(error.message, { cause: error })
//     return err(authError)
//   }

//   return ok(true)
// }

/**
 * A type representing a successful result
 */
type Success<T> = {
  success: true;
  data: T;
  error: null;
};

/**
 * A type representing a failed result
 */
type Failure = {
  success: false;
  data: null;
  error: Error;
};

/**
 * A union type representing either a successful or failed result
 */
type Result<T> = Success<T> | Failure;

/**
 * Safely executes an async operation and returns a structured result
 * 
 * @param promiseOrFn - Either a promise or a function that returns a promise
 * @returns A Result object containing either the data or error
 */
export async function tryCatch<T>(
  promiseOrFn: Promise<T> | (() => Promise<T>)
): Promise<Result<T>> {
  try {
    const data = TypeGuards.isFunction(promiseOrFn)
      ? await promiseOrFn()
      : await promiseOrFn;
      
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

/**
 * Safely executes a synchronous operation and returns a structured result
 * 
 * @param valueOrFn - Either a value or a function that returns a value
 * @returns A Result object containing either the data or error
 */
export function tryCatchSync<T>(
  valueOrFn: T | (() => T)
): Result<T> {
  try {
    const data = TypeGuards.isFunction(valueOrFn)
      ? valueOrFn()
      : valueOrFn;
      
    return {
      success: true,
      data,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      data: null,
      error: error instanceof Error ? error : new Error(String(error)),
    };
  }
}

export const TypeGuards = {
  /**
   * Checks if the value is a function.
   * @param value - The value to check.
   * @returns True if the value is a function, false otherwise.
   */
  isFunction(value: unknown): value is () => void {
    return typeof value === 'function'
  },

  /**
   * Checks if the value is a number.
   * @param value - The value to check.
   * @returns True if the value is a number, false otherwise.
   */
  isNumber(value: unknown): value is number {
    return typeof value === 'number'
  },

  /**
   * Checks if the value is a string.
   * @param value - The value to check.
   * @returns True if the value is a string, false otherwise.
   */
  isString(value: unknown): value is string {
    return typeof value === 'string'
  },

  /**
   * Checks if the value is a boolean.
   * @param value - The value to check.
   * @returns True if the value is a boolean, false otherwise.
   */
  isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  },

  /**
   * Checks if the value is an array.
   * @param value - The value to check.
   * @returns True if the value is an array, false otherwise.
   */
  isArray<T>(value: unknown): value is T[] {
    return Array.isArray(value)
  },

  /**
   * Checks if the value is an object (excluding arrays and null).
   * @param value - The value to check.
   * @returns True if the value is an object, false otherwise.
   */
  isObject(value: unknown): value is object {
    return typeof value === 'object' && value !== null && !this.isArray(value)
  },

  /**
   * Checks if the object has a specific property.
   * @param obj - The object to check.
   * @param prop - The property to look for.
   * @returns True if the object has the specified property, false otherwise.
   */
  hasProperty<K extends string>(obj: unknown, prop: K): obj is { [P in K]: unknown } {
    return this.isObject(obj) && prop in obj
  },
}
  /**
   * Generates a unique, secure, and time-limited token.
   * @param value - The value to secure.
   * @param expiresIn - The expiration time of the token.
   * @returns An Effect that succeeds with the generated unique secure token.
   */
export const generateToken = (value: string, expiresIn: DurationInput) => 
  Effect.gen(function*() {
    const salt = randomBytes(16).toString('hex')
    const expiresInMs = Duration.toMillis(expiresIn)
    const payload = `${value}:${salt}:${expiresInMs}`
    const hash = createHash("sha256").update(payload).digest("hex")

    return yield* Effect.try({
      try: () => Buffer.from(`${payload}:${hash}`).toString("base64url"),
      catch: (error) => new TokenGenerationError({ message: "Failed to generate token.", cause: error })
    })
  }).pipe(
    Effect.withLogSpan("generate_token"),
    Effect.tapError(error => Console.error(error)),
  )
/**
   * Verifies a securely generated token.
   * @param token - the secure token to verify.
   * @returns An Effect that succeeds with the valid token.
   */
export const verifyToken = (token: string) =>
  Effect.gen(function*() {
    const buffer = yield* Effect.try({
      try: () => Buffer.from(token, "base64url").toString(),
      catch: (error) => new TokenVerificationError({ message: "Invalid Token", cause: error })
    })
    const [value, salt, expiresInStr, originalHash] = buffer.split(":")
    const expiresIn = yield* stringToNumber(expiresInStr)

    if (Date.now() > expiresIn) return yield* Effect.fail(new TokenExpirationError({ 
      message: "Expired Token", 
      cause: new Error("Current time was greater than the expiration time") 
    }))
    
    const payload = `${value}:${salt}:${expiresIn}`
    const hash = createHash("sha256").update(payload).digest('hex')

    if (hash !== originalHash) return yield* Effect.fail(new TokenVerificationError({ 
      message: "Invalid Token", 
      cause: new Error("Original hash does not match the calculated hash") 
    }))

    return value
  }).pipe(
    Effect.withLogSpan("verify_token"),
    Effect.tapError(error => Console.error(error)),
  )
/**
 * Generates a hash for the provided identifier.
 * @param identifier - the value to hash.
 * @returns The generated hashed value.
 */
export const hashIdentifier = (identifier: string) => {
  return createHash("sha256").update(`${identifier}:${env.HASH_SALT}`).digest("hex")
}