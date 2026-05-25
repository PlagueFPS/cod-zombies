import { Option } from "effect"
import type { MainQuestDifficulty } from "@/data/maps"
import { mainQuestMidpointMatchesAnyTimeSlug } from "@/data/maps"
import type { TimeRange } from "@/types/data"
import { getEstimatedTimeMidpoint, slugify } from "@/utils/shared-functions"

/** Whether a main quest's difficulty slug matches any active difficulty filter param. */
export function mainQuestMatchesDifficultySlugs(
	difficulty: Option.Option<MainQuestDifficulty>,
	slugs: readonly string[],
): boolean {
	if (slugs.length === 0) return true
	if (Option.isNone(difficulty)) return false
	return slugs.includes(slugify(difficulty.value))
}

/** Whether a main quest's estimated-time midpoint falls in any active time filter bucket. */
export function mainQuestMatchesTimeSlugs(
	estimatedTimeMins: Option.Option<TimeRange>,
	slugs: readonly string[],
): boolean {
	if (slugs.length === 0) return true
	if (Option.isNone(estimatedTimeMins)) return false
	const midpoint = getEstimatedTimeMidpoint(estimatedTimeMins.value)
	return mainQuestMidpointMatchesAnyTimeSlug(midpoint, slugs)
}
