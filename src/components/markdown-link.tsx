"use client"
import type { LinkProps } from "@tanstack/react-router"
import { CustomLink } from "@/components/custom-link"

interface MarkdownLinkProps extends LinkProps {
	text: string
}

export function MarkdownLink({ text, ...props }: MarkdownLinkProps) {
	return (
		<CustomLink
			{...props}
			className="inline-flex font-medium text-orange-600 underline underline-offset-4 transition-all hover:no-underline dark:text-primary"
		>
			{text}
		</CustomLink>
	)
}
