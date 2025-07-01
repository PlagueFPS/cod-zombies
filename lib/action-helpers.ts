import "server-only"
import { Schema } from "effect"

type ActionFunction<S extends Schema.Schema.AnyNoContext, T> = (
  data: Schema.Schema.Type<S>
) => T

export const createAction = <S extends Schema.Schema.AnyNoContext, T>(schema: S, action: ActionFunction<S, T>) => {
  return async (_prevState: unknown, formData: FormData | Schema.Schema.Type<S>) => {

    const decodeFormData = Schema.decodeUnknownEither(schema)
    if (formData instanceof FormData) {
      const decoded = decodeFormData(Object.fromEntries(formData))
      if (decoded._tag === "Left") {
        console.error(decoded.left)
        return { success: false, message: "Invalid fields. Please try again after fixing the error." }
      }
  
      return await action(decoded.right)
    }

    return await action(formData)
  }
}