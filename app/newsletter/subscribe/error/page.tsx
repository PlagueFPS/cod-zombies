import type { Metadata } from "next"
import { Effect, Option } from "effect"
import { AlertCircle } from "lucide-react"
import { CustomLink } from "@/components/client/custom-link"
import { Button } from "@/components/ui/button"
import { decodeErrorPageSearchParams } from "@/utils/validation-schemas"

export const metadata: Metadata = {
	title: "Subscribe Failed",
}

export default async function SubscribeErrorPage({
	searchParams,
}: PageProps<"/newsletter/subscribe/error">) {
	return await subscribeErrorUI(searchParams).pipe(Effect.runPromise)
}

const subscribeErrorUI = Effect.fn("SubscribeErrorPage")(function* (
	searchParams: PageProps<"/newsletter/subscribe/error">["searchParams"],
) {
	const params = yield* Effect.promise(() => searchParams)
	const { message } = yield* decodeErrorPageSearchParams(params).pipe(
		Effect.catch(() => Effect.succeed({ message: Option.none() })),
	)

	const errorMessage = Option.isSome(message)
		? message.value
		: "An error occurred during the subscribe process. You can try again using the newsletter form at the bottom of the page."

	return (
		<div className="mx-auto max-w-md px-4 py-12 text-center">
			<div className="mb-4 flex justify-center">
				<AlertCircle className="h-16 w-16 text-red-500" />
			</div>
			<h1 className="mb-4 font-bold text-2xl">Subscribe Failed</h1>
			<p className="mb-6 text-muted-foreground">{errorMessage}</p>
			<div className="space-y-4">
				<Button
					nativeButton={false}
					render={<CustomLink href="/">Return to Homepage</CustomLink>}
					className="w-full"
				/>
			</div>
		</div>
	)
})
