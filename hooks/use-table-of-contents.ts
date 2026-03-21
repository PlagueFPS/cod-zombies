import type { Heading } from "@/components/client/table-of-contents"
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
	const currentHeading = headings.find(heading => heading.id === activeHeading)

	useEffect(() => {
		articleRef.current = document.getElementById(articleId)
	}, [articleId])

	// Effect for handling the users scroll progress
	useEffect(() => {
		const handleScroll = () => {
			if (!articleRef.current) return

			const totalHeight = articleRef.current.scrollHeight - window.innerHeight
			const scrollPosition = window.scrollY
			const currentProgress = Math.max(Math.round((scrollPosition / totalHeight) * 100), 0)
			const progress = Math.min(currentProgress, 100)

			setProgress(progress)
		}

		window.addEventListener("scroll", handleScroll)
		return () => window.removeEventListener("scroll", handleScroll)
	}, [])

	// Effect for handling detecting the activeHeading
	useEffect(() => {
		const handleIntersection = (entries: IntersectionObserverEntry[]) => {
			entries.forEach(entry => {
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

		headings.forEach(heading => {
			const element = document.getElementById(heading.id)
			if (element) {
				observer.observe(element)
			}
		})

		return () => observer.disconnect()
	}, [headings])

	return { activeHeading, currentHeading, progress }
}
