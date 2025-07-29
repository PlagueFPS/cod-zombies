import { del, head, put } from "@vercel/blob"
import { Effect } from "effect"
import { detectContentType } from "next/dist/server/image-optimizer"
import { DeleteFileError, GetFileError, UploadFileError } from "@/types/errors"

export class FileStorage extends Effect.Service<FileStorage>()("FileStorage", {
	effect: Effect.gen(function* () {
		const storeImage = (imagePath: string, imageBuffer: Buffer) =>
			Effect.tryPromise({
				try: signal =>
					put(imagePath, imageBuffer, {
						access: "public",
						contentType: detectContentType(imageBuffer) ?? undefined,
						abortSignal: signal,
					}),
				catch: error =>
					new UploadFileError({ message: `Failed to upload file: ${imagePath}`, cause: error }),
			})

		const getImage = (imagePath: string) =>
			Effect.tryPromise({
				try: () => head(imagePath),
				catch: error =>
					new GetFileError({ message: `Failed to get file: ${imagePath}`, cause: error }),
			})

		const deleteImage = (imagePath: string | string[]) =>
			Effect.tryPromise({
				try: signal => del(imagePath, { abortSignal: signal }),
				catch: error =>
					new DeleteFileError({ message: `Failed to delete file: ${imagePath}`, cause: error }),
			})

		return { storeImage, getImage, deleteImage } as const
	}),
}) {}
