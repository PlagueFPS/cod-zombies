import type { CollectionConfig } from "payload"

export const users: CollectionConfig = {
	slug: "users",
	admin: {
		useAsTitle: "email",
	},
	fields: [],
}
