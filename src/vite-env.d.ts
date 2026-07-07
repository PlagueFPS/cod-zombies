/// <reference types="vite/client" />

declare module "*.css" {
	const classes: { readonly [key: string]: string }
	export default classes
}

declare module "*.module.css" {
	const classes: { readonly [key: string]: string }
	export default classes
}

declare module "*?inline" {
	const content: string
	export default content
}

declare module "*?url" {
	const url: string
	export default url
}
