import type { SortOption } from "@/components/client/grid-sort"
import type { GameKey } from "@/data/games"
import type { MainQuestDifficulty } from "@/data/main-quest-difficulty"
import type { ContentState, TimeRange } from "@/types/data"
import type { MainQuestsPaths } from "@/types/generated/content-paths.gen"
import type { MapsImagePath } from "@/types/generated/image-paths.gen"
import { Array as Arr, Option } from "effect"
import { resolveNewContentState } from "@/utils/content-state"
import { getAdjacentItems, sortDates } from "@/utils/shared-functions"

export type { MainQuestDifficulty } from "@/data/main-quest-difficulty"
export { MAIN_QUEST_DIFFICULTIES } from "@/data/main-quest-difficulty"

export interface MapEntry {
	/** The internal tag to discriminate against for type-narrowing */
	readonly _tag: "MapEntry"
	/** The unique identifier of the map */
	readonly id: string
	/** The title of the map */
	readonly title: string
	/**
	 * Release calendar day as an ISO 8601 date-only string (`YYYY-MM-DD`).
	 * Same-day ordering for descending sorts uses {@link MAPS} insertion order (later entries first).
	 */
	readonly releaseDate: string
	/** The description of the map */
	readonly description: string
	/** The image of the map */
	readonly image: MapsImagePath
	/** The game the map is from */
	readonly game: GameKey
	/** The path to the maps main quest content */
	readonly mainQuest: Option.Option<MainQuestsPaths>
	/** The difficulty of the maps main quest */
	readonly difficulty: Option.Option<MainQuestDifficulty>
	/** The state of the maps main quest. A stored value of `"New"` is time-limited after `releaseDate` (see `resolveNewContentState`). */
	readonly state: Option.Option<ContentState>
	/** The estimated min/max time to completion of the maps main quest */
	readonly estimatedTimeMins: Option.Option<TimeRange>
}

function withResolvedMapState(map: MapEntry): MapEntry {
	const nowMs = Date.now()
	return {
		...map,
		state: resolveNewContentState(map.state, map.releaseDate, nowMs),
	}
}

/** Union type of all map keys */
export type MapKey = Parameters<(typeof MAPS)["get"]>[0]

/**
 * Newest-first: {@link sortDates}, then higher {@link MAPS} insertion index when calendar days tie.
 */
export function compareMapReleaseDescending(
	a: Pick<MapEntry, "id" | "releaseDate">,
	b: Pick<MapEntry, "id" | "releaseDate">,
): number {
	const byDate = sortDates(b.releaseDate, a.releaseDate)
	if (byDate !== 0) return byDate

	return (
		MAP_INSERATION_INDEX_BY_ID.get(b.id as MapKey)! -
		MAP_INSERATION_INDEX_BY_ID.get(a.id as MapKey)!
	)
}

/** @returns A shallow copy of all maps, descending by {@link compareMapReleaseDescending}. */
export const getMaps = () =>
	Array.from(MAPS.values()).map(withResolvedMapState).sort(compareMapReleaseDescending)

/** @returns Maps that have a main quest, same order as {@link getMaps}. */
export const getMapsWithMainQuest = () => Arr.filter(getMaps(), map => Option.isSome(map.mainQuest))

/** @returns The map with the given key */
export const getMapByKey = (key: MapKey) =>
	Option.fromUndefinedOr(MAPS.get(key)).pipe(Option.map(withResolvedMapState))

/** @returns The adjacent maps of the map with the given key */
export const getAdjacentMaps = (key: MapKey) => {
	return getAdjacentItems(getMapsWithMainQuest(), key)
}

/**
 * Gets the sort options for main quests.
 * @returns An array of sort options.
 */
export const getMainQuestSortOptions = (): SortOption[] => [
	{ value: "latest", label: "Latest" },
	{ value: "oldest", label: "Oldest" },
	{ value: "difficulty-asc", label: "Difficulty: Easy to Hard" },
	{ value: "difficulty-desc", label: "Difficulty: Hard to Easy" },
	{ value: "time-asc", label: "Completion Time: Shortest to Longest" },
	{ value: "time-desc", label: "Completion Time: Longest to Shortest" },
]

export interface MainQuestTimeRangeFilter {
	readonly id: string
	readonly slug: string
	readonly title: string
	readonly minMins: number
	readonly maxMins: number
}

/** Time range options for filtering main quests by completion time (midpoint). */
export const MAIN_QUEST_TIME_RANGE_FILTERS: MainQuestTimeRangeFilter[] = [
	{ id: "under-30", slug: "under-30", title: "Under 30 min", minMins: 0, maxMins: 30 },
	{ id: "30-60", slug: "30-60", title: "30 min–1 hr", minMins: 30, maxMins: 60 },
	{ id: "60-120", slug: "60-120", title: "1–2 hrs", minMins: 60, maxMins: 120 },
	{ id: "120-plus", slug: "120-plus", title: "2+ hrs", minMins: 120, maxMins: Infinity },
]

const makeMap = <T extends string>(
	identifier: T,
	map: Omit<MapEntry, "_tag" | "id">,
): [T, MapEntry] => [
	identifier,
	{
		_tag: "MapEntry" as const,
		id: identifier,
		...map,
	},
]

const MAPS = new Map([
	makeMap("nacht-der-untoten", {
		title: "Nacht der Untoten",
		releaseDate: "2008-11-11",
		description:
			"You drove them deep into the heart of the Reich. You thought they were dead. You were wrong.",
		image: "/maps/nacht-der-untoten.webp",
		game: "world-at-war",
		mainQuest: Option.none(),
		difficulty: Option.none(),
		state: Option.none(),
		estimatedTimeMins: Option.none(),
	}),
	makeMap("verruckt", {
		title: "Verrückt",
		releaseDate: "2009-03-19",
		description:
			"Welcome to Wittenau Sanitorium, a German asylum with dark corridors, terrifying undead enemies, and even darker secrets.",
		image: "/maps/verruckt.webp",
		game: "world-at-war",
		mainQuest: Option.none(),
		difficulty: Option.none(),
		state: Option.none(),
		estimatedTimeMins: Option.none(),
	}),
	makeMap("shi-no-numa", {
		title: "Shi No Numa",
		releaseDate: "2009-06-10",
		description:
			'A "swamp of death" located in Japanese territory, surrounded by a sweltering jungle, hellhounds, and endless armies of the undead.',
		image: "/maps/shi-no-numa.webp",
		game: "world-at-war",
		mainQuest: Option.none(),
		difficulty: Option.none(),
		state: Option.none(),
		estimatedTimeMins: Option.none(),
	}),
	makeMap("der-riese", {
		title: "Der Riese",
		releaseDate: "2009-08-05",
		description:
			"The Giant is rising. Face the might of the Nazi Zombies in their heartland. This is where it all began. This is where the master plan took shape. Is this where it all ends?",
		image: "/maps/der-riese.webp",
		game: "world-at-war",
		mainQuest: Option.none(),
		difficulty: Option.none(),
		state: Option.none(),
		estimatedTimeMins: Option.none(),
	}),
	makeMap("kino-der-toten", {
		title: "Kino der Toten",
		releaseDate: "2010-11-09",
		description:
			"Battle the undead in this theatrical installment of 'Zombies'. New twists and clues could uncover the final plan. It's show time!",
		image: "/maps/kino-der-toten.webp",
		game: "black-ops-1",
		mainQuest: Option.none(),
		difficulty: Option.none(),
		state: Option.none(),
		estimatedTimeMins: Option.none(),
	}),
	makeMap("five", {
		title: '"Five"',
		releaseDate: "2010-11-09",
		description:
			'The Pentagon is under attack! Washington is going to DEFCON 1 in this installment of "Zombies".',
		image: "/maps/five.webp",
		game: "black-ops-1",
		mainQuest: Option.none(),
		difficulty: Option.none(),
		state: Option.none(),
		estimatedTimeMins: Option.none(),
	}),
	makeMap("ascension", {
		title: "Ascension",
		releaseDate: "2011-02-01",
		description:
			"The risen dead have overtaken a Soviet cosmodrome and all Hell has broken loose. The countdown to the zombie apocalypse has begun.",
		image: "/maps/ascension.webp",
		game: "black-ops-1",
		mainQuest: Option.some("content/main-quests/casimir-mechanism"),
		difficulty: Option.some("Easy"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 90,
			reason:
				"Time varies significantly based on the game (BO1/BO3), box luck, and player knowledge of the steps.",
		}),
	}),
	makeMap("call-of-the-dead", {
		title: "Call of the Dead",
		releaseDate: "2011-03-17",
		description:
			"A shipwrecked crew of fearless explorers is hopelessly stranded in an abandoned Siberian outpost. Their dream of discovering the true origins of the mysterious Element 115 unravels into a Hellish nightmare.",
		image: "/maps/call-of-the-dead.webp",
		game: "black-ops-1",
		mainQuest: Option.some("content/main-quests/ensemble-cast"),
		difficulty: Option.some("Easy"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 120,
			reason:
				"Time assumes Co-op version which takes longer and can vary based on box luck for the Wonder Weapon, and player knowledge of the steps.",
		}),
	}),
	makeMap("shangri-la", {
		title: "Shangri-La",
		releaseDate: "2011-06-28",
		description:
			"A legendary shrine lost in an exotic jungle, where the undead lurk within a treacherous labyrinth of underground caverns, deadly traps, and dark secrets.",
		image: "/maps/shangri-la.webp",
		game: "black-ops-1",
		mainQuest: Option.some("content/main-quests/time-travel-will-tell"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 90,
			max: 120,
			reason:
				"Time varies significantly based on the game (BO1/BO3), box luck, and player knowledge of the steps.",
		}),
	}),
	makeMap("moon", {
		title: "Moon",
		releaseDate: "2011-08-23",
		description:
			'"I believe that this nation should commit itself to achieving the goal, before this decade is out, of landing a man on the moon and returning him safely to the Earth." (JKF, 1961)',
		image: "/maps/moon.webp",
		game: "black-ops-1",
		mainQuest: Option.some("content/main-quests/richtofens-grand-scheme"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 120,
			reason:
				"Time varies significantly based on the game (BO1/BO3), extreme RNG, and player knowledge of the steps.",
		}),
	}),
	makeMap("tranzit", {
		title: "Tranzit",
		releaseDate: "2012-11-12",
		description:
			"Continue the fight against the undead and search for clues to the truth of what lies ahead...",
		image: "/maps/tranzit.webp",
		game: "black-ops-2",
		mainQuest: Option.some("content/main-quests/tower-of-babble"),
		difficulty: Option.some("Easy"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 150,
			reason:
				"Time varies significantly based on the chosen path, and player knowledge of the steps.",
		}),
	}),
	makeMap("die-rise", {
		title: "Die Rise",
		releaseDate: "2013-01-29",
		description:
			"Watch your step! Fight for survival atop the towers of doom, where dizzying heights and relentless undead make a deadly combination.",
		image: "/maps/die-rise.webp",
		game: "black-ops-2",
		mainQuest: Option.some("content/main-quests/high-maintenance"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 120,
			reason:
				"Time varies significantly based on the chosen path, and player knowledge of the steps.",
		}),
	}),
	makeMap("mob-of-the-dead", {
		title: "Mob of the Dead",
		releaseDate: "2013-04-16",
		description:
			"Battle the undead as you attempt to break free from the physical and metaphorical incarceration of Alcatraz Prison.",
		image: "/maps/mob-of-the-dead.webp",
		game: "black-ops-2",
		mainQuest: Option.some("content/main-quests/pop-goes-the-weasel"),
		difficulty: Option.some("Easy"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 90,
			reason: "Time varies mainly based on the player knowledge of the steps.",
		}),
	}),
	makeMap("buried", {
		title: "Buried",
		releaseDate: "2013-07-02",
		description:
			"Are you afraid of dark, tight spaces? Confront your deepest fears as you battle the undead in an underground obstacle course of mental challenges. You are now... 'Buried'.",
		image: "/maps/buried.webp",
		game: "black-ops-2",
		mainQuest: Option.some("content/main-quests/mined-games"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 120,
			reason:
				"Time varies significantly based on the player coordination and knowledge of the steps.",
		}),
	}),
	makeMap("origins", {
		title: "Origins",
		releaseDate: "2013-08-27",
		description:
			"Witness the origins of Group 935, as an ancient evil is unleashed upon the battlefields of World War I.",
		image: "/maps/origins.webp",
		game: "black-ops-2",
		mainQuest: Option.some("content/main-quests/little-lost-girl"),
		difficulty: Option.some("Very Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 90,
			max: 180,
			reason:
				"Time varies significantly based on the game (BO2/BO3), player knowledge of steps, and slight RNG.",
		}),
	}),
	makeMap("shadows-of-evil", {
		title: "Shadows of Evil",
		releaseDate: "2015-11-06",
		description:
			"Take to the streets of Morg City to combat the undead. Embrace the curse to uncover its mysteries.",
		image: "/maps/shadows-of-evil.webp",
		game: "black-ops-3",
		mainQuest: Option.some("content/main-quests/apocalypse-averted"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 90,
			reason: "Time varies slightly based on player coordination and knowledge of steps.",
		}),
	}),
	makeMap("the-giant", {
		title: "The Giant",
		releaseDate: "2015-11-06",
		description:
			"Re-awaken The Giant. Return to the secret facility where it all began, and strike at the heart of the zombie scourge.",
		image: "/maps/the-giant.webp",
		game: "black-ops-3",
		mainQuest: Option.some("content/main-quests/paradoxical-prologue"),
		difficulty: Option.some("Easy"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 5,
			max: 10,
			reason: "Time varies slightly based on use of Gobblegums.",
		}),
	}),
	makeMap("der-eisendrache", {
		title: "Der Eisendrache",
		releaseDate: "2016-02-02",
		description:
			"Bound together by a fragile alliance, our heroes pursue the scattered remnants of Group 935 to their mountain top fortress in the Austrian Alps...",
		image: "/maps/der-eisendrache.webp",
		game: "black-ops-3",
		mainQuest: Option.some("content/main-quests/my-brothers-keeper"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 90,
			reason:
				"Time varies significantly based on if Solo or Co-op and player knowledge of the steps.",
		}),
	}),
	makeMap("zetsubou-no-shima", {
		title: "Zetsubou No Shima",
		releaseDate: "2016-04-19",
		description:
			"On a remote island in the Pacific, a mysterious facility hides the secrets behind Division 9's sinister experiments...",
		image: "/maps/zetsubou-no-shima.webp",
		game: "black-ops-3",
		mainQuest: Option.some("content/main-quests/seeds-of-doubt"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 120,
			reason: "Time varies significantly based on plant RNG and player knowledge of the steps.",
		}),
	}),
	makeMap("gorod-krovi", {
		title: "Gorod Krovi",
		releaseDate: "2016-06-12",
		description:
			"As their journey nears its end, our heroes must battle ancient beasts in the war-torn ruins of Stalingrad...",
		image: "/maps/gorod-krovi.webp",
		game: "black-ops-3",
		mainQuest: Option.some("content/main-quests/love-and-war"),
		difficulty: Option.some("Very Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 90,
			max: 180,
			reason:
				"Time varies significantly based on if Solo or Co-op and player knowledge of the steps.",
		}),
	}),
	makeMap("revelations", {
		title: "Revelations",
		releaseDate: "2016-09-06",
		description:
			"The time has come to join Doctor Monty in The House, where an ancient evil threatens the survival of our heroes' immortal souls...",
		image: "/maps/revelations.webp",
		game: "black-ops-3",
		mainQuest: Option.some("content/main-quests/for-the-good-of-all"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 105,
			reason:
				"Time varies significantly based on box luck, use of Gobblegums, and player knowledge of steps.",
		}),
	}),
	makeMap("voyage-of-despair", {
		title: "Voyage of Despair",
		releaseDate: "2018-10-11",
		description:
			"Four intrepid adventurers board the RMS Titanic to pull off a daring heist involving a mysterious artifact. Little do Scarlett Rhodes, Diego Necalli, Bruno Delacroix, and Stanton Shaw suspect that a giant iceberg will be the least of their problems…",
		image: "/maps/voyage-of-despair.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/abandon-ship"),
		difficulty: Option.some("Very Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 75,
			max: 150,
			reason:
				"Time varies significantly based on if Solo or Co-op, use of Elixirs, and player knowledge of steps.",
		}),
	}),
	makeMap("ix", {
		title: "IX",
		releaseDate: "2018-10-11",
		description:
			"Transported across the Millennia, Scarlett, Diego, Bruno and Shaw find themselves caught up in a sinister ritual, where they are thrust into brutal gladiatorial combat against waves of unnatural enemies that stand between them and the High Priest of Chaos.",
		image: "/maps/ix.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/venerated-warrior"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 120,
			reason: "Time varies significantly based on use of Elixirs, and player knowledge of steps.",
		}),
	}),
	makeMap("blood-of-the-dead", {
		title: "Blood of the Dead",
		releaseDate: "2018-10-11",
		description:
			"In their mission to 'secure a better tomorrow', Richtofen, Dempsey, Takeo and Nikolai journey to a secret laboratory beneath the iconic Alcatraz, where they realize that the future they sought to secure is now in serious jeopardy.",
		image: "/maps/blood-of-the-dead.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/most-escape-alive"),
		difficulty: Option.some("Very Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 105,
			max: 180,
			reason:
				"Time varies significantly based on if Solo or Co-op, use of Elixirs, bird step RNG, and player knowledge of steps.",
		}),
	}),
	makeMap("classified", {
		title: "Classified",
		releaseDate: "2018-10-11",
		description: "Mankind must put an end to war – or war will put an end to mankind. (JFK, 1961)",
		image: "/maps/classified.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/classified"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 600,
			max: 720,
			reason:
				"Time varies significantly based on use of Elixirs and how many players are in the game. Solo is faster.",
		}),
	}),
	makeMap("dead-of-the-night", {
		title: "Dead of the Night",
		releaseDate: "2018-12-11",
		description:
			"When a party at an English mansion turns into an undead bloodbath, a phony psychic, stage-show cowboy, retired general, and bedeviled butler must fight for their lives.",
		image: "/maps/dead-of-the-night.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/trial-by-ordeal"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 150,
			reason:
				"Time varies significantly based on use of Elixirs and player knowledge of the part spawns/steps.",
		}),
	}),
	makeMap("ancient-evil", {
		title: "Ancient Evil",
		releaseDate: "2019-03-26",
		description:
			"In the hidden heart of ancient Delphi, Scarlett, Diego, Bruno, and Shaw must rescue the fabled Oracle. But who is the Undead Warlord standing in their way?",
		image: "/maps/ancient-evil.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/greek-tragedy"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 120,
			reason:
				"Time varies significantly based on use of Elixirs and player knowledge of the steps.",
		}),
	}),
	makeMap("alpha-omega", {
		title: "Alpha Omega",
		releaseDate: "2019-07-09",
		description:
			"Here at Broken Arrow, it is our Mission to Prepare for Humanity's Future and Open New Worlds.",
		image: "/maps/alpha-omega.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/electromagnetic-awakening-party"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 90,
			reason:
				"Time varies significantly based on use of Elixirs and player knowledge of the steps.",
		}),
	}),
	makeMap("tag-der-toten", {
		title: "Tag der Toten",
		releaseDate: "2019-09-23",
		description: "The Paradox Must Be Resolved.",
		image: "/maps/tag-der-toten.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/salvation-lies-above"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 75,
			max: 112.5,
			reason:
				"Time varies significantly based on use of Elixirs and player knowledge of the steps.",
		}),
	}),
	makeMap("die-maschine", {
		title: "Die Maschine",
		releaseDate: "2020-11-13",
		description:
			"Dimensional gateways opening around the globe. An undead horde threatening all of humanity. A new Cold War threat emerging from the shadows. Investigate the abandoned Nazi facility at the heart of it all.",
		image: "/maps/die-maschine.webp",
		game: "black-ops-cold-war",
		mainQuest: Option.some("content/main-quests/seal-the-deal"),
		difficulty: Option.some("Easy"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 40,
			max: 60,
			reason: "Time varies mainly based on player knowledge of the steps.",
		}),
	}),
	makeMap("firebase-z", {
		title: "Firebase Z",
		releaseDate: "2021-02-04",
		description:
			"A captured agent in the heart of the darkness. A treacherous scientist on the brink of a breakthrough. An unlikely ally out for revenge. Infiltrate Omega's Vietnam base and expose the secrets within.",
		image: "/maps/firebase-z.webp",
		game: "black-ops-cold-war",
		mainQuest: Option.some("content/main-quests/maxis-potential"),
		difficulty: Option.some("Easy"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 40,
			max: 60,
			reason: "Time varies mainly based on slight RNG and player knowledge of the steps.",
		}),
	}),
	makeMap("mauer-der-toten", {
		title: "Mauer der Toten",
		releaseDate: "2021-07-15",
		description:
			"A city divided between East and West. A fragile alliance with a familiar adversary. An old enemy rising from the shadows. Who will prevail when worlds collide?",
		image: "/maps/mauer-der-toten.webp",
		game: "black-ops-cold-war",
		mainQuest: Option.some("content/main-quests/tin-man-heart"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 90,
			reason: "Time varies mainly based on player knowledge of the steps.",
		}),
	}),
	makeMap("forsaken", {
		title: "Forsaken",
		releaseDate: "2021-10-07",
		description:
			"A secluded facility harboring a secretive operation. A colonel determined to achieve his mission no matter the cost. Infiltrate the Soviet complex and extract the lost soul who could lead to Requiem's salvation – or Omega's supremacy. This is the only way.",
		image: "/maps/forsaken.webp",
		game: "black-ops-cold-war",
		mainQuest: Option.some("content/main-quests/pyrrhic-victory"),
		difficulty: Option.some("Easy"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 40,
			max: 60,
			reason: "Time varies mainly based on player knowledge of the steps.",
		}),
	}),
	makeMap("liberty-falls", {
		title: "Liberty Falls",
		releaseDate: "2024-10-25",
		description:
			"A small town in West Virginia is caught up in the grip of a mysterious outbreak. Assess the situation, contain the threat, and find the lost scientist who may hold the key to salvation.",
		image: "/maps/liberty-falls.webp",
		game: "black-ops-6",
		mainQuest: Option.some("content/main-quests/bye-bye-dark-aether"),
		difficulty: Option.some("Easy"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 30,
			max: 45,
			reason: "Time varies slightly based on player knowledge of the steps.",
		}),
	}),
	makeMap("terminus", {
		title: "Terminus",
		releaseDate: "2024-10-25",
		description:
			"A jailbreak on a secluded island pits unlikely partners against the undead. Unlock the laboratory's secrets, recruit a strangely familiar ally, and avenge the gruesome crimes against nature.",
		image: "/maps/terminus.webp",
		game: "black-ops-6",
		mainQuest: Option.some("content/main-quests/no-mo-modi"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 75,
			reason: "Time varies slightly based on player knowledge of the steps.",
		}),
	}),
	makeMap("citadelle-des-morts", {
		title: "Citadelle des Morts",
		releaseDate: "2024-12-05",
		description:
			"A criminal hideout in an ancient castle is overrun by the undead. Find the captive demonologist, seek the Amulet, and defeat its Immortal Guardian.",
		image: "/maps/citadelle-des-morts.webp",
		game: "black-ops-6",
		mainQuest: Option.some("content/main-quests/citadelles-des-morts"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 90,
			reason: "Time varies slightly based on player knowledge of the steps.",
		}),
	}),
	makeMap("the-tomb", {
		title: "The Tomb",
		releaseDate: "2025-01-28",
		description:
			"Cursed catacombs guard a gate to a world of darkness. Follow in the footsteps of a doomed explorer. Pass the Trials of the Damned. Claim the fabled Sentinel Artifact.",
		image: "/maps/the-tomb.webp",
		game: "black-ops-6",
		mainQuest: Option.some("content/main-quests/the-tomb"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 40,
			max: 90,
			reason: "Time varies slightly based on player knowledge of the steps.",
		}),
	}),
	makeMap("shattered-veil", {
		title: "Shattered Veil",
		releaseDate: "2025-04-02",
		description:
			"A mansion with a diabolical past, caught in an Appalachian apocalypse. Free its captive souls. Come face to face with a synthetic mind. Confront a tyrant.",
		image: "/maps/shattered-veil.webp",
		game: "black-ops-6",
		mainQuest: Option.some("content/main-quests/shattered-veil"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 90,
			reason: "Time varies slightly based on player knowledge of the steps.",
		}),
	}),
	makeMap("reckoning", {
		title: "Reckoning",
		releaseDate: "2025-08-07",
		description:
			"Project Janus HQ teeters on the verge of collapse. Stabilize the Aether Reactors. Unleash the Sentinel Artifact. Complete the mission that began on Terminus.",
		image: "/maps/reckoning.webp",
		game: "black-ops-6",
		mainQuest: Option.some("content/main-quests/reckoning"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 90,
			reason: "Time varies slightly based on player knowledge of the steps and boss fight path.",
		}),
	}),
	makeMap("ashes-of-the-damned", {
		title: "Ashes of the Damned",
		releaseDate: "2025-11-14",
		description:
			"A new world, a new enemy and some strangely familiar allies. Uncover the secrets of the Dark Aether's most dangerous corner and face the primordial power of its ancient guardian.",
		image: "/maps/ashes-of-the-damned.webp",
		game: "black-ops-7",
		mainQuest: Option.some("content/main-quests/dust-to-dust"),
		difficulty: Option.some("Hard"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 75,
			max: 120,
			reason: "Time varies significantly based on player knowledge of the steps and map.",
		}),
	}),
	makeMap("astra-malorum", {
		title: "Astra Malorum",
		releaseDate: "2025-12-04",
		description:
			"In the cold depths of space, a century-old observatory guards a gateway to a dead world. Awaken the astronomer, defeat the mechanical guard, and liberate the celestial Shadowsmith!",
		image: "/maps/astra-malorum.webp",
		game: "black-ops-7",
		mainQuest: Option.some("content/main-quests/astra-malorum"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 100,
			reason:
				"Time varies slightly based on O.S.C.A.R. movement and player knowledge of the steps.",
		}),
	}),
	makeMap("paradox-junction", {
		title: "Paradox Junction",
		releaseDate: "2026-03-11",
		description:
			"Killing time was never this much fun! Play gruesome games with the creepy Twins, destroy the Dark Heart and escape the warden's temporal prison!",
		image: "/maps/paradox-junction.webp",
		game: "black-ops-7",
		mainQuest: Option.some("content/main-quests/paradox-junction"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 120,
			reason: "Time varies significantly based on player knowledge of the steps.",
		}),
	}),
	makeMap("totenreich", {
		title: "Totenreich",
		releaseDate: "2026-04-30",
		description:
			"In the frozen birth place of nuclear fire, a Group 935 research base hides sinister secrets. Awaken the steel colossus, ignite the flame of vengeance, and free the giant Shadowsmith from the Warden's icy grip!",
		image: "/maps/totenreich.webp",
		game: "black-ops-7",
		mainQuest: Option.some("content/main-quests/totenreich"),
		difficulty: Option.some("Hard"),
		state: Option.some("New"),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 120,
		}),
	}),
])

const MAP_INSERATION_INDEX_BY_ID = new Map<MapKey, number>([...MAPS.keys()].map((id, i) => [id, i]))
