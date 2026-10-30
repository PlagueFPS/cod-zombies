import { Layer, ManagedRuntime } from "effect"
import { emailLayer } from "@/lib/services/emails"
import { newsletterTokensLayer } from "@/lib/services/newsletter-tokens"

export const APIRuntime = ManagedRuntime.make(emailLayer)

export const NewsletterRuntime = ManagedRuntime.make(Layer.merge(emailLayer, newsletterTokensLayer))
