import type { Access } from "payload"

export const anyone: Access = () => true
export const isAuthenticated: Access = ({ req: { user } }) => Boolean(user)
export const isAuthenticatedOrPublished: Access = ({ req: { user } }) => {
	if (user) return true

	return {
		_status: {
			equals: "published",
		},
	}
}
export const isAdmin: Access = ({ req: { user } }) => {
	if (user?.role === "admin") return true

	return false
}
