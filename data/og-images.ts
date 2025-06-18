import 'server-only'
import { env } from '@/env'
import { FetchError } from '@/types/Error'
import { tryCatch } from '@/utils/functions'
import { err, ok, Result } from 'neverthrow'

type AllowedFonts = "Geist-Bold.ttf" | "Geist-SemiBold.ttf"

export const getFontData = async (font: AllowedFonts): Promise<Result<ArrayBuffer, FetchError>> => {
  const { data, error } = await tryCatch(fetch(`${env.NEXT_PUBLIC_WEBSITE_URL}/fonts/${font}`).then(res => res.arrayBuffer()))
  if (error) {
    return err(new FetchError(error.message, { cause: error }))
  }

  return ok(data)
}