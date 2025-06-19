import 'server-only'
import { FetchError } from '@/types/Error'
import { tryCatch } from '@/utils/functions'
import { err, ok, Result } from 'neverthrow'
import { env } from '@/env'

type AllowedFonts = "Geist-Bold.otf" | "Geist-SemiBold.otf"

export const getFontData = async (font: AllowedFonts): Promise<Result<ArrayBuffer, FetchError>> => {
  const { data, error } = await tryCatch(fetch(`${env.NEXT_PUBLIC_WEBSITE_URL}/fonts/${font}`))
  if (error) {
    return err(new FetchError(error.message, { cause: error }))
  }

  if (!data.ok) {
    return err(new FetchError("Missing font data", { cause: data }))
  }

  const buffer = await data.arrayBuffer()
  return ok(buffer)
}