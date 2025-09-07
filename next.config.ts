import "./env"
import type { NextConfig } from "next"
import { withPayload } from "@payloadcms/next/withPayload"
import { withBotId } from "botid/next/config"

const nextConfig: NextConfig = {
	experimental: {
		ppr: true,
		serverComponentsHmrCache: true,
		reactCompiler: true,
		browserDebugInfoInTerminal: true,
	},
	typedRoutes: true,
	allowedDevOrigins: ["10.0.0.*"],
	logging: {
		fetches: {
			hmrRefreshes: true,
			fullUrl: true,
		},
	},
	images: {
		formats: ["image/webp"],
		deviceSizes: [640, 750, 828, 1080, 1200, 1920],
		qualities: [75, 100],
		remotePatterns: [
			{
				protocol: "https",
				hostname: `images.ctfassets.net`,
				pathname: `/${process.env.CONTENTFUL_SPACE_ID}/**`,
			},
			{
				protocol: "http",
				hostname: "localhost",
				port: "3000",
				pathname: "/api/payload/media/file/**",
			},
		],
		minimumCacheTTL: 31536000, // 1 year in seconds
	},
	// biome-ignore lint/suspicious/useAwait: redirects must be async
	async redirects() {
		return [
			{
				source: "/side-quests/black-ops-6/reckoning/c-a-s-t-e-r-turret-upgrade",
				destination: "/side-quests/black-ops-6/reckoning/caster-turret-upgrade",
				permanent: true,
			},
			{
				source: "/side-quests/black-ops-6/shattered-veil/s-a-m-trap-unlock",
				destination: "/side-quests/black-ops-6/shattered-veil/sam-trap-unlock",
				permanent: true,
			},
			{
				source: "/bestiary/s-a-m",
				destination: "/bestiary/sam",
				permanent: true,
			},
			{
				source: "/bestiary/kransy-soldat",
				destination: "/bestiary/krasny-soldat",
				permanent: true,
			},
			{
				source: "/bestiary/the-corruputed-keeper",
				destination: "/bestiary/the-corrupted-keeper",
				permanent: true,
			},
			{
				source: "/side-quests/black-ops-6/reckoning/free-1500-points",
				destination: "/side-quests/black-ops-6/reckoning/paintings",
				permanent: true,
			},
			{
				source: "/black-ops-1",
				destination: "/?game=black-ops-1",
				permanent: true,
			},
			{
				source: "/black-ops-2",
				destination: "/?game=black-ops-2",
				permanent: true,
			},
			{
				source: "/black-ops-3",
				destination: "/?game=black-ops-3",
				permanent: true,
			},
			{
				source: "/black-ops-4",
				destination: "/?game=black-ops-4",
				permanent: true,
			},
			{
				source: "/black-ops-cold-war",
				destination: "/?game=black-ops-cold-war",
				permanent: true,
			},
			{
				source: "/black-ops-6",
				destination: "/?game=black-ops-6",
				permanent: true,
			},
			{
				source: "/side-quests/black-ops-6",
				destination: "/side-quests?game=black-ops-6",
				permanent: true,
			},
			{
				source: "/side-quests/black-ops-6/liberty-falls",
				destination: "/side-quests?map=liberty-falls",
				permanent: true,
			},
			{
				source: "/side-quests/black-ops-6/terminus",
				destination: "/side-quests?map=terminus",
				permanent: true,
			},
			{
				source: "/side-quests/black-ops-6/citadelle-des-morts",
				destination: "/side-quests?map=citadelle-des-morts",
				permanent: true,
			},
			{
				source: "/side-quests/black-ops-6/the-tomb",
				destination: "/side-quests?map=the-tomb",
				permanent: true,
			},
		]
	},
}

export default withBotId(withPayload(nextConfig))
