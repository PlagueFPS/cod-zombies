import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { z } from 'zod';

type NextCacheOptions<TArgs extends Record<string, z.ZodType<any, any>> | undefined = undefined, ReturnType = any> = {
  args?: TArgs;
  fn: TArgs extends Record<string, z.ZodType<any, any>>
    ? (ctx: { [K in keyof TArgs]: z.infer<TArgs[K]> }) => Promise<ReturnType>
    : () => Promise<ReturnType>;
  revalidateTags?: TArgs extends Record<string, z.ZodType<any, any>>
    ? (ctx: { [K in keyof TArgs]: z.infer<TArgs[K]> }) => Promise<string[]> | string[]
    : () => Promise<string[]> | string[];
  revalidate?: number | false;
};

/**
 * This function creates a memoized cached function using Next.js's unstable_cache and react's cache, with a type-safe wrapper for arguments and return types.
 * 
 * @param  args - Object where the keys are arguments and the values are Zod Types.
 * @param  fn - The function to be cached. This function must return a promise and receives the parsed context as its argument.
 * @param  revalidateTags - A function that returns an array of tags for on-demand revalidation, receiving the parsed context as its argument. This function can be async but must return a promise that resolves to a string array.
 * @param  revalidate - The revalidation period in seconds. Omit or pass false to cache indefinitely or until `revalidateTag()` or `revalidatePath()` is called.
 * 
 * @returns A memoized function that validates input, returns a cached result if it exists, otherwise calls the callback function and caches the result.
 * 
 * @example
 * const getCategoryFromCache = nextCache({ 
 *   args: {
 *     categoryId: z.string()
 *   },
 *   fn: async ({ categoryId }) => {
 *     const category = await fetchGameCategoryById(categoryId)
 *     return category
 *   }, 
 *   revalidateTags: ({ categoryId }) => [`${CACHE_KEYS.GAME_CATEGORIES}-${categoryId}`],
 *   revalidate: 3600 // 1 hour
 * })
 * 
 * // Usage
 * const category = await getCategoryFromCache({ categoryId: 'my-category-id' });
 */

export const nextCache = cache(<
  TArgs extends Record<string, z.ZodType<any, any>> | undefined = undefined,
  ReturnType = any
>(options: NextCacheOptions<TArgs, ReturnType>) => {
  const { args, fn, revalidateTags, revalidate = false } = options;
  const schema = args ? z.object(args) : z.object({});

  return (async (inputArgs?: z.infer<typeof schema>) => {
    const parsedArgs = args ? schema.parse(inputArgs) : {};
    const context = { ...parsedArgs };
    Object.freeze(context);

    const isContextPopulated = Object.keys(context).length > 0;
    let tags: string[] | undefined;

    if (revalidateTags) {
      const revalidateTagsResult = revalidateTags(context)
      tags = revalidateTagsResult instanceof Promise ? await revalidateTagsResult : revalidateTagsResult
    }

    return unstable_cache(
      () => fn(context), // async function
      isContextPopulated ? Object.entries(context).flat().map(String) : undefined, // keyParts
      { // options
        tags,
        revalidate
      }
    )();
  }) as TArgs extends Record<string, z.ZodType<any, any>>
  ? (args: { [K in keyof TArgs]: z.infer<TArgs[K]> }) => Promise<ReturnType>
  : () => Promise<ReturnType>;
});