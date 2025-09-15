import type { CommonErrorProps } from "@/types/errors"
import { del, head, put } from "@vercel/blob"
import { Data, Effect, Redacted } from "effect"
import { detectContentType } from "next/dist/server/image-optimizer"
import { env } from "@/env"

export class UploadFileError extends Data.TaggedError("UploadFileError")<CommonErrorProps> {}
export class GetFileError extends Data.TaggedError("GetFileError")<CommonErrorProps> {}
export class DeleteFileError extends Data.TaggedError("DeleteFileError")<CommonErrorProps> {}

export class FileStorage extends Effect.Service<FileStorage>()("FileStorage", {
	effect: Effect.gen(function* () {
		const uploadFile = (pathname: string, buffer: Buffer) =>
			Effect.gen(function* () {
				const contentType = yield* Effect.tryPromise({
					try: () => detectContentType(buffer, null),
					catch: error =>
						new UploadFileError({ message: "Failed to detect content type", cause: error }),
				})
				if (!contentType)
					return yield* new UploadFileError({
						message: "Failed to detect content type",
						cause: "Content type is null",
					})

				return yield* Effect.tryPromise({
					try: signal =>
						put(pathname, buffer, {
							access: "public",
							contentType,
							abortSignal: signal,
							token: Redacted.value(env.STORAGE_READ_WRITE_TOKEN),
						}),
					catch: error => new UploadFileError({ message: "Failed to upload file", cause: error }),
				})
			})

		const getFile = (urlOrPathname: string) =>
			Effect.tryPromise({
				try: signal =>
					head(urlOrPathname, {
						abortSignal: signal,
						token: Redacted.value(env.STORAGE_READ_WRITE_TOKEN),
					}),
				catch: error => new GetFileError({ message: "Failed to get file", cause: error }),
			})

		const deleteFile = (urlOrPathname: string | string[]) =>
			Effect.tryPromise({
				try: signal =>
					del(urlOrPathname, {
						abortSignal: signal,
						token: Redacted.value(env.STORAGE_READ_WRITE_TOKEN),
					}),
				catch: error => new DeleteFileError({ message: "Failed to delete file", cause: error }),
			})

		return { uploadFile, getFile, deleteFile } as const
	}),
}) {}
