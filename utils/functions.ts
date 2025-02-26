import { timingSafeEqual } from "crypto"

export const capatilize = (text: string) => {
  return text
    .replace(/-/g, " ") // Replace hyphens with spaces
    .split(" ") // Split the string into an array of words
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join(" ") // Join the words back into a single string
}

export const slugify = (text: string) => {
  return text.toLowerCase()
    .replace(/[ /,]+/g, '-') // Replaces slashes, spaces, and commas with hyphens
    .replace(/&/g, "and") // Replaces "&" symbol with the text "and"
    
}

export const getYouTubeVideoID = (url: string) => {
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export const authorizedRequest = (secret: string, validSecret: string) => {
  const encoder = new TextEncoder()
  const secretBuffer = encoder.encode(secret)
  const validSecretBuffer = encoder.encode(validSecret)
  // This function needs to be wrapped in a try/catch
  // because it will throw an error if the byteLength the compared strings
  // is not the same, instead of just returning false which is annoying.
  try {
    return timingSafeEqual(secretBuffer, validSecretBuffer)
  } catch (error) {
    console.error(error)
    return false
  }
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

export const TypeGuards = {
  isFunction(value: unknown): value is Function {
    return typeof value === 'function'
  },
  isNumber(value: unknown): value is number {
    return typeof value === 'number'
  },
  isString(value: unknown): value is string {
    return typeof value === 'string'
  },
  isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean'
  },
  isArray<T>(value: unknown): value is T[] {
    return Array.isArray(value)
  },
  isObject(value: unknown): value is object {
    return typeof value === 'object' && value !== null && !this.isArray(value)
  },
  hasProperty<K extends string>(obj: unknown, prop: K): obj is { [P in K]: unknown } {
    return this.isObject(obj) && prop in obj
  },
}