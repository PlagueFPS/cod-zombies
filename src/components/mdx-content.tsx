import type { MDXComponents, MDXContent as MDXComponentType } from "mdx/types"
import { mergeMdxComponents } from "@/components/mdx-components"

export interface MdxContentProps {
	Component: MDXComponentType
	components?: MDXComponents
}

export function MdxContent({ Component, components }: MdxContentProps) {
	const merged = mergeMdxComponents(components)
	return <Component components={merged} />
}
