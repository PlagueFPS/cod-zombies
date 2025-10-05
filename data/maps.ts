import { sortReleaseDateDesc } from "@/utils/functions.client"
import {
	blackOps1,
	blackOps2,
	blackOps3,
	blackOps4,
	blackOps6,
	blackOpsColdWar,
	type Game,
	worldAtWar,
} from "./games"

/**
 * Gets all maps.
 * @returns An array of maps.
 */
export const getMaps = (): Maps[] =>
	Object.values(mapRegistry).sort((a, b) => sortReleaseDateDesc(a.releaseDate, b.releaseDate))
/**
 * Gets a map by its key.
 * @param key The key of the map.
 * @returns The map.
 */
export const getMapByKey = (key: MapKey): Maps => mapRegistry[key]

export interface Maps {
	/** The unique identifier of the map */
	id: string
	/** The title of the map */
	title: string
	/** The release date of the map */
	releaseDate: Date
	/** The description of the map */
	description: string
	/** The image of the map */
	image: string
	/** The game the map is from */
	game: Game
}

const mapRegistry = {
	nachtDerUntoten: {
		id: "nacht-der-untoten",
		title: "Nacht der Untoten",
		releaseDate: new Date("November 11, 2008 07:00 AM"),
		description:
			"You drove them deep into the heart of the Reich. You thought they were dead. You were wrong.",
		image: "/maps/nacht-der-untoten.webp",
		game: worldAtWar,
	},
	verruckt: {
		id: "verruckt",
		title: "Verrückt",
		releaseDate: new Date("March 19, 2009 08:00 AM"),
		description:
			"Welcome to Wittenau Sanitorium, a German asylum with dark corridors, terrifying undead enemies, and even darker secrets.",
		image: "/maps/verruckt.webp",
		game: worldAtWar,
	},
	shiNoNuma: {
		id: "shi-no-numa",
		title: "Shi No Numa",
		releaseDate: new Date("June 10, 2009 08:00 AM"),
		description:
			'A "swamp of death" located in Japanese territory, surrounded by a sweltering jungle, hellhounds, and endless armies of the undead.',
		image: "/maps/shi-no-numa.webp",
		game: worldAtWar,
	},
	derRiese: {
		id: "der-riese",
		title: "Der Riese",
		releaseDate: new Date("August 05, 2009 08:00 AM"),
		description:
			"The Giant is rising. Face the might of the Nazi Zombies in their heartland. This is where it all began. This is where the master plan took shape. Is this where it all ends?",
		image: "/maps/der-riese.webp",
		game: worldAtWar,
	},
	kinoDerToten: {
		id: "kino-der-toten",
		title: "Kino der Toten",
		releaseDate: new Date("November 09, 2010 07:00 AM"),
		description:
			"Battle the undead in this theatrical installment of 'Zombies'. New twists and clues could uncover the final plan. It's show time!",
		image: "/maps/kino-der-toten.webp",
		game: blackOps1,
	},
	five: {
		id: "five",
		title: '"Five"',
		releaseDate: new Date("November 09, 2010 08:00 AM"),
		description:
			'The Pentagon is under attack! Washington is going to DEFCON 1 in this installment of "Zombies".',
		image: "/maps/five.webp",
		game: blackOps1,
	},
	ascension: {
		id: "ascension",
		title: "Ascension",
		releaseDate: new Date("February 01, 2011 07:00 AM"),
		description:
			"The risen dead have overtaken a Soviet cosmodrome and all Hell has broken loose. The countdown to the zombie apocalypse has begun.",
		image: "/maps/ascension.webp",
		game: blackOps1,
	},
	callOfTheDead: {
		id: "call-of-the-dead",
		title: "Call of the Dead",
		releaseDate: new Date("March 17, 2011 08:00 AM"),
		description:
			"A shipwrecked crew of fearless explorers is hopelessly stranded in an abandoned Siberian outpost. Their dream of discovering the true origins of the mysterious Element 115 unravels into a Hellish nightmare.",
		image: "/maps/call-of-the-dead.webp",
		game: blackOps1,
	},
	shangriLa: {
		id: "shangri-la",
		title: "Shangri-La",
		releaseDate: new Date("June 28, 2011 08:00 AM"),
		description:
			"A legendary shrine lost in an exotic jungle, where the undead lurk within a treacherous labyrinth of underground caverns, deadly traps, and dark secrets.",
		image: "/maps/shangri-la.webp",
		game: blackOps1,
	},
	moon: {
		id: "moon",
		title: "Moon",
		releaseDate: new Date("August 23, 2011 08:00 AM"),
		description:
			'"I believe that this nation should commit itself to achieving the goal, before this decade is out, of landing a man on the moon and returning him safely to the Earth." (JKF, 1961)',
		image: "/maps/moon.webp",
		game: blackOps1,
	},
	tranzit: {
		id: "tranzit",
		title: "Tranzit",
		releaseDate: new Date("November 12, 2012 07:00 AM"),
		description:
			"Continue the fight against the undead and search for clues to the truth of what lies ahead...",
		image: "/maps/tranzit.webp",
		game: blackOps2,
	},
	dieRise: {
		id: "die-rise",
		title: "Die Rise",
		releaseDate: new Date("January 29, 2013 07:00 AM"),
		description:
			"Watch your step! Fight for survival atop the towers of doom, where dizzying heights and relentless undead make a deadly combination.",
		image: "/maps/die-rise.webp",
		game: blackOps2,
	},
	mobOfTheDead: {
		id: "mob-of-the-dead",
		title: "Mob of the Dead",
		releaseDate: new Date("April 16, 2013 08:00 AM"),
		description:
			"Battle the undead as you attempt to break free from the physical and metaphorical incarceration of Alcatraz Prison.",
		image: "/maps/mob-of-the-dead.webp",
		game: blackOps2,
	},
	buried: {
		id: "buried",
		title: "Buried",
		releaseDate: new Date("July 02, 2013 08:00 AM"),
		description:
			"Are you afraid of dark, tight spaces? Confront your deepest fears as you battle the undead in an underground obstacle course of mental challenges. You are now... 'Buried'.",
		image: "/maps/buried.webp",
		game: blackOps2,
	},
	origins: {
		id: "origins",
		title: "Origins",
		releaseDate: new Date("August 27, 2013 08:00 AM"),
		description:
			"Witness the origins of Group 935, as an ancient evil is unleashed upon the battlefields of World War I.",
		image: "/maps/origins.webp",
		game: blackOps2,
	},
	shadowsOfEvil: {
		id: "shadows-of-evil",
		title: "Shadows of Evil",
		releaseDate: new Date("November 06, 2015 07:00 AM"),
		description:
			"Take to the streets of Morg City to combat the undead. Embrace the curse to uncover its mysteries.",
		image: "/maps/shadows-of-evil.webp",
		game: blackOps3,
	},
	theGiant: {
		id: "the-giant",
		title: "The Giant",
		releaseDate: new Date("November 06, 2015 08:00 AM"),
		description:
			"Re-awaken The Giant. Return to the secret facility where it all began, and strike at the heart of the zombie scourge.",
		image: "/maps/the-giant.webp",
		game: blackOps3,
	},
	derEisendrache: {
		id: "der-eisendrache",
		title: "Der Eisendrache",
		releaseDate: new Date("February 02, 2016 07:00 AM"),
		description:
			"Bound together by a fragile alliance, our heroes pursue the scattered remnants of Group 935 to their mountain top fortress in the Austrian Alps...",
		image: "/maps/der-eisendrache.webp",
		game: blackOps3,
	},
	zetsubouNoShima: {
		id: "zetsubou-no-shima",
		title: "Zetsubou No Shima",
		releaseDate: new Date("April 19, 2016 08:00 AM"),
		description:
			"On a remote island in the Pacific, a mysterious facility hides the secrets behind Division 9's sinister experiments...",
		image: "/maps/zetsubou-no-shima.webp",
		game: blackOps3,
	},
	gorodKrovi: {
		id: "gorod-krovi",
		title: "Gorod Krovi",
		releaseDate: new Date("June 12, 2016 08:00 AM"),
		description:
			"As their journey nears its end, our heroes must battle ancient beasts in the war-torn ruins of Stalingrad...",
		image: "/maps/gorod-krovi.webp",
		game: blackOps3,
	},
	revelations: {
		id: "revelations",
		title: "Revelations",
		releaseDate: new Date("September 06, 2016 08:00 AM"),
		description:
			"The time has come to join Doctor Monty in The House, where an ancient evil threatens the survival of our heroes' immortal souls...",
		image: "/maps/revelations.webp",
		game: blackOps3,
	},
	voyageOfDespair: {
		id: "voyage-of-despair",
		title: "Voyage of Despair",
		releaseDate: new Date("October 11, 2018 12:00 AM"),
		description:
			"Four intrepid adventurers board the RMS Titanic to pull off a daring heist involving a mysterious artifact. Little do Scarlett Rhodes, Diego Necalli, Bruno Delacroix, and Stanton Shaw suspect that a giant iceberg will be the least of their problems…",
		image: "/maps/voyage-of-despair.webp",
		game: blackOps4,
	},
	ix: {
		id: "ix",
		title: "IX",
		releaseDate: new Date("October 11, 2018 01:00 AM"),
		description:
			"Transported across the Millennia, Scarlett, Diego, Bruno and Shaw find themselves caught up in a sinister ritual, where they are thrust into brutal gladiatorial combat against waves of unnatural enemies that stand between them and the High Priest of Chaos.",
		image: "/maps/ix.webp",
		game: blackOps4,
	},
	bloodOfTheDead: {
		id: "blood-of-the-dead",
		title: "Blood of the Dead",
		releaseDate: new Date("October 11, 2018 02:00 AM"),
		description:
			"In their mission to “secure a better tomorrow”, Richtofen, Dempsey, Takeo and Nikolai journey to a secret laboratory beneath the iconic Alcatraz, where they realize that the future they sought to secure is now in serious jeopardy.",
		image: "/maps/blood-of-the-dead.webp",
		game: blackOps4,
	},
	classified: {
		id: "classified",
		title: " Classified",
		releaseDate: new Date("October 11, 2018 03:00 AM"),
		description: "Mankind must put an end to war – or war will put an end to mankind. (JFK, 1961)",
		image: "/maps/classified.webp",
		game: blackOps4,
	},
	deadOfTheNight: {
		id: "dead-of-the-night",
		title: "Dead of the Night",
		releaseDate: new Date("December 11, 2018 12:00 AM"),
		description:
			"When a party at an English mansion turns into an undead bloodbath, a phony psychic, stage-show cowboy, retired general, and bedeviled butler must fight for their lives.",
		image: "/maps/dead-of-the-night.webp",
		game: blackOps4,
	},
	ancientEvil: {
		id: "ancient-evil",
		title: "Ancient Evil",
		releaseDate: new Date("March 26, 2019 12:00 AM"),
		description:
			"In the hidden heart of ancient Delphi, Scarlett, Diego, Bruno, and Shaw must rescue the fabled Oracle. But who is the Undead Warlord standing in their way?",
		image: "/maps/ancient-evil.webp",
		game: blackOps4,
	},
	alphaOmega: {
		id: "alpha-omega",
		title: "Alpha Omega",
		releaseDate: new Date("July 09, 2019 12:00 AM"),
		description:
			"Here at Broken Arrow, it is our Mission to Prepare for Humanity’s Future and Open New Worlds.",
		image: "/maps/alpha-omega.webp",
		game: blackOps4,
	},
	tagDerToten: {
		id: "tag-der-toten",
		title: "Tag der Toten",
		releaseDate: new Date("September 23, 2019 12:00 AM"),
		description: "The Paradox Must Be Resolved.",
		image: "/maps/tag-der-toten.webp",
		game: blackOps4,
	},
	dieMaschine: {
		id: "die-maschine",
		title: "Die Maschine",
		releaseDate: new Date("November 13, 2020 12:00 AM"),
		description:
			"Dimensional gateways opening around the globe. An undead horde threatening all of humanity. A new Cold War threat emerging from the shadows. Investigate the abandoned Nazi facility at the heart of it all.",
		image: "/maps/die-maschine.webp",
		game: blackOpsColdWar,
	},
	firebaseZ: {
		id: "firebase-z",
		title: "Firebase Z",
		releaseDate: new Date("February 04, 2021 12:00 AM"),
		description:
			"A captured agent in the heart of the darkness. A treacherous scientist on the brink of a breakthrough. An unlikely ally out for revenge. Infiltrate Omega’s Vietnam base and expose the secrets within.",
		image: "/maps/firebase-z.webp",
		game: blackOpsColdWar,
	},
	mauerDerToten: {
		id: "mauer-der-toten",
		title: "Mauer der Toten",
		releaseDate: new Date("July 15, 2021 12:00 AM"),
		description:
			"A city divided between East and West. A fragile alliance with a familiar adversary. An old enemy rising from the shadows. Who will prevail when worlds collide?",
		image: "/maps/mauer-der-toten.webp",
		game: blackOpsColdWar,
	},
	forsaken: {
		id: "forsaken",
		title: "Forsaken",
		releaseDate: new Date("October 07, 2021 12:00 AM"),
		description:
			"A secluded facility harboring a secretive operation. A colonel determined to achieve his mission no matter the cost. Infiltrate the Soviet complex and extract the lost soul who could lead to Requiem’s salvation – or Omega’s supremacy. This is the only way.",
		image: "/maps/forsaken.webp",
		game: blackOpsColdWar,
	},
	libertyFalls: {
		id: "liberty-falls",
		title: "Liberty Falls",
		releaseDate: new Date("October 25, 2024 12:00 AM"),
		description:
			"A small town in West Virginia is caught up in the grip of a mysterious outbreak. Assess the situation, contain the threat, and find the lost scientist who may hold the key to salvation.",
		image: "/maps/liberty-falls.webp",
		game: blackOps6,
	},
	terminus: {
		id: "terminus",
		title: "Terminus",
		releaseDate: new Date("October 25, 2024 01:00 AM"),
		description:
			"A jailbreak on a secluded island pits unlikely partners against the undead. Unlock the laboratory's secrets, recruit a strangely familiar ally, and avenge the gruesome crimes against nature.",
		image: "/maps/terminus.webp",
		game: blackOps6,
	},
	citadelleDesMorts: {
		id: "citadelle-des-morts",
		title: "Citadelle des Morts",
		releaseDate: new Date("December 05, 2024 12:00 AM"),
		description:
			"A criminal hideout in an ancient castle is overrun by the undead. Find the captive demonologist, seek the Amulet, and defeat its Immortal Guardian.",
		image: "/maps/citadelle-des-morts.webp",
		game: blackOps6,
	},
	theTomb: {
		id: "the-tomb",
		title: "The Tomb",
		releaseDate: new Date("January 28, 2025 12:00 AM"),
		description:
			"Cursed catacombs guard a gate to a world of darkness. Follow in the footsteps of a doomed explorer. Pass the Trials of the Damned. Claim the fabled Sentinel Artifact.",
		image: "/maps/the-tomb.webp",
		game: blackOps6,
	},
	shatteredVeil: {
		id: "shattered-veil",
		title: "Shattered Veil",
		releaseDate: new Date("April 02, 2025 12:00 AM"),
		description:
			"A mansion with a diabolical past, caught in an Appalachian apocalypse. Free its captive souls. Come face to face with a synthetic mind. Confront a tyrant.",
		image: "/maps/shattered-veil.webp",
		game: blackOps6,
	},
	reckoning: {
		id: "reckoning",
		title: "Reckoning",
		releaseDate: new Date("August 07, 2025 12:00 AM"),
		description:
			"Project Janus HQ teeters on the verge of collapse. Stabilize the Aether Reactors. Unleash the Sentinel Artifact. Complete the mission that began on Terminus.",
		image: "/maps/reckoning.webp",
		game: blackOps6,
	},
} as const satisfies Record<string, Maps>

export type MapKey = keyof typeof mapRegistry
export const {
	nachtDerUntoten,
	verruckt,
	derEisendrache,
	zetsubouNoShima,
	gorodKrovi,
	revelations,
	voyageOfDespair,
	ix,
	bloodOfTheDead,
	classified,
	deadOfTheNight,
	ancientEvil,
	alphaOmega,
	tagDerToten,
	dieMaschine,
	firebaseZ,
	mauerDerToten,
	forsaken,
	libertyFalls,
	terminus,
	citadelleDesMorts,
	theTomb,
	shatteredVeil,
	reckoning,
	ascension,
	buried,
	callOfTheDead,
	derRiese,
	dieRise,
	five,
	kinoDerToten,
	mobOfTheDead,
	moon,
	origins,
	shadowsOfEvil,
	shangriLa,
	shiNoNuma,
	theGiant,
	tranzit,
} = mapRegistry
