import type { CollectionConfig } from "payload"
import { isAdmin } from "./access/access-control"

export const Users: CollectionConfig = {
	slug: "users",
	access: {
		admin: ({ req: { user } }) => Boolean(user),
		create: isAdmin,
		delete: isAdmin,
		read: isAdmin,
		update: isAdmin,
	},
	admin: {
		useAsTitle: "email",
		enableListViewSelectAPI: true,
		defaultColumns: ["email", "role", "id"],
	},
	auth: true,
	fields: [
		{
			name: "role",
			label: "Role",
			type: "select",
			defaultValue: "member",
			options: [
				{ label: "Admin", value: "admin" },
				{ label: "Member", value: "member" },
			],
			required: true,
		},
	],
}
