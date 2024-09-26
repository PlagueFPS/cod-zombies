import { z } from "zod";
import { zfd } from "zod-form-data";

export interface SearchParams extends z.infer<typeof SearchParamsSchema> {}
export interface FeedbackForm extends z.infer<typeof FeedbackFormSchema> {}

export const FeedbackFormSchema = zfd.formData({
  title: zfd.text(z.string({ required_error: "Title is required" }).min(1)),
  email: zfd.text(z.string().email({ message: "Invalid email address" }).optional()),
  name: zfd.text(z.string().optional()),
  label: zfd.text(z.enum(['featureRequest', 'idea', 'issue', 'question', 'complaint', 'other'], {
    required_error: "Label is required",
  })),
  feedback: zfd.text(z.string({ required_error: "Feedback is required" }).min(1))
})

export const NewsletterFormSchema = zfd.formData({
  email: zfd.text(z.string().email()),
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

export const validateSearchParams = async (searchParams: Promise<SearchParams> | undefined) => {
  const input = await searchParams
  if (!input) return { page: 1 }
  return SearchParamsSchema.parse(input)
}