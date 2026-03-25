import { NodeServices } from "@effect/platform-node"
import { ManagedRuntime } from "effect"
import { Email } from "@/lib/services/emails"

export const PageRuntime = ManagedRuntime.make(NodeServices.layer)
export const APIRuntime = ManagedRuntime.make(Email.layer)
