import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(sql`CREATE INDEX \`main_quests_new_at_idx\` ON \`main_quests\` (\`new_at\`);`)
	await db.run(
		sql`CREATE INDEX \`_main_quests_v_version_version_new_at_idx\` ON \`_main_quests_v\` (\`version_new_at\`);`,
	)
	await db.run(sql`CREATE INDEX \`side_quests_new_at_idx\` ON \`side_quests\` (\`new_at\`);`)
	await db.run(
		sql`CREATE INDEX \`_side_quests_v_version_version_new_at_idx\` ON \`_side_quests_v\` (\`version_new_at\`);`,
	)
	await db.run(sql`CREATE INDEX \`zombies_new_at_idx\` ON \`zombies\` (\`new_at\`);`)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_version_version_new_at_idx\` ON \`_zombies_v\` (\`version_new_at\`);`,
	)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP INDEX \`main_quests_new_at_idx\`;`)
	await db.run(sql`DROP INDEX \`_main_quests_v_version_version_new_at_idx\`;`)
	await db.run(sql`DROP INDEX \`side_quests_new_at_idx\`;`)
	await db.run(sql`DROP INDEX \`_side_quests_v_version_version_new_at_idx\`;`)
	await db.run(sql`DROP INDEX \`zombies_new_at_idx\`;`)
	await db.run(sql`DROP INDEX \`_zombies_v_version_version_new_at_idx\`;`)
}
