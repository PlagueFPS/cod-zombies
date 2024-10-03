import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { z } from 'zod';

type InferArgs<T> = T extends Record<string, z.ZodType<any, any>>
  ? { [K in keyof T]: z.infer<T[K]> }
  : never;

type NextCacheOptions<TArgs, TReturn> = {
  args?: TArgs;
  handler: (ctx: InferArgs<TArgs>) => Promise<TReturn>;
  revalidateTags?: (ctx: InferArgs<TArgs> & { result: Promise<TReturn> }) => Promise<string[]> | string[];
  revalidate?: number | false;
};

/**
 * This function creates a memoized cached function using Next.js's unstable_cache and react's cache, with a type-safe wrapper for arguments and return types.
 * 
 * @param  args - Object where the keys are arguments and the values are Zod Types.
 * @param  handler - The function to be cached. This function must return a promise and receives the parsed context as its argument.
 * @param  revalidateTags - A function that returns an array of tags for on-demand revalidation, receiving the parsed context and the result of the handler as its arguments. This function can be async but must return a promise that resolves to a string array.
 * @param  revalidate - The revalidation period in seconds. Omit or pass false to cache indefinitely or until `revalidateTag()` or `revalidatePath()` is called.
 * 
 * @returns A memoized function that validates input, returns a cached result if it exists, otherwise calls the handler function and caches the result.
 * 
 * @example
 * const getCategoryFromCache = nextCache({ 
 *   args: {
 *     categoryId: z.string()
 *   },
 *   handler: async ({ categoryId }) => {
 *     const category = await fetchGameCategoryById(categoryId)
 *     return category
 *   }, 
 *   revalidateTags: ({ categoryId, result }) => [`${CACHE_KEYS.GAME_CATEGORIES}-${result.id}`],
 *   revalidate: 3600 // 1 hour
 * })
 * 
 * // Usage
 * const category = await getCategoryFromCache({ categoryId: 'my-category-id' });
 */

export const nextCache = <
  TArgs extends Record<string, z.ZodType<any, any>> | undefined = undefined,
  TReturn = any
>(options: NextCacheOptions<TArgs, TReturn>) => {
  const { args, handler, revalidateTags, revalidate = false } = options;
  const schema = args ? z.object(args) : z.object({});

  return cache(async (inputArgs?: InferArgs<TArgs>) => {
    const parsedArgs = args ? schema.parse(inputArgs) : {};
    const context = { ...parsedArgs };
    Object.freeze(context);

    const isContextPopulated = Object.keys(context).length > 0
    const result = handler(context as InferArgs<TArgs>)
    const tags: string[] = []

    if (revalidateTags) {
      const revalidateTagsResult = revalidateTags({...context, result } as InferArgs<TArgs> & { result: Promise<TReturn> }) 
      const cacheTags = revalidateTagsResult instanceof Promise ? await revalidateTagsResult : revalidateTagsResult
      tags.push(...cacheTags)
    }

    const cachedHandler = unstable_cache(
      async () => {
        const handlerResult = await result
        return handlerResult
      },
      isContextPopulated ? Object.entries(context).flat().map(String) : [], // keyParts
      { // options
        tags: tags,
        revalidate
      }
    );

    return cachedHandler()
  })
}