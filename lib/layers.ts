import { Path } from "@effect/platform"
import { BunFileSystem } from "@effect/platform-bun"
import { Layer, ManagedRuntime } from "effect"
import { Email } from "./services/emails"

const FileSystemLayer = Layer.merge(BunFileSystem.layer, Path.layer)
export const PageRuntime = ManagedRuntime.make(FileSystemLayer)
export const APIRuntime = ManagedRuntime.make(Email.Default)
