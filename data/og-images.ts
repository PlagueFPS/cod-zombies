import 'server-only'
import { FetchError } from '@/types/Error'
import { tryCatch } from '@/utils/functions'
import { err, ok, Result } from 'neverthrow'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

type AllowedFonts = "Geist-Bold.otf" | "Geist-SemiBold.otf"

export const getFontData = async (font: AllowedFonts): Promise<Result<Buffer<ArrayBufferLike>, FetchError>> => {
  const { data, error } = await tryCatch(readFile(join(process.cwd(), `fonts/${font}`)))
  if (error) {
    return err(new FetchError(error.message, { cause: error }))
  }

  return ok(data)
}