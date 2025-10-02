import { sqliteAdapter } from "@payloadcms/db-sqlite"
import { resendAdapter } from "@payloadcms/email-resend"
import {
	BlocksFeature,
	EXPERIMENTAL_TableFeature,
	FixedToolbarFeature,
	LinkFeature,
	lexicalEditor,
	RelationshipFeature,
} from "@payloadcms/richtext-lexical"
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob"
import { Redacted } from "effect"
import { buildConfig } from "payload"
import { AmmoMods } from "@/collections/ammo-mods"
import { Augments } from "@/collections/augments"
import { InlineAmmoModBlock } from "@/collections/blocks/inline-ammo-mod"
import { InlineAugmentBlock } from "@/collections/blocks/inline-augment"
import { InlineFieldUpgradeBlock } from "@/collections/blocks/inline-field-upgrade"
import { InlineGobblegumBlock } from "@/collections/blocks/inline-gobblegum"
import { InlinePerkBlock } from "@/collections/blocks/inline-perk"
import { InlineWeaponBuildBlock } from "@/collections/blocks/inline-weapon-build"
import { InlineZombiesBlock } from "@/collections/blocks/inline-zombies"
import { FieldUpgrades } from "@/collections/field-upgrades"
import { Games } from "@/collections/games"
import { Gobblegum } from "@/collections/gobblegum"
import { Legal } from "@/collections/legal"
import { MainQuests } from "@/collections/main-quests"
import { Maps } from "@/collections/maps"
import { Media } from "@/collections/media"
import { Perks } from "@/collections/perks"
import { SideQuests } from "@/collections/side-quests"
import { Users } from "@/collections/users"
import { WeakPoints } from "@/collections/weak-points"
import { WeaponAttachments } from "@/collections/weapon-attachments"
import { WeaponBuilds } from "@/collections/weapon-builds"
import { Weapons } from "@/collections/weapons"
import { ZombieAttacks } from "@/collections/zombie-attacks"
import { Zombies } from "@/collections/zombies"
import { env } from "@/env"
import { ToolBlock } from "./collections/blocks/tool"
import { YoutubeEmbedBlock } from "./collections/blocks/youtube-embed"
import { SITE_TITLE } from "./utils/constants"

export default buildConfig({
	secret: Redacted.value(env.PAYLOAD_SECRET),
	admin: {
		autoRefresh: true,
		meta: {
			titleSuffix: `- ${SITE_TITLE}`,
			defaultOGImageType: "off",
			icons: [
				{
					rel: "icon",
					type: "image/png",
					url: "/logo.png",
				},
			],
			robots: "noindex, nofollow",
		},
		livePreview: {
			breakpoints: [
				{
					name: "mobile",
					label: "Mobile",
					width: 375,
					height: 1080,
				},
				{
					name: "tablet",
					label: "Tablet",
					width: 768,
					height: 1080,
				},
				{
					name: "desktop",
					label: "Desktop",
					width: 1280,
					height: 1080,
				},
			],
		},
	},
	typescript: {
		outputFile: "./types/payload-types.ts",
	},
	routes: {
		api: "/api/payload",
	},
	upload: {
		limits: {
			fileSize: 500_000, // 500KB
		},
	},
	editor: lexicalEditor({
		features: ({ defaultFeatures }) => [
			...defaultFeatures,
			RelationshipFeature({
				disabledCollections: ["users", "media"],
			}),
			LinkFeature({
				enabledCollections: ["maps", "zombies", "sideQuests"],
			}),
			FixedToolbarFeature(),
			EXPERIMENTAL_TableFeature(),
			BlocksFeature({
				blocks: ["youtube-embed", "tool"],
				inlineBlocks: [
					"ammo-mod",
					"augment",
					"field-upgrade",
					"perk",
					"weapon-build",
					"zombie",
					"gobblegum",
				],
			}),
		],
	}),
	db: sqliteAdapter({
		client: {
			url: Redacted.value(env.DATABASE_URL),
			authToken: Redacted.value(env.DATABASE_TOKEN),
		},
		migrationDir: "./data/db/migrations",
		generateSchemaOutputFile: "./data/db/payload-generated.schema.ts",
		idType: "uuid",
		transactionOptions: {
			behavior: "deferred",
		},
	}),
	email: resendAdapter({
		defaultFromAddress: "support@codzombiesguides.com",
		defaultFromName: "COD: Zombies Guides",
		apiKey: Redacted.value(env.RESEND_API_KEY),
	}),
	blocks: [
		InlineAugmentBlock,
		InlineFieldUpgradeBlock,
		InlinePerkBlock,
		InlineWeaponBuildBlock,
		InlineZombiesBlock,
		InlineGobblegumBlock,
		InlineAmmoModBlock,
		YoutubeEmbedBlock,
		ToolBlock,
	],
	collections: [
		Users,
		Media,
		Maps,
		Games,
		MainQuests,
		SideQuests,
		Zombies,
		ZombieAttacks,
		WeakPoints,
		Gobblegum,
		Perks,
		AmmoMods,
		FieldUpgrades,
		Augments,
		Weapons,
		WeaponBuilds,
		WeaponAttachments,
		Legal,
	],
	plugins: [
		vercelBlobStorage({
			enabled:
				Redacted.value(env.VERCEL_ENV) === "production" ||
				Redacted.value(env.VERCEL_ENV) === "preview",
			clientUploads: true,
			collections: {
				media: true,
			},
			token: Redacted.value(env.STORAGE_READ_WRITE_TOKEN),
		}),
	],
})
