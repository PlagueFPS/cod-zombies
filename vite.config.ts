import mdx from "@mdx-js/rollup"
import babel from "@rolldown/plugin-babel"
import tailwindcss from "@tailwindcss/vite"
import { devtools } from "@tanstack/devtools-vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react, { reactCompilerPreset } from "@vitejs/plugin-react"
import rsc from "@vitejs/plugin-rsc"
import { nitro } from "nitro/vite"
import { defineConfig, type Plugin } from "vite"
import { remarkMdxMeta } from "./src/lib/remark-mdx-meta"

/**
 * Nitro's dev server skips TanStack Start for non-document-like `Sec-Fetch-Dest`
 * (e.g. `image` from img requests). That prevents `/api/image` from running locally.
 */
function stripSecFetchDestForApiImageDev(): Plugin {
	return {
		name: "strip-sec-fetch-dest-api-image-dev",
		enforce: "pre",
		configureServer(server) {
			server.middlewares.use((req, _res, next) => {
				const pathOnly = req.url?.split("?")[0] ?? ""
				if (pathOnly === "/api/image" || pathOnly.startsWith("/api/image/")) {
					delete req.headers["sec-fetch-dest"]
				}
				next()
			})
		},
	}
}

export default defineConfig({
	// Vercel injects `VERCEL_*` system env at build time; Vite only exposes keys
	// matching `envPrefix`, so without `VERCEL_` here `import.meta.env` never sees them.
	envPrefix: ["VITE_", "VERCEL_"],
	server: {
		port: 3000,
	},
	preview: {
		port: 3000,
		host: "127.0.0.1",
	},
	resolve: {
		tsconfigPaths: true,
	},
	ssr: {
		noExternal: ["embla-carousel-react", "react-lite-youtube-embed"],
	},
	optimizeDeps: {
		exclude: ["lucide-react"],
	},
	plugins: [
		stripSecFetchDestForApiImageDev(),
		devtools(),
		tanstackStart({
			prerender: {
				enabled: true,
			},
			rsc: {
				enabled: true,
			},
		}),
		rsc(),
		react(),
		babel({
			presets: [reactCompilerPreset()],
		}),
		tailwindcss(),
		{
			enforce: "pre",
			...mdx({
				jsxImportSource: "react",
				remarkPlugins: [remarkMdxMeta],
			}),
		},
		nitro({
			vercel: {
				functions: {
					runtime: "nodejs22.x",
				},
				config: {
					version: 3,
					images: {
						// leaving empty for only allowing the deployment domain to use Image Optimization
						// @see https://vercel.com/docs/build-output-api/configuration#images
						domains: [],
						formats: ["image/webp"],
						sizes: [384, 640, 750, 828, 1080, 1200, 1920],
						minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days in seconds
					},
					routes: [
						{
							src: "/side-quests/black-ops-3/revelations/permanent-pack-a-pack",
							dest: "/side-quests/black-ops-3/revelations/permanent-pack-a-punch",
							status: 308,
						},
						{
							src: "/side-quests/black-ops-7/totenreich/gnome",
							dest: "/side-quests/black-ops-7/totenreich/kneehigh-helm",
							status: 308,
						},
						{
							src: "/side-quests/black-ops-6/reckoning/c-a-s-t-e-r-turret-upgrade",
							dest: "/side-quests/black-ops-6/reckoning/caster-turret-upgrade",
							status: 308,
						},
						{
							src: "/side-quests/black-ops-6/shattered-veil/s-a-m-trap-unlock",
							dest: "/side-quests/black-ops-6/shattered-veil/sam-trap-unlock",
							status: 308,
						},
						{
							src: "/bestiary/s-a-m",
							dest: "/bestiary/sam",
							status: 308,
						},
						{
							src: "/bestiary/kransy-soldat",
							dest: "/bestiary/krasny-soldat",
							status: 308,
						},
						{
							src: "/bestiary/the-corruputed-keeper",
							dest: "/bestiary/the-corrupted-keeper",
							status: 308,
						},
						{
							src: "/side-quests/black-ops-6/reckoning/free-1500-points",
							dest: "/side-quests/black-ops-6/reckoning/paintings",
							status: 308,
						},
						{
							src: "/black-ops-1",
							dest: "/main-quests?game=black-ops-1",
							status: 308,
						},
						{
							src: "/black-ops-2",
							dest: "/main-quests?game=black-ops-2",
							status: 308,
						},
						{
							src: "/black-ops-3",
							dest: "/main-quests?game=black-ops-3",
							status: 308,
						},
						{
							src: "/black-ops-4",
							dest: "/main-quests?game=black-ops-4",
							status: 308,
						},
						{
							src: "/black-ops-cold-war",
							dest: "/main-quests?game=black-ops-cold-war",
							status: 308,
						},
						{
							src: "/black-ops-6",
							dest: "/main-quests?game=black-ops-6",
							status: 308,
						},
						{
							src: "/side-quests/black-ops-6",
							dest: "/side-quests?game=black-ops-6",
							status: 308,
						},
						{
							src: "/side-quests/black-ops-6/liberty-falls",
							dest: "/side-quests?map=liberty-falls",
							status: 308,
						},
						{
							src: "/side-quests/black-ops-6/terminus",
							dest: "/side-quests?map=terminus",
							status: 308,
						},
						{
							src: "/side-quests/black-ops-6/citadelle-des-morts",
							dest: "/side-quests?map=citadelle-des-morts",
							status: 308,
						},
						{
							src: "/side-quests/black-ops-6/the-tomb",
							dest: "/side-quests?map=the-tomb",
							status: 308,
						},
						{
							src: "^/(black-ops-1|black-ops-2|black-ops-3|black-ops-4|black-ops-cold-war|black-ops-6|black-ops-7)/([a-zA-Z0-9_-]+)/?$",
							dest: "/main-quests/$1/$2",
							status: 308,
						},
					],
				},
			},
		}),
	],
})
