import type { MDXComponents } from "mdx/types"
import type { Route } from "next"
import type { ComponentPropsWithoutRef } from "react"
import { ExternalLinkIcon } from "lucide-react"
import { CustomLink } from "./components/custom-link/custom-link"
import ExternalLink from "./components/external-link/external-link"
import RichBlockquote from "./components/rich-text/rich-blockquote/rich-blockquote"
import Heading2 from "./components/rich-text/rich-headings/heading2/heading2"
import Heading3 from "./components/rich-text/rich-headings/heading3/heading3"
import Heading4 from "./components/rich-text/rich-headings/heading4/heading4"
import { OrderedList, UnorderedList } from "./components/rich-text/rich-text-lists/rich-text-lists"

const components: MDXComponents = {
	h1: ({ children, ...props }: ComponentPropsWithoutRef<"h1">) => <h1 {...props}>{children}</h1>,
	h2: ({ children, ...props }: ComponentPropsWithoutRef<"h2">) => (
		<Heading2 {...props}>{children}</Heading2>
	),
	h3: ({ children, ...props }: ComponentPropsWithoutRef<"h3">) => (
		<Heading3 {...props}>{children}</Heading3>
	),
	h4: ({ children, ...props }: ComponentPropsWithoutRef<"h4">) => (
		<Heading4 {...props}>{children}</Heading4>
	),
	a: ({ href, children, ...props }: ComponentPropsWithoutRef<"a">) => {
		if (href?.startsWith("#")) return (
			<a {...props} className="inline-flex font-medium text-orange-600 underline underline-offset-4 transition-all hover:no-underline dark:text-primary">
				{children}
			</a>
		)
		if (href?.startsWith("/"))
			return (
				<CustomLink href={href as Route} {...props}
				className="inline-flex font-medium text-orange-600 underline underline-offset-4 transition-all hover:no-underline dark:text-primary"
				>
					{children}
				</CustomLink>
			)
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
	table: ({ children, ...props }: ComponentPropsWithoutRef<"table">) => (
		<table {...props}>{children}</table>
	),
	tr: ({ children, ...props }: ComponentPropsWithoutRef<"tr">) => <tr {...props}>{children}</tr>,
	td: ({ children, ...props }: ComponentPropsWithoutRef<"td">) => <td {...props}>{children}</td>,
	th: ({ children, ...props }: ComponentPropsWithoutRef<"th">) => <th {...props}>{children}</th>,
	tbody: ({ children, ...props }: ComponentPropsWithoutRef<"tbody">) => (
		<tbody {...props}>{children}</tbody>
	),
	thead: ({ children, ...props }: ComponentPropsWithoutRef<"thead">) => (
		<thead {...props}>{children}</thead>
	),
	hr: ({ children, ...props }: ComponentPropsWithoutRef<"hr">) => <hr {...props} className="my-2" />,
}

export function useMDXComponents(): MDXComponents {
	return components
}
