import type { ErrorComponentProps } from "@tanstack/react-router"
import { useLocation } from "@tanstack/react-router"
import { useEffect } from "react"
import { LazyFeedbackForm } from "@/components/lazy-feedback-form"
import { ErrorButton, ErrorDescription, ErrorTitle } from "@/components/ui/error"

export function DefaultError({ error, reset }: ErrorComponentProps) {
	const location = useLocation()

	useEffect(() => {
		console.error(error.message)
	}, [error])

	return (
		<div className="flex h-[75vh] flex-col items-center justify-center gap-16">
			<div className="mx-auto flex flex-col items-center justify-center gap-4">
				<ErrorTitle>Oh no! Something went wrong!</ErrorTitle>
				<ErrorDescription className="text-center">
					An error occured while viewing {location.pathname}, if you continue to experience this
					error please use our feedback form to report the issue
				</ErrorDescription>
			</div>
			<div className="flex items-center justify-center gap-4">
				<LazyFeedbackForm />
				<ErrorButton onClick={() => reset()} variant="destructive">
					Try again
				</ErrorButton>
			</div>
		</div>
	)
}
