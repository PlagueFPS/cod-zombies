import type { MDXComponents } from "mdx/types"
import type { ComponentPropsWithoutRef } from "react"
import { ExternalLinkIcon } from "lucide-react"
import { ExternalLink } from "@/components/external-link"
import { RichBlockquote } from "@/components/rich-blockquote"
import { Heading2, Heading3, Heading4 } from "@/components/rich-headings"
import { OrderedList, UnorderedList } from "@/components/rich-text-lists"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { isInternalHref, slugify } from "@/utils/shared-functions"
import { CustomLink } from "./custom-link"

export const mdxComponents: MDXComponents = {
	h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => <h1 {...props}>{children}</h1>,
	h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
		<Heading2 id={slugify(children as string)} {...props}>
			{children}
		</Heading2>
	),
	h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
		<Heading3 id={slugify(children as string)} {...props}>
			{children}
		</Heading3>
	),
	h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => (
		<Heading4 id={slugify(children as string)} {...props}>
			{children}
		</Heading4>
	),
	a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
		if (href && isInternalHref(href)) {
			return (
				<CustomLink
					href={href}
					{...props}
					className="text-primary underline underline-offset-4 hover:no-underline"
				>
					{children}
				</CustomLink>
			)
		}

		return (
			<ExternalLink href={href} {...props} className="inline-flex w-fit items-center">
				{children}
				<ExternalLinkIcon className="ml-1 h-4 w-4" />
			</ExternalLink>
		)
	},
	ul: ({ children, ...props }: ComponentPropsWithoutRef<"ul">) => (
		<UnorderedList {...props}>{children}</UnorderedList>
	),
	ol: ({ children, ...props }: ComponentPropsWithoutRef<"ol">) => (
		<OrderedList {...props}>{children}</OrderedList>
	),
	blockquote: ({ children, ...props }: ComponentPropsWithoutRef<"blockquote">) => (
		<RichBlockquote {...props}>{children}</RichBlockquote>
	),
	hr: ({ children, ...props }: ComponentPropsWithoutRef<"hr">) => (
		<hr {...props} className="my-2" />
	),

	// MDX table mappings -> styled UI table
	table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
		<div className="my-8 overflow-x-auto rounded-lg border shadow-xl dark:shadow-none">
			<Table {...props}>{children}</Table>
		</div>
	),
	thead: ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
		<TableHeader className="rounded-t-xl dark:border-orange-700" {...props}>
			{children}
		</TableHeader>
	),
	tbody: ({ children, ...props }: ComponentPropsWithoutRef<"tbody">) => (
		<TableBody {...props}>{children}</TableBody>
	),
	tr: ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => (
		<TableRow
			className="text-orange-800 odd:bg-orange-50 hover:bg-orange-100 dark:text-orange-200 dark:odd:bg-muted/10 dark:hover:bg-muted/50"
			{...props}
		>
			{children}
		</TableRow>
	),
	th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => (
		<TableHead className="text-orange-900 dark:text-orange-400" {...props}>
			{children}
		</TableHead>
	),
	td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => (
		<TableCell {...props}>{children}</TableCell>
	),
}

export function mergeMdxComponents(overrides?: MDXComponents): MDXComponents {
	return { ...mdxComponents, ...overrides }
}
