"use client"
import type { ErrorProps } from "@/types/errors"
import { usePathname } from "next/navigation"
import FeedbackForm from "@/components/feedback-form/feedback-form"
import { ErrorButton, ErrorDescription, ErrorTitle } from "@/components/ui/error"

export default function RootError({ error, reset }: ErrorProps) {
	const pathname = usePathname()
	console.error(error.message)

	return (
		<div className="flex h-[75vh] flex-col items-center justify-center gap-16">
			<div className="mx-auto flex flex-col items-center justify-center gap-4">
				<ErrorTitle>Oh no! Something went wrong!</ErrorTitle>
				<ErrorDescription className="text-center">
					An error occured while viewing {pathname === "/" ? "the home page" : pathname}, if you
					continue to experience this error please use our feedback form to report the issue
				</ErrorDescription>
			</div>
			<div className="flex items-center justify-center gap-4">
				<FeedbackForm />
				<ErrorButton onClick={() => reset()} variant="destructive">
					Try again
				</ErrorButton>
			</div>
		</div>
	)
}
