import { Path } from "@effect/platform"
import { BunFileSystem } from "@effect/platform-bun"
import { Next } from "@mcrovero/effect-nextjs"
import { Layer, ManagedRuntime } from "effect"
import { Email } from "./services/emails"

const FileSystemLayer = Layer.merge(BunFileSystem.layer, Path.layer)

export const BasePage = Next.make("BasePage", Layer.empty)
export const FileSystemPage = Next.make("FileSystemPage", FileSystemLayer)
export const APIRuntime = ManagedRuntime.make(Email.Default)
