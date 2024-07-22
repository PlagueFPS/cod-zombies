import { z } from "zod";

export const ContactGoogleFormSchema = z.object({
  'entry.404032380': z.string().email(), // email
  'entry.1808584294': z.string(), // subject
  'entry.1626527007': z.string().max(1000, "Cannot exceed 1000 characters") // body
})

export const ContactFormSchema = z.object({
  email: z.string().email(),
  subject: z.string(),
  body: z.string().max(1000, "Cannot exceed 1000 characters")
})

export interface ContactGoogleForm extends z.infer<typeof ContactGoogleFormSchema> {}