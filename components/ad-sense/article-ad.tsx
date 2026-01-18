"use client"
import Script from "next/script"
import { useId } from "react"

export default function ArticleAd() {
	const adId = useId()

	return (
		<>
			<Script
				src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2572200153117332"
				crossOrigin="anonymous"
			/>
			<ins
				className="adsbygoogle"
				style={{ display: "block", textAlign: "center" }}
				data-ad-layout="in-article"
				data-ad-format="fluid"
				data-ad-client="ca-pub-2572200153117332"
				data-ad-slot="9151400933"
			/>
			<Script id={`article-ad-${adId}`}>(adsbygoogle = window.adsbygoogle || []).push({});</Script>
		</>
	)
}
