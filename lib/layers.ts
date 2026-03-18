import { BunServices } from "@effect/platform-bun"
import { ManagedRuntime } from "effect"
import { Email } from "./services/emails"

export const PageRuntime = ManagedRuntime.make(BunServices.layer)
export const APIRuntime = ManagedRuntime.make(Email.layer)
