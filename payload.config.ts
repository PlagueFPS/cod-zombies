import { sqliteAdapter } from "@payloadcms/db-sqlite"
import { lexicalEditor } from "@payloadcms/richtext-lexical"
import { Redacted } from "effect"
import { buildConfig } from "payload"
import { AmmoMods } from "./collections/ammo-mods"
import { FieldUpgrades } from "./collections/field-upgrades"
import { Games } from "./collections/games"
import { Gobblegum } from "./collections/gobblegum"
import { Legal } from "./collections/legal"
import { MainQuests } from "./collections/main-quests"
import { Maps } from "./collections/maps"
import { Media } from "./collections/media"
import { Perks } from "./collections/perks"
import { SideQuests } from "./collections/side-quests"
import { Users } from "./collections/users"
import { WeaponBuilds } from "./collections/weapon-builds"
import { Weapons } from "./collections/weapons"
import { ZombieAttacks } from "./collections/zombie-attacks"
import { Zombies } from "./collections/zombies"
import { env } from "./env"

export default buildConfig({
	secret: Redacted.value(env.PAYLOAD_SECRET),
	serverURL: env.NEXT_PUBLIC_WEBSITE_URL,
	routes: {
		api: "/api/payload",
	},
	folders: {
		debug: true,
	},
	upload: {
		debug: true,
		safeFileNames: true,
		limits: {
			fileSize: 1_000_000, // 1MB
		},
	},
	editor: lexicalEditor(),
	db: sqliteAdapter({
		client: {
			url: Redacted.value(env.DATABASE_URL),
			authToken: Redacted.value(env.DATABASE_TOKEN),
		},
		migrationDir: "./data/db/migrations",
		generateSchemaOutputFile: "./data/db/payload-generated.schema.ts",
	}),
	collections: [
		Users,
		Media,
		Maps,
		Games,
		MainQuests,
		SideQuests,
		Zombies,
		Gobblegum,
		Perks,
		AmmoMods,
		FieldUpgrades,
		ZombieAttacks,
		Weapons,
		WeaponBuilds,
		Legal,
	],
})
