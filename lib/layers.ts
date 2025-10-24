import { Layer } from "effect"
import { Path } from "@effect/platform"
import { BunFileSystem } from "@effect/platform-bun"

export const FileSystemLayer = Layer.merge(BunFileSystem.layer, Path.layer)
