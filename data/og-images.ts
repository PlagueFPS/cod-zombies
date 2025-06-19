import 'server-only'
import { FetchError } from '@/types/Error'
import { tryCatch } from '@/utils/functions'
import { err, ok, Result } from 'neverthrow'
import { env } from '@/env'

type AllowedFonts = "Geist-Bold.otf" | "Geist-SemiBold.otf"

export const getFontData = async (font: AllowedFonts): Promise<Result<ArrayBuffer, FetchError>> => {
  const baseURL = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : env.NEXT_PUBLIC_WEBSITE_URL
  const { data, error } = await tryCatch(fetch(`${baseURL}/fonts/${font}`, {
    headers: {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET || ''
    }
  }))
  
  if (error) {
    return err(new FetchError(error.message, { cause: error }))
  }

  if (!data.ok) {
    return err(new FetchError("Missing font data", { cause: data }))
  }

  const buffer = await data.arrayBuffer()
  return ok(buffer)
}