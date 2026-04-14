import { layer as NodeServices } from "@effect/platform-node/NodeServices"
import { ManagedRuntime } from "effect"
import { Email } from "@/lib/services/emails"

export const FsRuntime = ManagedRuntime.make(NodeServices)
export const APIRuntime = ManagedRuntime.make(Email.layer)
