// import "server-only"
// import { cache } from "react"
// import { getEntries } from "@/contentful/contentful"
// import { TypeGameCategorySkeleton } from "@/contentful/Types/contentful-types"
// import { createGameCategoryDTO } from "@/utils/contentful-utils"
// import { CACHE_KEYS, IN_DEVELOPMENT, MAX_NEW_TIME } from "@/utils/constants"
// import { db } from "@/db/db"
// import { categories } from "@/db/schema"
// import { revalidatePath, revalidateTag, unstable_cache } from "next/cache"
// import { submitFeedbackUseCase } from "@/usecases/feedback"
// import { eq } from "drizzle-orm"

// export const getGameCategories = async (draftMode: boolean) => {
//   if (draftMode) return INTERNAL_getGameCategories(true)
//   return await getCachedCategories()
// }

// export const getGameCategoryBySlug = async (draftMode: boolean, slug: string) => {
//   return await INTERNAL_getGameCategoryBySlug(draftMode, slug)
// }

// export const getGameCategoryById = async (draftMode: boolean, id: string) => {
//   return await INTERNAL_getGameCategoryById(draftMode, id)
// }

// export const storeNewCategoryId = cache(async (categoryId: string, createdAt: string) => {
//   await db.insert(categories).values({ categoryId, publishedAt: createdAt })
// })

// export const getAllNewCategoryIds = async () => {
//   return await getCachedAllNewCategoryIds()
// }

// export const enforceNewCategoryStatus = async () => {
//   try {
//     const newCategories = await db.select({ 
//       categoryId: categories.categoryId, 
//       publishedAt: categories.publishedAt 
//     }).from(categories)
  
//     newCategories.forEach(async category => {
//       try {
//         if (!category.publishedAt) return
//         if (typeof category.publishedAt !== 'string') {
//           await db.delete(categories).where(eq(categories.categoryId, category.categoryId))
//           console.log(`Stored Category publishedAt was not a string. Check storing logic`, category.publishedAt)
//           await submitFeedbackUseCase({
//             title: "Category Status Error",
//             name: "New Category Enforcement",
//             label: "issue",
//             feedback: `Stored Category publishedAt was not a string. Check storing logic. ID: ${category.categoryId}`
//           })
//           return
//         }
    
//         const currentTime = Date.now()
//         const creationTime = new Date(category.publishedAt).getTime()
    
//         if (currentTime - creationTime > MAX_NEW_TIME) {
//           await db.delete(categories).where(eq(categories.categoryId, category.categoryId))
//           const gameCategory = await getGameCategoryById(IN_DEVELOPMENT, category.categoryId)
//           if (!gameCategory) {
//             // If the map is not found, skip revalidation
//             console.error(`Could not find map for ID: ${category.categoryId}`)
//             await submitFeedbackUseCase({
//               title: "Category Status Error",
//               name: "New Category Enforcement",
//               label: "issue",
//               feedback: `Could not find map for ID: ${category.categoryId}`
//             })
//             return
//           }
    
//           const categoryPath = `/${gameCategory.slug}`
//           // Revalidate the category data
//           // This is to update the Data Cache
//           revalidateTag(CACHE_KEYS.GAME_CATEGORIES.ALL)
//           // Revalidate the category page the map belongs too
//           // This is to update the ISR cache
//           revalidatePath(categoryPath)
//         } else return
//       }
//       catch(error) {
//         await submitFeedbackUseCase({
//           title: "Category Status Error",
//           name: "New Category Enforcement",
//           label: "issue",
//           feedback: `Error processing category id: ${category.categoryId}`
//         })
//         console.error(`Error processing category id: ${category.categoryId}`, error)
//         return
//       }
//     })
//   }
//   catch(error) {
//     await submitFeedbackUseCase({
//       title: "Category Status Error",
//       name: "New Category Enforcement",
//       label: "issue",
//       feedback: `Error processing categories ${error}`
//     })
//     console.error(`Error processing categories`, error)
//     return
//   }
// }

// const getCachedCategories = unstable_cache(async () => {
//     const categories = await INTERNAL_getGameCategories(false)
//     return categories
//   },
//   [],
//   { tags: [CACHE_KEYS.GAME_CATEGORIES.ALL] })

// const getCachedAllNewCategoryIds = unstable_cache(async () => {
//     return await INTERNAL_getAllNewCategoryIds()
//   },
//   [],
//   { tags: [
//     CACHE_KEYS.GAME_CATEGORIES.ALL, 
//     CACHE_KEYS.GAME_CATEGORIES.IDS
//   ]})

// const INTERNAL_getGameCategories = cache(async (draftMode: boolean) => {
//   const gameCategories = await getEntries<TypeGameCategorySkeleton>({
//     content_type: 'gameCategory',
//     order: ['sys.createdAt'],
//   }, draftMode)

//   return await createGameCategoryDTO(gameCategories.items)
// })

// const INTERNAL_getGameCategoryById = cache(async (draftMode: boolean, id: string) => {
//   const categories = await INTERNAL_getGameCategories(draftMode)
//   const categoryById = categories.find(category => category.id === id)
//   return categoryById
// })

// const INTERNAL_getGameCategoryBySlug = cache(async (draftMode: boolean, slug: string) => {
//   const categories = await INTERNAL_getGameCategories(draftMode)
//   const categoryBySlug = categories.find(category => category.slug === slug)
//   return categoryBySlug
// })

// const INTERNAL_getAllNewCategoryIds = cache(async () => {
//   const categoryIds = await db.select({ categoryId: categories.categoryId }).from(categories)
//   return categoryIds
// })