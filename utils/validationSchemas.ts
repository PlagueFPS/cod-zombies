import { z } from "zod";

export interface SearchParams extends z.infer<typeof SearchParamsSchema> {}

export const FeedbackFormSchema = z.object({
  title: z.string({ required_error: "Title is required" }).min(1),
  email: z.string().email({ message: "Invalid email address" }).optional(),
  name: z.string().optional(),
  label: z.enum(['featureRequest', 'idea', 'issue', 'question', 'complaint', 'other'], {
    required_error: "Label is required",
  }),
  feedback: z.string({ required_error: "Feedback is required" }).min(1)
})

export const NewsletterFormSchema = z.object({
  email: z.string().email(),
})

export const ContentfulWebhookBodySchema = z.object({
  mapId: z.string().min(1),
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