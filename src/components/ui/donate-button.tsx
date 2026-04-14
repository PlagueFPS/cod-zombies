"use client"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DonateButton() {
	return (
		<Button
			variant={"outline"}
			size={"sm"}
			className="flex items-center gap-2 border-green-500 bg-green-300 hover:bg-green-400 dark:border-green-600 dark:bg-green-800 hover:dark:bg-green-600"
			nativeButton={false}
			render={
				<a href="https://ko-fi.com/codzombiesguides" target="_blank" rel="noopener noreferrer">
					<Heart className="text-red-800 dark:text-red-400" />
					Support Us
				</a>
			}
		/>
	)
}
