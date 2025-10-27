"use client"

import * as CollapsiblePrimitive from "@radix-ui/react-collapsible"
import { cn } from "@/lib/utils"

function Collapsible({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) {
	return <CollapsiblePrimitive.Root data-slot="collapsible" {...props} />
}

function CollapsibleTrigger({
	...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) {
	return <CollapsiblePrimitive.CollapsibleTrigger data-slot="collapsible-trigger" {...props} />
}

interface CollapsibleContentProps extends React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent> {
	/**Whether the content should animate when opening or closing. Default: `true` */
	animate?: boolean
}

function CollapsibleContent({
	animate = true,
	...props
}: CollapsibleContentProps) {
	return <CollapsiblePrimitive.CollapsibleContent data-slot="collapsible-content" {...props} className={cn(props.className, {
		"overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down": animate
	})} />
}

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
