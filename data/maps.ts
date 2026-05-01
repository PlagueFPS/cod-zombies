import type { SortOption } from "@/components/client/grid-sort"
import type { GameKey } from "@/data/games"
import type { ContentState, TimeRange } from "@/types/data"
import type { MainQuestsPaths } from "@/types/generated/content-paths.gen"
import type { MapsImagePath } from "@/types/generated/image-paths.gen"
import { Array as Arr, HashMap, Option } from "effect"
import { getAdjacentItems, sortReleaseDate } from "@/utils/shared-functions"

/** Union of all main quest difficulties */
export type MainQuestDifficulty = "Easy" | "Medium" | "Hard"

export interface MapEntry {
	/** The internal tag to discriminate against for type-narrowing */
	readonly _tag: "MapEntry"
	/** The unique identifier of the map */
	readonly id: string
	/** The title of the map */
	readonly title: string
	/** The release date of the map */
	readonly releaseDate: Date
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
	/** The state of the maps main quest */
	readonly state: Option.Option<ContentState>
	/** The estimated min/max time to completion of the maps main quest */
	readonly estimatedTimeMins: Option.Option<TimeRange>
}

/** Union type of all map keys */
export type MapKey = HashMap.HashMap.Key<typeof mapHashMap>

/**
 * Gets all maps sorted by release date in descending order by release date
 */
export const getMaps = (): MapEntry[] =>
	HashMap.toValues(mapHashMap).sort((a, b) => sortReleaseDate(b.releaseDate, a.releaseDate))

/** Gets all maps with a main quest in descending order by release date */
export const getMapsWithMainQuest = (): MapEntry[] =>
	Arr.filter(getMaps(), map => Option.isSome(map.mainQuest))

/**
 * Gets a map by its key.
 * @param key The key of the map.
 */
export const getMapByKey = (key: MapKey) => HashMap.get(mapHashMap, key)

/**
 * Gets the previous and next maps by their key.
 */
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

const mapHashMap = HashMap.make(
	makeMap("nacht-der-untoten", {
		title: "Nacht der Untoten",
		releaseDate: new Date("November 11, 2008 07:00 AM"),
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
		releaseDate: new Date("March 19, 2009 08:00 AM"),
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
		releaseDate: new Date("June 10, 2009 08:00 AM"),
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
		releaseDate: new Date("August 05, 2009 08:00 AM"),
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
		releaseDate: new Date("November 09, 2010 07:00 AM"),
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
		releaseDate: new Date("November 09, 2010 08:00 AM"),
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
		releaseDate: new Date("February 01, 2011 07:00 AM"),
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
		releaseDate: new Date("March 17, 2011 08:00 AM"),
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
		releaseDate: new Date("June 28, 2011 08:00 AM"),
		description:
			"A legendary shrine lost in an exotic jungle, where the undead lurk within a treacherous labyrinth of underground caverns, deadly traps, and dark secrets.",
		image: "/maps/shangri-la.webp",
		game: "black-ops-1",
		mainQuest: Option.some("content/main-quests/time-travel-will-tell"),
		difficulty: Option.some("Medium"),
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
		releaseDate: new Date("August 23, 2011 08:00 AM"),
		description:
			'"I believe that this nation should commit itself to achieving the goal, before this decade is out, of landing a man on the moon and returning him safely to the Earth." (JKF, 1961)',
		image: "/maps/moon.webp",
		game: "black-ops-1",
		mainQuest: Option.some("content/main-quests/richtofens-grand-scheme"),
		difficulty: Option.some("Easy"),
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
		releaseDate: new Date("November 12, 2012 07:00 AM"),
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
		releaseDate: new Date("January 29, 2013 07:00 AM"),
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
		releaseDate: new Date("April 16, 2013 08:00 AM"),
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
		releaseDate: new Date("July 02, 2013 08:00 AM"),
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
		releaseDate: new Date("August 27, 2013 08:00 AM"),
		description:
			"Witness the origins of Group 935, as an ancient evil is unleashed upon the battlefields of World War I.",
		image: "/maps/origins.webp",
		game: "black-ops-2",
		mainQuest: Option.some("content/main-quests/little-lost-girl"),
		difficulty: Option.some("Hard"),
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
		releaseDate: new Date("November 06, 2015 07:00 AM"),
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
		releaseDate: new Date("November 06, 2015 08:00 AM"),
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
		releaseDate: new Date("February 02, 2016 07:00 AM"),
		description:
			"Bound together by a fragile alliance, our heroes pursue the scattered remnants of Group 935 to their mountain top fortress in the Austrian Alps...",
		image: "/maps/der-eisendrache.webp",
		game: "black-ops-3",
		mainQuest: Option.some("content/main-quests/my-brothers-keeper"),
		difficulty: Option.some("Medium"),
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
		releaseDate: new Date("April 19, 2016 08:00 AM"),
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
		releaseDate: new Date("June 12, 2016 08:00 AM"),
		description:
			"As their journey nears its end, our heroes must battle ancient beasts in the war-torn ruins of Stalingrad...",
		image: "/maps/gorod-krovi.webp",
		game: "black-ops-3",
		mainQuest: Option.some("content/main-quests/love-and-war"),
		difficulty: Option.some("Hard"),
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
		releaseDate: new Date("September 06, 2016 08:00 AM"),
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
		releaseDate: new Date("October 11, 2018 12:00 AM"),
		description:
			"Four intrepid adventurers board the RMS Titanic to pull off a daring heist involving a mysterious artifact. Little do Scarlett Rhodes, Diego Necalli, Bruno Delacroix, and Stanton Shaw suspect that a giant iceberg will be the least of their problems…",
		image: "/maps/voyage-of-despair.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/abandon-ship"),
		difficulty: Option.some("Hard"),
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
		releaseDate: new Date("October 11, 2018 01:00 AM"),
		description:
			"Transported across the Millennia, Scarlett, Diego, Bruno and Shaw find themselves caught up in a sinister ritual, where they are thrust into brutal gladiatorial combat against waves of unnatural enemies that stand between them and the High Priest of Chaos.",
		image: "/maps/ix.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/venerated-warrior"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 120,
			reason: "Time varies significantly based on use of Elixirs, and player knowledge of steps.",
		}),
	}),
	makeMap("blood-of-the-dead", {
		title: "Blood of the Dead",
		releaseDate: new Date("October 11, 2018 02:00 AM"),
		description:
			"In their mission to 'secure a better tomorrow', Richtofen, Dempsey, Takeo and Nikolai journey to a secret laboratory beneath the iconic Alcatraz, where they realize that the future they sought to secure is now in serious jeopardy.",
		image: "/maps/blood-of-the-dead.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/most-escape-alive"),
		difficulty: Option.some("Hard"),
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
		releaseDate: new Date("October 11, 2018 03:00 AM"),
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
		releaseDate: new Date("December 11, 2018 12:00 AM"),
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
		releaseDate: new Date("March 26, 2019 12:00 AM"),
		description:
			"In the hidden heart of ancient Delphi, Scarlett, Diego, Bruno, and Shaw must rescue the fabled Oracle. But who is the Undead Warlord standing in their way?",
		image: "/maps/ancient-evil.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/greek-tragedy"),
		difficulty: Option.some("Medium"),
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
		releaseDate: new Date("July 09, 2019 12:00 AM"),
		description:
			"Here at Broken Arrow, it is our Mission to Prepare for Humanity's Future and Open New Worlds.",
		image: "/maps/alpha-omega.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/electromagnetic-awakening-party"),
		difficulty: Option.some("Medium"),
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
		releaseDate: new Date("September 23, 2019 12:00 AM"),
		description: "The Paradox Must Be Resolved.",
		image: "/maps/tag-der-toten.webp",
		game: "black-ops-4",
		mainQuest: Option.some("content/main-quests/salvation-lies-above"),
		difficulty: Option.some("Medium"),
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
		releaseDate: new Date("November 13, 2020 12:00 AM"),
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
		releaseDate: new Date("February 04, 2021 12:00 AM"),
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
		releaseDate: new Date("July 15, 2021 12:00 AM"),
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
		releaseDate: new Date("October 07, 2021 12:00 AM"),
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
		releaseDate: new Date("October 25, 2024 12:00 AM"),
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
		releaseDate: new Date("October 25, 2024 01:00 AM"),
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
		releaseDate: new Date("December 05, 2024 12:00 AM"),
		description:
			"A criminal hideout in an ancient castle is overrun by the undead. Find the captive demonologist, seek the Amulet, and defeat its Immortal Guardian.",
		image: "/maps/citadelle-des-morts.webp",
		game: "black-ops-6",
		mainQuest: Option.some("content/main-quests/citadelles-des-morts"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 90,
			reason: "Time varies slightly based on player knowledge of the steps.",
		}),
	}),
	makeMap("the-tomb", {
		title: "The Tomb",
		releaseDate: new Date("January 28, 2025 12:00 AM"),
		description:
			"Cursed catacombs guard a gate to a world of darkness. Follow in the footsteps of a doomed explorer. Pass the Trials of the Damned. Claim the fabled Sentinel Artifact.",
		image: "/maps/the-tomb.webp",
		game: "black-ops-6",
		mainQuest: Option.some("content/main-quests/the-tomb"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 60,
			reason: "Time varies slightly based on player knowledge of the steps.",
		}),
	}),
	makeMap("shattered-veil", {
		title: "Shattered Veil",
		releaseDate: new Date("April 02, 2025 12:00 AM"),
		description:
			"A mansion with a diabolical past, caught in an Appalachian apocalypse. Free its captive souls. Come face to face with a synthetic mind. Confront a tyrant.",
		image: "/maps/shattered-veil.webp",
		game: "black-ops-6",
		mainQuest: Option.some("content/main-quests/shattered-veil"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 75,
			reason: "Time varies slightly based on player knowledge of the steps.",
		}),
	}),
	makeMap("reckoning", {
		title: "Reckoning",
		releaseDate: new Date("August 07, 2025 12:00 AM"),
		description:
			"Project Janus HQ teeters on the verge of collapse. Stabilize the Aether Reactors. Unleash the Sentinel Artifact. Complete the mission that began on Terminus.",
		image: "/maps/reckoning.webp",
		game: "black-ops-6",
		mainQuest: Option.some("content/main-quests/reckoning"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 75,
			reason: "Time varies slightly based on player knowledge of the steps and boss fight path.",
		}),
	}),
	makeMap("ashes-of-the-damned", {
		title: "Ashes of the Damned",
		releaseDate: new Date("November 14, 2025 7:00 AM"),
		description:
			"A new world, a new enemy and some strangely familiar allies. Uncover the secrets of the Dark Aether's most dangerous corner and face the primordial power of its ancient guardian.",
		image: "/maps/ashes-of-the-damned.webp",
		game: "black-ops-7",
		mainQuest: Option.some("content/main-quests/dust-to-dust"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 75,
			max: 120,
			reason: "Time varies significantly based on player knowledge of the steps and map.",
		}),
	}),
	makeMap("astra-malorum", {
		title: "Astra Malorum",
		releaseDate: new Date("December 4, 2025 12:00 AM"),
		description:
			"In the cold depths of space, a century-old observatory guards a gateway to a dead world. Awaken the astronomer, defeat the mechanical guard, and liberate the celestial Shadowsmith!",
		image: "/maps/astra-malorum.webp",
		game: "black-ops-7",
		mainQuest: Option.some("content/main-quests/astra-malorum"),
		difficulty: Option.some("Medium"),
		state: Option.none(),
		estimatedTimeMins: Option.some({
			min: 60,
			max: 90,
			reason:
				"Time varies slightly based on O.S.C.A.R. movement and player knowledge of the steps.",
		}),
	}),
	makeMap("paradox-junction", {
		title: "Paradox Junction",
		releaseDate: new Date("March 11, 2026 12:00 AM"),
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
		releaseDate: new Date("April 30, 2026 12:00 AM"),
		description:
			"A remote Norwegian fishing town trapped in time after Group 935 experiments warped the entire island into the Dark Aether.",
		image: "/maps/totenreich-preview.webp",
		game: "black-ops-7",
		mainQuest: Option.some("content/main-quests/totenreich"),
		difficulty: Option.some("Medium"),
		state: Option.some("New"),
		estimatedTimeMins: Option.some({
			min: 45,
			max: 120,
		}),
	}),
)
