import type { Heading } from "@/components/table-of-contents"
import { Array as Arr, Option, Predicate } from "effect"
import { useEffect, useRef, useState } from "react"
/**
 * @param `headings` - array of headings to observe
 * @param `articleId` - id of the parent wrapper of the headings
 * @returns `activeHeading` - the current heading id of the section within view
 * @returns `currentHeading` - the full heading object of the active heading
 * @returns `progress` - the users current progress on the page
 */

export const useTableOfContents = (headings: Heading[], articleId: string) => {
	const [activeHeading, setActiveHeading] = useState("")
	const [progress, setProgress] = useState(0)
	const articleRef = useRef<HTMLElement | null>(null)

	const currentHeading = Option.getOrUndefined(
		Arr.findFirst(headings, heading => heading.id === activeHeading),
	)

	useEffect(() => {
		articleRef.current = document.getElementById(articleId)
	}, [articleId])

	useEffect(() => {
		const handleScroll = () => {
			if (!(Predicate.isNotNullish(articleRef.current) && Predicate.isTruthy(articleRef.current)))
				return

			const totalHeight = articleRef.current.scrollHeight - window.innerHeight
			const scrollPosition = window.scrollY
			const currentProgress = Math.max(Math.round((scrollPosition / totalHeight) * 100), 0)
			const progress = Math.min(currentProgress, 100)

			setProgress(progress)
		}

		window.addEventListener("scroll", handleScroll)

		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	useEffect(() => {
		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			Arr.forEach(entries, entry => {
				if (entry.isIntersecting) {
					setActiveHeading(entry.target.id)
				}
			})
		}

		const observer = new IntersectionObserver(handleIntersection, {
			root: null,
			rootMargin: "0px 0px -75% 0px",
			threshold: 0.75,
		})

		Arr.forEach(headings, heading => {
			const element = document.getElementById(heading.id)

			if (Predicate.isNotNullish(element) && Predicate.isTruthy(element)) {
				observer.observe(element)
			}
		})

		return () => observer.disconnect()
	}, [headings])

	return { activeHeading, currentHeading, progress }
}
