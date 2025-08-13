import type {
	ChainModifiers,
	Entry,
	EntryFieldTypes,
	EntrySkeletonType,
	LocaleCode,
} from "contentful"

export type Date = `${number}-${number}-${number}T${number}:${number}:${number}Z`
export type ZombieItem =
	| Entry<TypeAmmoModsSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
	| Entry<TypeFieldUpgradesSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
	| Entry<TypeGobblegumsSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
	| Entry<TypePerksSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
	| Entry<TypeWeaponBuildsSkeleton, "WITHOUT_UNRESOLVABLE_LINKS", string>
export interface TypeAmmoModsFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>
	image: EntryFieldTypes.AssetLink
	description: EntryFieldTypes.Text
}

export type TypeAmmoModsSkeleton = EntrySkeletonType<TypeAmmoModsFields, "ammoMods">
export type TypeAmmoMods<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeAmmoModsSkeleton,
	Modifiers,
	Locales
>

export interface TypeFeaturedMapsFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	releaseDate: EntryFieldTypes.Date
	isComingSoon?: EntryFieldTypes.Boolean
	difficulty?: EntryFieldTypes.Symbol<"Easy" | "Hard" | "Medium">
	gameCategory: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>
	image: EntryFieldTypes.AssetLink
	description: EntryFieldTypes.Text
	body: EntryFieldTypes.RichText
}

export type TypeFeaturedMapsSkeleton = EntrySkeletonType<TypeFeaturedMapsFields, "featuredMaps">
export type TypeFeaturedMaps<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeFeaturedMapsSkeleton,
	Modifiers,
	Locales
>

export interface TypeFieldUpgradesFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>
	image: EntryFieldTypes.AssetLink
	description: EntryFieldTypes.Text
}

export type TypeFieldUpgradesSkeleton = EntrySkeletonType<TypeFieldUpgradesFields, "fieldUpgrades">
export type TypeFieldUpgrades<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeFieldUpgradesSkeleton,
	Modifiers,
	Locales
>

export interface TypeGameCategoryFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	isComingSoon?: EntryFieldTypes.Boolean
	releaseDate: EntryFieldTypes.Date
	image: EntryFieldTypes.AssetLink
}

export type TypeGameCategorySkeleton = EntrySkeletonType<TypeGameCategoryFields, "gameCategory">
export type TypeGameCategory<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeGameCategorySkeleton,
	Modifiers,
	Locales
>

export interface TypeGobblegumsFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	rarity: EntryFieldTypes.Symbol<
		"Classic" | "Epic" | "Legendary" | "Mega" | "Rare" | "Rare-Mega" | "Ultra" | "Ultra-Rare Mega"
	>
	type?: EntryFieldTypes.Symbol<"Immediate" | "Player-Activated" | "Round-Based" | "Time-Based">
	game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>
	image: EntryFieldTypes.AssetLink
	description: EntryFieldTypes.Text
}

export type TypeGobblegumType =
	| "Immediate"
	| "Player-Activated"
	| "Round-Based"
	| "Time-Based"
	| undefined
export type TypeGobblegumRarity =
	| "Classic"
	| "Epic"
	| "Legendary"
	| "Mega"
	| "Rare"
	| "Rare-Mega"
	| "Ultra"
	| "Ultra-Rare Mega"
export type TypeGobblegumsSkeleton = EntrySkeletonType<TypeGobblegumsFields, "gobblegums">
export type TypeGobblegums<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeGobblegumsSkeleton,
	Modifiers,
	Locales
>

export interface TypePerksFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>
	image: EntryFieldTypes.AssetLink
	description: EntryFieldTypes.Text
}

export type TypePerksSkeleton = EntrySkeletonType<TypePerksFields, "perks">
export type TypePerks<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypePerksSkeleton,
	Modifiers,
	Locales
>

export interface TypeReferencedMapsFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	releaseDate: EntryFieldTypes.Date
}

export type TypeReferencedMapsSkeleton = EntrySkeletonType<
	TypeReferencedMapsFields,
	"referencedMaps"
>
export type TypeReferencedMaps<
	Modifiers extends ChainModifiers,
	Locales extends LocaleCode,
> = Entry<TypeReferencedMapsSkeleton, Modifiers, Locales>

export interface TypeSideQuestsFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	isComingSoon?: EntryFieldTypes.Boolean
	game: EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>
	map: EntryFieldTypes.EntryLink<TypeFeaturedMapsSkeleton>
	image: EntryFieldTypes.AssetLink
	description: EntryFieldTypes.Text
	content: EntryFieldTypes.RichText
}

export type TypeSideQuestsSkeleton = EntrySkeletonType<TypeSideQuestsFields, "sideQuests">
export type TypeSideQuests<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeSideQuestsSkeleton,
	Modifiers,
	Locales
>

export interface TypeZombieAttacksFields {
	name: EntryFieldTypes.Symbol
	range: EntryFieldTypes.Symbol<"Long" | "Medium" | "Short">
	description: EntryFieldTypes.Text
}

export type TypeZombieAttacksSkeleton = EntrySkeletonType<TypeZombieAttacksFields, "zombieAttacks">
export type TypeZombieAttacks<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeZombieAttacksSkeleton,
	Modifiers,
	Locales
>

export interface TypeZombiesFields {
	name: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	releaseDate: EntryFieldTypes.Date
	isComingSoon?: EntryFieldTypes.Boolean
	description: EntryFieldTypes.Symbol
	image: EntryFieldTypes.AssetLink
	type: EntryFieldTypes.Symbol<"Boss" | "Elite" | "Normal" | "Special">
	games: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeGameCategorySkeleton>>
	maps: EntryFieldTypes.Array<
		EntryFieldTypes.EntryLink<TypeFeaturedMapsSkeleton | TypeReferencedMapsSkeleton>
	>
	elementalWeakness?: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeAmmoModsSkeleton>>
	attacks: EntryFieldTypes.Array<EntryFieldTypes.EntryLink<TypeZombieAttacksSkeleton>>
	weakPoints: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
	speed: EntryFieldTypes.Symbol<"Fast" | "Medium" | "Slow">
	spawnBehavior: EntryFieldTypes.Symbol
	combatStrategy: EntryFieldTypes.RichText
}

export type TypeZombiesSkeleton = EntrySkeletonType<TypeZombiesFields, "zombies">
export type TypeZombies<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeZombiesSkeleton,
	Modifiers,
	Locales
>

export interface TypeWeaponFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
}

export type TypeWeaponSkeleton = EntrySkeletonType<TypeWeaponFields, "weapon">
export type TypeWeapon<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeWeaponSkeleton,
	Modifiers,
	Locales
>

export interface TypeWeaponBuildsFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	weapon: EntryFieldTypes.EntryLink<TypeWeaponSkeleton>
	attachments: EntryFieldTypes.Array<EntryFieldTypes.Symbol>
}

export type TypeWeaponBuildsSkeleton = EntrySkeletonType<TypeWeaponBuildsFields, "weaponBuilds">
export type TypeWeaponBuilds<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeWeaponBuildsSkeleton,
	Modifiers,
	Locales
>

export interface TypeLegalFields {
	title: EntryFieldTypes.Symbol
	slug: EntryFieldTypes.Symbol
	content: EntryFieldTypes.RichText
}

export type TypeLegalSkeleton = EntrySkeletonType<TypeLegalFields, "legal">
export type TypeLegal<Modifiers extends ChainModifiers, Locales extends LocaleCode> = Entry<
	TypeLegalSkeleton,
	Modifiers,
	Locales
>
