import { createHash, randomBytes, timingSafeEqual } from "crypto"

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
 * @returns True if the secrets match, false otherwise.
 */
export const authorizedRequest = (secret: string, validSecret: string) => {
  const encoder = new TextEncoder()
  const secretBuffer = encoder.encode(secret)
  const validSecretBuffer = encoder.encode(validSecret)
  const { data, error } = tryCatchSync(() => timingSafeEqual(secretBuffer, validSecretBuffer))

  if (error) {
    console.error(error)
    return false
  }

  return data
}

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
  isFunction(value: unknown): value is Function {
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
   * Generates a secure token.
   * @param value - The value to secure.
   * @returns the generated secure token.
   */
export const generateToken = (value: string) => {
  const salt = randomBytes(16).toString('hex')
  const expiresAt = Date.now() + 24 * 60 * 60 * 1000
  const payload = `${value}:${salt}:${expiresAt}`
  const hash = createHash("sha256").update(payload).digest("hex")

  return Buffer.from(`${payload}:${hash}`).toString("base64url")
}
/**
   * Verifies a securely generated token.
   * @param token - the secure token to verify.
   * @returns True or false for token validity, and the decoded value if valid.
   */
export const verifyToken = (token: string) => {
  try {
    const decoded = Buffer.from(token, "base64url").toString()
    const [value, salt, expiresAtStr, originalHash] = decoded.split(":")
  
    const expiresAt = parseInt(expiresAtStr, 10)
    if (Date.now() > expiresAt) return {
      valid: false
    }
  
    const payload = `${value}:${salt}:${expiresAt}`
    const hash = createHash("sha256").update(payload).digest('hex')
  
    if (hash !== originalHash) return {
      valid: false
    }
  
    return { valid: true, value }
  } catch {
    return { valid: false }
  }
}