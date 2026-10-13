import { ManagedRuntime } from "effect"
import { emailLayer } from "@/lib/services/emails"

export const APIRuntime = ManagedRuntime.make(emailLayer)
