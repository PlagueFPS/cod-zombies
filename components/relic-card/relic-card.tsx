import type { Relic } from "@/data/relics"
import { Option } from "effect"
import { ComingSoonBadge, NewBadge } from "@/components/custom-badges/custom-badges"
import { useIsMobile } from "@/hooks/use-mobile"

interface RelicCardProps {
	relic: Omit<Relic, "content">
	relicIndex: number
}

export default function RelicCard({ relic, relicIndex }: RelicCardProps) {
	const isMobile = useIsMobile()
	const _preload = isMobile ? relicIndex === 0 : relicIndex <= 3
	const { disabled, stateBadge, tabIndex } = Option.match(Option.fromNullable(relic.state), {
		onNone: () => ({
			disabled: false,
			tabIndex: 0,
			stateBadge: null,
		}),
		onSome: state => {
			const isComingSoon = state === "Coming Soon"
			return {
				disabled: isComingSoon,
				tabIndex: isComingSoon ? -1 : 0,
				stateBadge: isComingSoon ? <ComingSoonBadge /> : <NewBadge />,
			}
		},
	})

	// TODO: Implement Relic Card
	return <div />
}
