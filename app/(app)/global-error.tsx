"use client"
import type { ErrorProps } from "@/types/errors"
import { useEffect } from "react"
import FeedbackForm from "@/components/feedback-form/feedback-form"
import { ErrorButton, ErrorDescription, ErrorTitle } from "@/components/ui/error"
import { ThemeProvider } from "@/contexts/theme-provider"

export default function GlobalError({ error, reset }: ErrorProps) {
	useEffect(() => {
		console.error(error.message)
	}, [error])

	return (
		<html lang="en" className="bg-background">
			<body className="flex min-h-dvh flex-col">
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<main className="mt-10 mb-4 grow">
						<div className="flex h-[75vh] flex-col items-center justify-center gap-16">
							<div className="mx-auto flex flex-col items-center justify-center gap-4">
								<ErrorTitle>Oh no! Something went wrong!</ErrorTitle>
								<ErrorDescription className="text-center">
									An error occured while loading, if you continue to experience this error please
									use our feedback form to report the issue
								</ErrorDescription>
							</div>
							<div className="flex items-center justify-center gap-4">
								<FeedbackForm />
								<ErrorButton onClick={() => reset()} variant="destructive">
									Try again
								</ErrorButton>
							</div>
						</div>
					</main>
				</ThemeProvider>
			</body>
		</html>
	)
}
