import { ManagedRuntime } from "effect"
import { Email } from "@/lib/services/emails"

export const APIRuntime = ManagedRuntime.make(Email.layer)
