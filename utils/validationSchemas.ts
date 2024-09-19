import { z } from "zod";

export interface ContactGoogleForm extends z.infer<typeof ContactGoogleFormSchema> {}
export interface SearchParams extends z.infer<typeof SearchParamsSchema> {}

export const ContactGoogleFormSchema = z.object({
  'entry.404032380': z.string().email(), // email
  'entry.1808584294': z.enum(['Suggestion', 'Feedback', 'Other']), // subject
  'entry.1626527007': z.string().max(1000, "Cannot exceed 1000 characters") // body
})

export const ContactFormSchema = z.object({
  email: z.string().email(),
  subject: z.enum(['Suggestion', 'Feedback', 'Other']),
  body: z.string().max(1000, "Cannot exceed 1000 characters")
})

export const NewsletterFormSchema = z.object({
  email: z.string().email(),
})

export const ContentfulWebhookBodySchema = z.object({
  slug: z.string().min(1),
  publishedCounter: z.number().min(1)
})

const stringOrStringArray = z.union([z.string(), z.array(z.string())])

const SearchParamsSchema = z.object({
  page: stringOrStringArray
  .optional()
  .transform(val => {
    if (Array.isArray(val)) val = val[0]
    const parsed = parseInt(val || '1', 10)
    return isNaN(parsed) || parsed < 1 ? 1 : parsed
  }),
})

export const validateSearchParams = (input: SearchParams | undefined) => {
  if (!input) return { page: 1 }
  return SearchParamsSchema.parse(input)
}