import "server-only"
import { checkBotId } from "botid/server"
import { Exit, Schema } from "effect"

type ActionFunction<S extends Schema.Top, T> = (data: S["Type"]) => Promise<T>

export const createAction = <S extends Schema.Top & { readonly DecodingServices: never }, T>(
	schema: S,
	action: ActionFunction<S, T>,
) => {
	return async (_prevState: unknown, formData: FormData | S["Type"]) => {
		const { isBot } = await checkBotId()
		if (isBot) {
			console.error(`[BOT VERFICATION] bot detected, aborting action`)
			return {
				success: false,
				message:
					"Bots are not allowed to perform this action. If you are not a bot, please contact support if the issue persists.",
			}
		}

		if (formData instanceof FormData) {
			const decodeFormData = Schema.decodeUnknownExit(schema)
			const decoded = decodeFormData(Object.fromEntries(formData))
			if (Exit.isFailure(decoded)) {
				console.error(decoded.cause)
				return {
					success: false,
					message: "Invalid fields. Please try again after fixing the error.",
				}
			}

			return await action(decoded.value)
		}

		return await action(formData)
	}
}
