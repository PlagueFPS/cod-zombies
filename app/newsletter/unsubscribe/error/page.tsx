import type { Metadata } from "next"

import { Effect, Option } from "effect"
import { AlertCircle } from "lucide-react"

import { CustomLink } from "@/components/client/custom-link"
import { Button } from "@/components/ui/button"
import { decodeErrorPageSearchParams } from "@/utils/validation-schemas"

export const metadata: Metadata = {
	title: "Unsubscribe Failed",
}

export default async function UnsubscribeErrorPage({
	searchParams,
}: PageProps<"/newsletter/unsubscribe/error">) {
	return await unsubscribeErrorUI(searchParams).pipe(Effect.runPromise)
}

const unsubscribeErrorUI = Effect.fn("UnsubscribeErrorPage")(function* (
	searchParams: PageProps<"/newsletter/unsubscribe/error">["searchParams"],
) {
	const params = yield* Effect.promise(() => searchParams)
	const { message } = yield* decodeErrorPageSearchParams(params).pipe(
		Effect.catch(() => Effect.succeed({ message: Option.none() })),
	)
	const errorMessage = Option.isSome(message)
		? message.value
		: "An error occurred during the unsubscribe process."

	return (
		<div className="mx-auto max-w-md px-4 py-12 text-center">
			<div className="mb-4 flex justify-center">
				<AlertCircle className="h-16 w-16 text-red-500" />
			</div>
			<h1 className="mb-4 text-2xl font-bold">Unsubscribe Failed</h1>
			<p className="mb-6 text-muted-foreground">{errorMessage}</p>
			<div className="space-y-4">
				<Button
					nativeButton={false}
					variant="outline"
					render={<CustomLink href="/newsletter/unsubscribe">Try Again</CustomLink>}
					className="w-full"
				/>
				<Button
					nativeButton={false}
					variant="outline"
					render={<CustomLink href="/">Return to Homepage</CustomLink>}
					className="w-full"
				/>
			</div>
		</div>
	)
})
