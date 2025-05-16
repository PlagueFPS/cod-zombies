import { z } from "zod";
import { zfd } from "zod-form-data";

export interface FeedbackForm extends z.infer<typeof FeedbackFormSchema> {}
export type AllowedSlugs = z.infer<typeof AllowedSlugsSchema>

export const AllowedSlugsSchema = z.enum(["maps", "games", "side-quests", "zombies", "legal"])

export const FeedbackFormSchema = zfd.formData({
  title: zfd.text(z.string()).optional(),
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