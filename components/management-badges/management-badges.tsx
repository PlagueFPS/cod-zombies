import { draftMode } from "next/headers"
import { IN_DEVELOPMENT } from "@/utils/constants"
import { ChangedBadge, DraftBadge } from "../custom-badges/custom-badges"

export async function ManagementBadges<T extends { isDraft: boolean; isChanged: boolean }>({
	entry,
}: {
	entry: T
}) {
	const { isEnabled } = await draftMode()
	if (!isEnabled || !IN_DEVELOPMENT) return null

	return (
		<>
			{entry.isDraft && <DraftBadge />}
			{entry.isChanged && <ChangedBadge />}
		</>
	)
}
