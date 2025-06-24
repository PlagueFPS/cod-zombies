import { z } from "zod";
import { zfd } from "zod-form-data"

export type FeedbackForm = z.infer<typeof FeedbackFormSchema> 
export type AllowedSlugs = z.infer<typeof AllowedSlugsSchema>

export const AllowedSlugsSchema = z.enum(["maps", "games", "side-quests", "zombies", "legal"])

export const FeedbackFormSchema = zfd.formData({
  title: zfd.text(z.string()).optional(),
  feedback: zfd.text(z.string({ required_error: "Feedback is required" }).nonempty()),
})

export const NewsletterFormSchema = zfd.formData({
  email: zfd.text(z.string().email({ message: "Invalid email address" })),
})

export const ContactFormSchema = zfd.formData({
  name: zfd.text(z.string({ required_error: "Name is required" }).nonempty()),
  email: zfd.text(z.string({ required_error: "Email is required" }).email({ message: "Invalid email address" })),
  message: zfd.text(z.string({ required_error: "Message is required" }).nonempty()),
})

export const RevalidateWebhookBodySchema = z.object({
  entryId: z.string().nonempty(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
})

export const TerminusCodeSchema = z.object({
  x: z.coerce.number().nonnegative().int().max(99),
  y: z.coerce.number().nonnegative().int().max(99),
  z: z.coerce.number().nonnegative().int().max(99),
})

export const DraftModeSchema = z.object({
  pathname: z.string().nonempty()
})

export const OGParamsSchema = z.promise(z.object({
  slug: z.tuple([AllowedSlugsSchema, z.string().nonempty()])
}))