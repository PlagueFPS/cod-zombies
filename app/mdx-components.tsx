import type { MDXComponents } from "mdx/types"

const components: MDXComponents = {
	h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
}

export function useMDXComponents(): MDXComponents {
	return components
}
