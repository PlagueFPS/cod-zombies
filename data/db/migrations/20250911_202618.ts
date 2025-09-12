import { type MigrateDownArgs, type MigrateUpArgs, sql } from "@payloadcms/db-sqlite"

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.run(sql`CREATE TABLE \`users_sessions\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` text(36) NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`created_at\` text,
  	\`expires_at\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
	await db.run(sql`CREATE INDEX \`users_sessions_order_idx\` ON \`users_sessions\` (\`_order\`);`)
	await db.run(
		sql`CREATE INDEX \`users_sessions_parent_id_idx\` ON \`users_sessions\` (\`_parent_id\`);`,
	)
	await db.run(sql`CREATE TABLE \`users\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`role\` text DEFAULT 'member' NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`email\` text NOT NULL,
  	\`reset_password_token\` text,
  	\`reset_password_expiration\` text,
  	\`salt\` text,
  	\`hash\` text,
  	\`login_attempts\` numeric DEFAULT 0,
  	\`lock_until\` text
  );
  `)
	await db.run(sql`CREATE INDEX \`users_updated_at_idx\` ON \`users\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`users_created_at_idx\` ON \`users\` (\`created_at\`);`)
	await db.run(sql`CREATE UNIQUE INDEX \`users_email_idx\` ON \`users\` (\`email\`);`)
	await db.run(sql`CREATE TABLE \`media\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`description\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`url\` text,
  	\`thumbnail_u_r_l\` text,
  	\`filename\` text,
  	\`mime_type\` text,
  	\`filesize\` numeric,
  	\`width\` numeric,
  	\`height\` numeric,
  	\`focal_x\` numeric,
  	\`focal_y\` numeric
  );
  `)
	await db.run(sql`CREATE INDEX \`media_title_idx\` ON \`media\` (\`title\`);`)
	await db.run(sql`CREATE INDEX \`media_updated_at_idx\` ON \`media\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`media_created_at_idx\` ON \`media\` (\`created_at\`);`)
	await db.run(sql`CREATE UNIQUE INDEX \`media_filename_idx\` ON \`media\` (\`filename\`);`)
	await db.run(sql`CREATE TABLE \`maps\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`release_date\` text NOT NULL,
  	\`game_id\` text(36) NOT NULL,
  	\`image_id\` text(36) NOT NULL,
  	\`description\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`game_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`maps_title_idx\` ON \`maps\` (\`title\`);`)
	await db.run(sql`CREATE UNIQUE INDEX \`maps_slug_idx\` ON \`maps\` (\`slug\`);`)
	await db.run(sql`CREATE INDEX \`maps_release_date_idx\` ON \`maps\` (\`release_date\`);`)
	await db.run(sql`CREATE INDEX \`maps_game_idx\` ON \`maps\` (\`game_id\`);`)
	await db.run(sql`CREATE INDEX \`maps_image_idx\` ON \`maps\` (\`image_id\`);`)
	await db.run(sql`CREATE INDEX \`maps_updated_at_idx\` ON \`maps\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`maps_created_at_idx\` ON \`maps\` (\`created_at\`);`)
	await db.run(sql`CREATE TABLE \`games\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`slug\` text NOT NULL,
  	\`release_date\` text NOT NULL,
  	\`image_id\` text(36) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`games_title_idx\` ON \`games\` (\`title\`);`)
	await db.run(sql`CREATE UNIQUE INDEX \`games_slug_idx\` ON \`games\` (\`slug\`);`)
	await db.run(sql`CREATE INDEX \`games_image_idx\` ON \`games\` (\`image_id\`);`)
	await db.run(sql`CREATE INDEX \`games_updated_at_idx\` ON \`games\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`games_created_at_idx\` ON \`games\` (\`created_at\`);`)
	await db.run(sql`CREATE TABLE \`main_quests\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`new_at\` text,
  	\`state\` text,
  	\`difficulty\` text,
  	\`map_id\` text(36),
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`map_id\`) REFERENCES \`maps\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE UNIQUE INDEX \`main_quests_title_idx\` ON \`main_quests\` (\`title\`);`)
	await db.run(sql`CREATE UNIQUE INDEX \`main_quests_map_idx\` ON \`main_quests\` (\`map_id\`);`)
	await db.run(
		sql`CREATE INDEX \`main_quests_updated_at_idx\` ON \`main_quests\` (\`updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`main_quests_created_at_idx\` ON \`main_quests\` (\`created_at\`);`,
	)
	await db.run(sql`CREATE INDEX \`main_quests__status_idx\` ON \`main_quests\` (\`_status\`);`)
	await db.run(sql`CREATE TABLE \`_main_quests_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_new_at\` text,
  	\`version_state\` text,
  	\`version_difficulty\` text,
  	\`version_map_id\` text(36),
  	\`version_content\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`main_quests\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_map_id\`) REFERENCES \`maps\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(
		sql`CREATE INDEX \`_main_quests_v_parent_idx\` ON \`_main_quests_v\` (\`parent_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_main_quests_v_version_version_title_idx\` ON \`_main_quests_v\` (\`version_title\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_main_quests_v_version_version_map_idx\` ON \`_main_quests_v\` (\`version_map_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_main_quests_v_version_version_updated_at_idx\` ON \`_main_quests_v\` (\`version_updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_main_quests_v_version_version_created_at_idx\` ON \`_main_quests_v\` (\`version_created_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_main_quests_v_version_version__status_idx\` ON \`_main_quests_v\` (\`version__status\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_main_quests_v_created_at_idx\` ON \`_main_quests_v\` (\`created_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_main_quests_v_updated_at_idx\` ON \`_main_quests_v\` (\`updated_at\`);`,
	)
	await db.run(sql`CREATE INDEX \`_main_quests_v_latest_idx\` ON \`_main_quests_v\` (\`latest\`);`)
	await db.run(sql`CREATE TABLE \`side_quests\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`new_at\` text,
  	\`state\` text,
  	\`map_id\` text(36),
  	\`description\` text,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`map_id\`) REFERENCES \`maps\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`side_quests_title_idx\` ON \`side_quests\` (\`title\`);`)
	await db.run(sql`CREATE UNIQUE INDEX \`side_quests_slug_idx\` ON \`side_quests\` (\`slug\`);`)
	await db.run(sql`CREATE INDEX \`side_quests_map_idx\` ON \`side_quests\` (\`map_id\`);`)
	await db.run(
		sql`CREATE INDEX \`side_quests_updated_at_idx\` ON \`side_quests\` (\`updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`side_quests_created_at_idx\` ON \`side_quests\` (\`created_at\`);`,
	)
	await db.run(sql`CREATE INDEX \`side_quests__status_idx\` ON \`side_quests\` (\`_status\`);`)
	await db.run(sql`CREATE TABLE \`_side_quests_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_new_at\` text,
  	\`version_state\` text,
  	\`version_map_id\` text(36),
  	\`version_description\` text,
  	\`version_content\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`side_quests\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_map_id\`) REFERENCES \`maps\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(
		sql`CREATE INDEX \`_side_quests_v_parent_idx\` ON \`_side_quests_v\` (\`parent_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_side_quests_v_version_version_title_idx\` ON \`_side_quests_v\` (\`version_title\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_side_quests_v_version_version_slug_idx\` ON \`_side_quests_v\` (\`version_slug\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_side_quests_v_version_version_map_idx\` ON \`_side_quests_v\` (\`version_map_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_side_quests_v_version_version_updated_at_idx\` ON \`_side_quests_v\` (\`version_updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_side_quests_v_version_version_created_at_idx\` ON \`_side_quests_v\` (\`version_created_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_side_quests_v_version_version__status_idx\` ON \`_side_quests_v\` (\`version__status\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_side_quests_v_created_at_idx\` ON \`_side_quests_v\` (\`created_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_side_quests_v_updated_at_idx\` ON \`_side_quests_v\` (\`updated_at\`);`,
	)
	await db.run(sql`CREATE INDEX \`_side_quests_v_latest_idx\` ON \`_side_quests_v\` (\`latest\`);`)
	await db.run(sql`CREATE TABLE \`zombies\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`new_at\` text,
  	\`state\` text,
  	\`release_date\` text,
  	\`image_id\` text(36),
  	\`description\` text,
  	\`type\` text,
  	\`speed\` text,
  	\`spawn_behavior\` text,
  	\`combat_strategy\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`zombies_title_idx\` ON \`zombies\` (\`title\`);`)
	await db.run(sql`CREATE UNIQUE INDEX \`zombies_slug_idx\` ON \`zombies\` (\`slug\`);`)
	await db.run(sql`CREATE INDEX \`zombies_release_date_idx\` ON \`zombies\` (\`release_date\`);`)
	await db.run(sql`CREATE INDEX \`zombies_image_idx\` ON \`zombies\` (\`image_id\`);`)
	await db.run(sql`CREATE INDEX \`zombies_updated_at_idx\` ON \`zombies\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`zombies_created_at_idx\` ON \`zombies\` (\`created_at\`);`)
	await db.run(sql`CREATE INDEX \`zombies__status_idx\` ON \`zombies\` (\`_status\`);`)
	await db.run(sql`CREATE TABLE \`zombies_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`games_id\` text(36),
  	\`maps_id\` text(36),
  	\`weak_points_id\` text(36),
  	\`ammo_mods_id\` text(36),
  	\`zombie_attacks_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`zombies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`games_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`maps_id\`) REFERENCES \`maps\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`weak_points_id\`) REFERENCES \`weak_points\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ammo_mods_id\`) REFERENCES \`ammo_mods\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`zombie_attacks_id\`) REFERENCES \`zombie_attacks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
	await db.run(sql`CREATE INDEX \`zombies_rels_order_idx\` ON \`zombies_rels\` (\`order\`);`)
	await db.run(sql`CREATE INDEX \`zombies_rels_parent_idx\` ON \`zombies_rels\` (\`parent_id\`);`)
	await db.run(sql`CREATE INDEX \`zombies_rels_path_idx\` ON \`zombies_rels\` (\`path\`);`)
	await db.run(sql`CREATE INDEX \`zombies_rels_games_id_idx\` ON \`zombies_rels\` (\`games_id\`);`)
	await db.run(sql`CREATE INDEX \`zombies_rels_maps_id_idx\` ON \`zombies_rels\` (\`maps_id\`);`)
	await db.run(
		sql`CREATE INDEX \`zombies_rels_weak_points_id_idx\` ON \`zombies_rels\` (\`weak_points_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`zombies_rels_ammo_mods_id_idx\` ON \`zombies_rels\` (\`ammo_mods_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`zombies_rels_zombie_attacks_id_idx\` ON \`zombies_rels\` (\`zombie_attacks_id\`);`,
	)
	await db.run(sql`CREATE TABLE \`_zombies_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_new_at\` text,
  	\`version_state\` text,
  	\`version_release_date\` text,
  	\`version_image_id\` text(36),
  	\`version_description\` text,
  	\`version_type\` text,
  	\`version_speed\` text,
  	\`version_spawn_behavior\` text,
  	\`version_combat_strategy\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`zombies\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`_zombies_v_parent_idx\` ON \`_zombies_v\` (\`parent_id\`);`)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_version_version_title_idx\` ON \`_zombies_v\` (\`version_title\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_version_version_slug_idx\` ON \`_zombies_v\` (\`version_slug\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_version_version_release_date_idx\` ON \`_zombies_v\` (\`version_release_date\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_version_version_image_idx\` ON \`_zombies_v\` (\`version_image_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_version_version_updated_at_idx\` ON \`_zombies_v\` (\`version_updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_version_version_created_at_idx\` ON \`_zombies_v\` (\`version_created_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_version_version__status_idx\` ON \`_zombies_v\` (\`version__status\`);`,
	)
	await db.run(sql`CREATE INDEX \`_zombies_v_created_at_idx\` ON \`_zombies_v\` (\`created_at\`);`)
	await db.run(sql`CREATE INDEX \`_zombies_v_updated_at_idx\` ON \`_zombies_v\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`_zombies_v_latest_idx\` ON \`_zombies_v\` (\`latest\`);`)
	await db.run(sql`CREATE TABLE \`_zombies_v_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`games_id\` text(36),
  	\`maps_id\` text(36),
  	\`weak_points_id\` text(36),
  	\`ammo_mods_id\` text(36),
  	\`zombie_attacks_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`_zombies_v\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`games_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`maps_id\`) REFERENCES \`maps\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`weak_points_id\`) REFERENCES \`weak_points\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ammo_mods_id\`) REFERENCES \`ammo_mods\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`zombie_attacks_id\`) REFERENCES \`zombie_attacks\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
	await db.run(sql`CREATE INDEX \`_zombies_v_rels_order_idx\` ON \`_zombies_v_rels\` (\`order\`);`)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_rels_parent_idx\` ON \`_zombies_v_rels\` (\`parent_id\`);`,
	)
	await db.run(sql`CREATE INDEX \`_zombies_v_rels_path_idx\` ON \`_zombies_v_rels\` (\`path\`);`)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_rels_games_id_idx\` ON \`_zombies_v_rels\` (\`games_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_rels_maps_id_idx\` ON \`_zombies_v_rels\` (\`maps_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_rels_weak_points_id_idx\` ON \`_zombies_v_rels\` (\`weak_points_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_rels_ammo_mods_id_idx\` ON \`_zombies_v_rels\` (\`ammo_mods_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_zombies_v_rels_zombie_attacks_id_idx\` ON \`_zombies_v_rels\` (\`zombie_attacks_id\`);`,
	)
	await db.run(sql`CREATE TABLE \`zombie_attacks\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`range\` text NOT NULL,
  	\`description\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
	await db.run(
		sql`CREATE UNIQUE INDEX \`zombie_attacks_title_idx\` ON \`zombie_attacks\` (\`title\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`zombie_attacks_updated_at_idx\` ON \`zombie_attacks\` (\`updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`zombie_attacks_created_at_idx\` ON \`zombie_attacks\` (\`created_at\`);`,
	)
	await db.run(sql`CREATE TABLE \`weak_points\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
	await db.run(sql`CREATE UNIQUE INDEX \`weak_points_title_idx\` ON \`weak_points\` (\`title\`);`)
	await db.run(
		sql`CREATE INDEX \`weak_points_updated_at_idx\` ON \`weak_points\` (\`updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`weak_points_created_at_idx\` ON \`weak_points\` (\`created_at\`);`,
	)
	await db.run(sql`CREATE TABLE \`gobblegum\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`rarity\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`game_id\` text(36) NOT NULL,
  	\`image_id\` text(36) NOT NULL,
  	\`description\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`game_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`gobblegum_title_idx\` ON \`gobblegum\` (\`title\`);`)
	await db.run(sql`CREATE INDEX \`gobblegum_game_idx\` ON \`gobblegum\` (\`game_id\`);`)
	await db.run(sql`CREATE INDEX \`gobblegum_image_idx\` ON \`gobblegum\` (\`image_id\`);`)
	await db.run(sql`CREATE INDEX \`gobblegum_updated_at_idx\` ON \`gobblegum\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`gobblegum_created_at_idx\` ON \`gobblegum\` (\`created_at\`);`)
	await db.run(sql`CREATE TABLE \`perks\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`game_id\` text(36) NOT NULL,
  	\`image_id\` text(36) NOT NULL,
  	\`description\` text NOT NULL,
  	\`modifier\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`game_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`perks_title_idx\` ON \`perks\` (\`title\`);`)
	await db.run(sql`CREATE INDEX \`perks_game_idx\` ON \`perks\` (\`game_id\`);`)
	await db.run(sql`CREATE INDEX \`perks_image_idx\` ON \`perks\` (\`image_id\`);`)
	await db.run(sql`CREATE INDEX \`perks_updated_at_idx\` ON \`perks\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`perks_created_at_idx\` ON \`perks\` (\`created_at\`);`)
	await db.run(sql`CREATE TABLE \`ammo_mods\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`game_id\` text(36) NOT NULL,
  	\`image_id\` text(36) NOT NULL,
  	\`description\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`game_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`ammo_mods_title_idx\` ON \`ammo_mods\` (\`title\`);`)
	await db.run(sql`CREATE INDEX \`ammo_mods_game_idx\` ON \`ammo_mods\` (\`game_id\`);`)
	await db.run(sql`CREATE INDEX \`ammo_mods_image_idx\` ON \`ammo_mods\` (\`image_id\`);`)
	await db.run(sql`CREATE INDEX \`ammo_mods_updated_at_idx\` ON \`ammo_mods\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`ammo_mods_created_at_idx\` ON \`ammo_mods\` (\`created_at\`);`)
	await db.run(sql`CREATE TABLE \`field_upgrades\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`game_id\` text(36) NOT NULL,
  	\`image_id\` text(36) NOT NULL,
  	\`description\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`game_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`field_upgrades_title_idx\` ON \`field_upgrades\` (\`title\`);`)
	await db.run(sql`CREATE INDEX \`field_upgrades_game_idx\` ON \`field_upgrades\` (\`game_id\`);`)
	await db.run(sql`CREATE INDEX \`field_upgrades_image_idx\` ON \`field_upgrades\` (\`image_id\`);`)
	await db.run(
		sql`CREATE INDEX \`field_upgrades_updated_at_idx\` ON \`field_upgrades\` (\`updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`field_upgrades_created_at_idx\` ON \`field_upgrades\` (\`created_at\`);`,
	)
	await db.run(sql`CREATE TABLE \`augments\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`image_id\` text(36) NOT NULL,
  	\`description\` text NOT NULL,
  	\`perk_id\` text(36),
  	\`ammo_mod_id\` text(36),
  	\`field_upgrade_id\` text(36),
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`perk_id\`) REFERENCES \`perks\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`ammo_mod_id\`) REFERENCES \`ammo_mods\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`field_upgrade_id\`) REFERENCES \`field_upgrades\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`augments_title_idx\` ON \`augments\` (\`title\`);`)
	await db.run(sql`CREATE INDEX \`augments_image_idx\` ON \`augments\` (\`image_id\`);`)
	await db.run(sql`CREATE INDEX \`augments_perk_idx\` ON \`augments\` (\`perk_id\`);`)
	await db.run(sql`CREATE INDEX \`augments_ammo_mod_idx\` ON \`augments\` (\`ammo_mod_id\`);`)
	await db.run(
		sql`CREATE INDEX \`augments_field_upgrade_idx\` ON \`augments\` (\`field_upgrade_id\`);`,
	)
	await db.run(sql`CREATE INDEX \`augments_updated_at_idx\` ON \`augments\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`augments_created_at_idx\` ON \`augments\` (\`created_at\`);`)
	await db.run(sql`CREATE TABLE \`weapons\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`image_id\` text(36) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`weapons_title_idx\` ON \`weapons\` (\`title\`);`)
	await db.run(sql`CREATE INDEX \`weapons_image_idx\` ON \`weapons\` (\`image_id\`);`)
	await db.run(sql`CREATE INDEX \`weapons_updated_at_idx\` ON \`weapons\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`weapons_created_at_idx\` ON \`weapons\` (\`created_at\`);`)
	await db.run(sql`CREATE TABLE \`weapons_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`games_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`weapons\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`games_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
	await db.run(sql`CREATE INDEX \`weapons_rels_order_idx\` ON \`weapons_rels\` (\`order\`);`)
	await db.run(sql`CREATE INDEX \`weapons_rels_parent_idx\` ON \`weapons_rels\` (\`parent_id\`);`)
	await db.run(sql`CREATE INDEX \`weapons_rels_path_idx\` ON \`weapons_rels\` (\`path\`);`)
	await db.run(sql`CREATE INDEX \`weapons_rels_games_id_idx\` ON \`weapons_rels\` (\`games_id\`);`)
	await db.run(sql`CREATE TABLE \`weapon_builds\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`weapon_id\` text(36) NOT NULL,
  	\`build_code\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	FOREIGN KEY (\`weapon_id\`) REFERENCES \`weapons\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`weapon_builds_title_idx\` ON \`weapon_builds\` (\`title\`);`)
	await db.run(sql`CREATE INDEX \`weapon_builds_weapon_idx\` ON \`weapon_builds\` (\`weapon_id\`);`)
	await db.run(
		sql`CREATE UNIQUE INDEX \`weapon_builds_build_code_idx\` ON \`weapon_builds\` (\`build_code\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`weapon_builds_updated_at_idx\` ON \`weapon_builds\` (\`updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`weapon_builds_created_at_idx\` ON \`weapon_builds\` (\`created_at\`);`,
	)
	await db.run(sql`CREATE TABLE \`weapon_builds_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`weapon_attachments_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`weapon_builds\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`weapon_attachments_id\`) REFERENCES \`weapon_attachments\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
	await db.run(
		sql`CREATE INDEX \`weapon_builds_rels_order_idx\` ON \`weapon_builds_rels\` (\`order\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`weapon_builds_rels_parent_idx\` ON \`weapon_builds_rels\` (\`parent_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`weapon_builds_rels_path_idx\` ON \`weapon_builds_rels\` (\`path\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`weapon_builds_rels_weapon_attachments_id_idx\` ON \`weapon_builds_rels\` (\`weapon_attachments_id\`);`,
	)
	await db.run(sql`CREATE TABLE \`weapon_attachments\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text NOT NULL,
  	\`type\` text NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
	await db.run(
		sql`CREATE UNIQUE INDEX \`weapon_attachments_title_idx\` ON \`weapon_attachments\` (\`title\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`weapon_attachments_updated_at_idx\` ON \`weapon_attachments\` (\`updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`weapon_attachments_created_at_idx\` ON \`weapon_attachments\` (\`created_at\`);`,
	)
	await db.run(sql`CREATE TABLE \`legal\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`content\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft'
  );
  `)
	await db.run(sql`CREATE INDEX \`legal_title_idx\` ON \`legal\` (\`title\`);`)
	await db.run(sql`CREATE UNIQUE INDEX \`legal_slug_idx\` ON \`legal\` (\`slug\`);`)
	await db.run(sql`CREATE INDEX \`legal_updated_at_idx\` ON \`legal\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`legal_created_at_idx\` ON \`legal\` (\`created_at\`);`)
	await db.run(sql`CREATE INDEX \`legal__status_idx\` ON \`legal\` (\`_status\`);`)
	await db.run(sql`CREATE TABLE \`_legal_v\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`parent_id\` text(36),
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_content\` text,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`legal\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
	await db.run(sql`CREATE INDEX \`_legal_v_parent_idx\` ON \`_legal_v\` (\`parent_id\`);`)
	await db.run(
		sql`CREATE INDEX \`_legal_v_version_version_title_idx\` ON \`_legal_v\` (\`version_title\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_legal_v_version_version_slug_idx\` ON \`_legal_v\` (\`version_slug\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_legal_v_version_version_updated_at_idx\` ON \`_legal_v\` (\`version_updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_legal_v_version_version_created_at_idx\` ON \`_legal_v\` (\`version_created_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`_legal_v_version_version__status_idx\` ON \`_legal_v\` (\`version__status\`);`,
	)
	await db.run(sql`CREATE INDEX \`_legal_v_created_at_idx\` ON \`_legal_v\` (\`created_at\`);`)
	await db.run(sql`CREATE INDEX \`_legal_v_updated_at_idx\` ON \`_legal_v\` (\`updated_at\`);`)
	await db.run(sql`CREATE INDEX \`_legal_v_latest_idx\` ON \`_legal_v\` (\`latest\`);`)
	await db.run(sql`CREATE TABLE \`payload_locked_documents\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`global_slug\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_global_slug_idx\` ON \`payload_locked_documents\` (\`global_slug\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_updated_at_idx\` ON \`payload_locked_documents\` (\`updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_created_at_idx\` ON \`payload_locked_documents\` (\`created_at\`);`,
	)
	await db.run(sql`CREATE TABLE \`payload_locked_documents_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` text(36),
  	\`media_id\` text(36),
  	\`maps_id\` text(36),
  	\`games_id\` text(36),
  	\`main_quests_id\` text(36),
  	\`side_quests_id\` text(36),
  	\`zombies_id\` text(36),
  	\`zombie_attacks_id\` text(36),
  	\`weak_points_id\` text(36),
  	\`gobblegum_id\` text(36),
  	\`perks_id\` text(36),
  	\`ammo_mods_id\` text(36),
  	\`field_upgrades_id\` text(36),
  	\`augments_id\` text(36),
  	\`weapons_id\` text(36),
  	\`weapon_builds_id\` text(36),
  	\`weapon_attachments_id\` text(36),
  	\`legal_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_locked_documents\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`media_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`maps_id\`) REFERENCES \`maps\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`games_id\`) REFERENCES \`games\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`main_quests_id\`) REFERENCES \`main_quests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`side_quests_id\`) REFERENCES \`side_quests\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`zombies_id\`) REFERENCES \`zombies\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`zombie_attacks_id\`) REFERENCES \`zombie_attacks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`weak_points_id\`) REFERENCES \`weak_points\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`gobblegum_id\`) REFERENCES \`gobblegum\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`perks_id\`) REFERENCES \`perks\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`ammo_mods_id\`) REFERENCES \`ammo_mods\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`field_upgrades_id\`) REFERENCES \`field_upgrades\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`augments_id\`) REFERENCES \`augments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`weapons_id\`) REFERENCES \`weapons\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`weapon_builds_id\`) REFERENCES \`weapon_builds\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`weapon_attachments_id\`) REFERENCES \`weapon_attachments\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`legal_id\`) REFERENCES \`legal\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_order_idx\` ON \`payload_locked_documents_rels\` (\`order\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_parent_idx\` ON \`payload_locked_documents_rels\` (\`parent_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_path_idx\` ON \`payload_locked_documents_rels\` (\`path\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_users_id_idx\` ON \`payload_locked_documents_rels\` (\`users_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_media_id_idx\` ON \`payload_locked_documents_rels\` (\`media_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_maps_id_idx\` ON \`payload_locked_documents_rels\` (\`maps_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_games_id_idx\` ON \`payload_locked_documents_rels\` (\`games_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_main_quests_id_idx\` ON \`payload_locked_documents_rels\` (\`main_quests_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_side_quests_id_idx\` ON \`payload_locked_documents_rels\` (\`side_quests_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_zombies_id_idx\` ON \`payload_locked_documents_rels\` (\`zombies_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_zombie_attacks_id_idx\` ON \`payload_locked_documents_rels\` (\`zombie_attacks_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_weak_points_id_idx\` ON \`payload_locked_documents_rels\` (\`weak_points_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_gobblegum_id_idx\` ON \`payload_locked_documents_rels\` (\`gobblegum_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_perks_id_idx\` ON \`payload_locked_documents_rels\` (\`perks_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_ammo_mods_id_idx\` ON \`payload_locked_documents_rels\` (\`ammo_mods_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_field_upgrades_id_idx\` ON \`payload_locked_documents_rels\` (\`field_upgrades_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_augments_id_idx\` ON \`payload_locked_documents_rels\` (\`augments_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_weapons_id_idx\` ON \`payload_locked_documents_rels\` (\`weapons_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_weapon_builds_id_idx\` ON \`payload_locked_documents_rels\` (\`weapon_builds_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_weapon_attachments_id_idx\` ON \`payload_locked_documents_rels\` (\`weapon_attachments_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_locked_documents_rels_legal_id_idx\` ON \`payload_locked_documents_rels\` (\`legal_id\`);`,
	)
	await db.run(sql`CREATE TABLE \`payload_preferences\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`key\` text,
  	\`value\` text,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
	await db.run(
		sql`CREATE INDEX \`payload_preferences_key_idx\` ON \`payload_preferences\` (\`key\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_preferences_updated_at_idx\` ON \`payload_preferences\` (\`updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_preferences_created_at_idx\` ON \`payload_preferences\` (\`created_at\`);`,
	)
	await db.run(sql`CREATE TABLE \`payload_preferences_rels\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`order\` integer,
  	\`parent_id\` text(36) NOT NULL,
  	\`path\` text NOT NULL,
  	\`users_id\` text(36),
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`payload_preferences\`(\`id\`) ON UPDATE no action ON DELETE cascade,
  	FOREIGN KEY (\`users_id\`) REFERENCES \`users\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
	await db.run(
		sql`CREATE INDEX \`payload_preferences_rels_order_idx\` ON \`payload_preferences_rels\` (\`order\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_preferences_rels_parent_idx\` ON \`payload_preferences_rels\` (\`parent_id\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_preferences_rels_path_idx\` ON \`payload_preferences_rels\` (\`path\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_preferences_rels_users_id_idx\` ON \`payload_preferences_rels\` (\`users_id\`);`,
	)
	await db.run(sql`CREATE TABLE \`payload_migrations\` (
  	\`id\` text(36) PRIMARY KEY NOT NULL,
  	\`name\` text,
  	\`batch\` numeric,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL
  );
  `)
	await db.run(
		sql`CREATE INDEX \`payload_migrations_updated_at_idx\` ON \`payload_migrations\` (\`updated_at\`);`,
	)
	await db.run(
		sql`CREATE INDEX \`payload_migrations_created_at_idx\` ON \`payload_migrations\` (\`created_at\`);`,
	)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
	await db.run(sql`DROP TABLE \`users_sessions\`;`)
	await db.run(sql`DROP TABLE \`users\`;`)
	await db.run(sql`DROP TABLE \`media\`;`)
	await db.run(sql`DROP TABLE \`maps\`;`)
	await db.run(sql`DROP TABLE \`games\`;`)
	await db.run(sql`DROP TABLE \`main_quests\`;`)
	await db.run(sql`DROP TABLE \`_main_quests_v\`;`)
	await db.run(sql`DROP TABLE \`side_quests\`;`)
	await db.run(sql`DROP TABLE \`_side_quests_v\`;`)
	await db.run(sql`DROP TABLE \`zombies\`;`)
	await db.run(sql`DROP TABLE \`zombies_rels\`;`)
	await db.run(sql`DROP TABLE \`_zombies_v\`;`)
	await db.run(sql`DROP TABLE \`_zombies_v_rels\`;`)
	await db.run(sql`DROP TABLE \`zombie_attacks\`;`)
	await db.run(sql`DROP TABLE \`weak_points\`;`)
	await db.run(sql`DROP TABLE \`gobblegum\`;`)
	await db.run(sql`DROP TABLE \`perks\`;`)
	await db.run(sql`DROP TABLE \`ammo_mods\`;`)
	await db.run(sql`DROP TABLE \`field_upgrades\`;`)
	await db.run(sql`DROP TABLE \`augments\`;`)
	await db.run(sql`DROP TABLE \`weapons\`;`)
	await db.run(sql`DROP TABLE \`weapons_rels\`;`)
	await db.run(sql`DROP TABLE \`weapon_builds\`;`)
	await db.run(sql`DROP TABLE \`weapon_builds_rels\`;`)
	await db.run(sql`DROP TABLE \`weapon_attachments\`;`)
	await db.run(sql`DROP TABLE \`legal\`;`)
	await db.run(sql`DROP TABLE \`_legal_v\`;`)
	await db.run(sql`DROP TABLE \`payload_locked_documents\`;`)
	await db.run(sql`DROP TABLE \`payload_locked_documents_rels\`;`)
	await db.run(sql`DROP TABLE \`payload_preferences\`;`)
	await db.run(sql`DROP TABLE \`payload_preferences_rels\`;`)
	await db.run(sql`DROP TABLE \`payload_migrations\`;`)
}
