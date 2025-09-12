import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(sql`CREATE INDEX \`games_release_date_idx\` ON \`games\` (\`release_date\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP INDEX \`games_release_date_idx\`;`)
}
