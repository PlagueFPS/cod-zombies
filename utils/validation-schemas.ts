import { Schema } from "effect";
import { z } from "zod"

export type FeedbackForm = z.infer<typeof FeedbackFormSchema> 
export type AllowedSlugs = Schema.Schema.Type<typeof AllowedSlugsSchema>

export const AllowedSlugsSchema = Schema.Literal("maps", "games", "side-quests", "zombies", "legal")

export const FeedbackFormSchema = z.object({
  title: z.string().optional(), // This exist because `guide-feedback.tsx` passes the guide title as a default value
  feedback: z.string({ required_error: "Feedback is required" }).nonempty(),
})

export const NewsletterFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
})

export const ContactFormSchema = z.object({
  name: z.string({ required_error: "Name is required" }).nonempty(),
  email: z.string({ required_error: "Email is required" }).email({ message: "Invalid email address" }),
  message: z.string({ required_error: "Message is required" }).nonempty(),
})

const terminusCodeSchema = Schema.Struct({
  x: Schema.NumberFromString.pipe(Schema.greaterThanOrEqualTo(0), Schema.lessThanOrEqualTo(99)),
  y: Schema.NumberFromString.pipe(Schema.greaterThanOrEqualTo(0), Schema.lessThanOrEqualTo(99)),
  z: Schema.NumberFromString.pipe(Schema.greaterThanOrEqualTo(0), Schema.lessThanOrEqualTo(99)),
})

export const decodeTerminusCode = Schema.decodeEither(terminusCodeSchema)

// export const TerminusCodeSchema = z.object({
//   x: z.coerce.number().nonnegative().int().max(99),
//   y: z.coerce.number().nonnegative().int().max(99),
//   z: z.coerce.number().nonnegative().int().max(99),
// })

export const DraftModeSchema = z.object({
  pathname: z.string().nonempty()
})