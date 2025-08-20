import { IN_DEVELOPMENT } from "@/utils/constants"
import { ChangedBadge, DraftBadge } from "../custom-badges/custom-badges"

export function ManagementBadges<T extends { isDraft: boolean; isChanged: boolean }>({
	entry,
}: {
	entry: T
}) {
	if (!IN_DEVELOPMENT) return null

	return (
		<>
			{entry.isDraft && <DraftBadge />}
			{entry.isChanged && <ChangedBadge />}
		</>
	)
}
