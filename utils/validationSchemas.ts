import { z } from "zod";
import { zfd } from "zod-form-data";

export interface SearchParams extends z.infer<typeof SearchParamsSchema> {}
export interface FeedbackForm extends z.infer<typeof FeedbackFormSchema> {}

export const FeedbackFormSchema = zfd.formData({
  title: zfd.text(z.string({ required_error: "Title is required" }).min(1)),
  label: zfd.text(z.enum(['featureRequest', 'idea', 'issue', 'question', 'complaint', 'other'], {
    required_error: "Label is required",
  })),
  feedback: zfd.text(z.string({ required_error: "Feedback is required" }).min(1))
})

export const NewsletterFormSchema = zfd.formData({
  email: zfd.text(z.string().email({ message: "Invalid email address" })),
})

export const ContactFormSchema = zfd.formData({
  name: zfd.text(z.string({ required_error: "Name is required" }).min(1)),
  email: zfd.text(z.string({ required_error: "Email is required" }).email({ message: "Invalid email address" })),
  message: zfd.text(z.string({ required_error: "Message is required" }).min(1)),
})

export const RevalidateWebhookBodySchema = z.object({
  entryId: z.string().min(1),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

// Base schema for common fields
const BaseContentfulWebhookBodySchema = z.object({
  createdAt: z.string({ required_error: "Created At is required" }).datetime(),
  updatedAt: z.string({ required_error: "Updated At is required" }).datetime(),
});

// Schema for payloads with mapId
export const MapContentfulWebhookBodySchema = BaseContentfulWebhookBodySchema.extend({
  mapId: z.string({ required_error: "Map Id is required" }).min(1),
});

// Schema for payloads with categoryId
export const CategoryContentfulWebhookBodySchema = BaseContentfulWebhookBodySchema.extend({
  categoryId: z.string({ required_error: "Category Id is required" }).min(1),
});

// Union type to represent either case
export const ContentfulWebhookBodySchema = z.discriminatedUnion('type', [
  MapContentfulWebhookBodySchema.extend({ type: z.literal('map') }),
  CategoryContentfulWebhookBodySchema.extend({ type: z.literal('category') }),
]);

export const TerminusCodeSchema = z.object({
  x: z.coerce.number().nonnegative().int().max(99),
  y: z.coerce.number().nonnegative().int().max(99),
  z: z.coerce.number().nonnegative().int().max(99),
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