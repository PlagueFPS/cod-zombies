import type { SortOption } from "@/components/grid-sort"
import type { ContentState } from "@/types/data"
import type { SideQuestsPaths } from "@/types/generated/content-paths.gen"
import { Option } from "effect"
import { compareMapReleaseDescending, getMapByKey, type MapKey } from "@/data/maps"
import { getAdjacentItems } from "@/utils/shared-functions"

export interface SideQuest {
	/** Internal tag to discriminate against for type-narrowing */
	readonly _tag: "SideQuest"
	/** The unique identifier for the side quest */
	readonly id: string
	/** The title of the side quest */
	readonly title: string
	/** The state of the side quest */
	readonly state: Option.Option<ContentState>
	/** The map of the side quest */
	readonly map: MapKey
	/** The description of the side quest */
	readonly description: string
	/** The content of the side quest */
	readonly content: SideQuestsPaths
}

/** Union type of all side quests */
export type SideQuestKey = Parameters<typeof SIDE_QUESTS.get>[0]
/**
 * Newest-first: host map {@link compareMapReleaseDescending}, then higher {@link SIDE_QUESTS} insertion index when maps tie.
 */
export function compareSideQuestDescending(
	a: Pick<SideQuest, "id" | "map">,
	b: Pick<SideQuest, "id" | "map">,
): number {
	const mapA = getMapByKey(a.map).pipe(Option.getOrThrow)
	const mapB = getMapByKey(b.map).pipe(Option.getOrThrow)
	const byMap = compareMapReleaseDescending(mapA, mapB)
	if (byMap !== 0) return byMap
	return (
		SIDE_QUEST_INSERTION_INDEX_BY_ID.get(b.id as SideQuestKey)! -
		SIDE_QUEST_INSERTION_INDEX_BY_ID.get(a.id as SideQuestKey)!
	)
}

/** @returns Side quests sorted like by {@link compareMapReleaseDescending} on the host map, then {@link SIDE_QUESTS} insertion order when host maps tie. */
export const getSideQuests = (): SideQuest[] =>
	[...SIDE_QUESTS.values()].sort(compareSideQuestDescending)

/**
 * @returns The side quest with the given key
 */
export const getSideQuestByKey = (key: SideQuestKey) => Option.fromUndefinedOr(SIDE_QUESTS.get(key))

/** @returns The adjacent side quests for the given quest ID, sorted by {@link compareSideQuestDescending}. */
export const getAdjacentSideQuests = (questId: SideQuestKey) => {
	return getAdjacentItems(getSideQuests(), questId)
}

/** @returns The sort options for side quests. */
export const getSideQuestSortOptions = (): SortOption[] => [
	{ value: "latest", label: "Latest" },
	{ value: "oldest", label: "Oldest" },
]

const makeQuest = <T extends string>(
	identifier: T,
	quest: Omit<SideQuest, "_tag" | "id">,
): [T, SideQuest] => [
	identifier,
	{
		_tag: "SideQuest" as const,
		id: identifier,
		...quest,
	},
]

const SIDE_QUESTS = new Map([
	makeQuest("free-500-points", {
		state: Option.none(),
		title: "Free 500 Points",
		description:
			"Discover this easy way to get a quick 500 points immediately after opening the first door of the map, refunding your purchase.",
		map: "shadows-of-evil",
		content: "content/side-quests/free-500-points",
	}),
	makeQuest("free-mega-gobblegum", {
		state: Option.none(),
		title: "Free Mega Gobblegum",
		description:
			"Learn how to acquire a free Mega Gobblegum, enhancing your game. Follow precise steps involving Widow's Wine, and specific statue interactions to claim your reward.",
		map: "shadows-of-evil",
		content: "content/side-quests/free-mega-gobblegum",
	}),
	makeQuest("upgraded-trip-mines", {
		state: Option.none(),
		title: "Upgraded Trip Mines",
		description: `Discover the explosive secret of the Trip Mines! Blast zombies at "Holly's Cream Cakes" carts for a doughnut-fueled upgrade.`,
		map: "shadows-of-evil",
		content: "content/side-quests/upgraded-trip-mines",
	}),
	makeQuest("noire-mode-filter", {
		state: Option.none(),
		title: "Noire Mode Filter",
		description: `Discover a way to activate a permanent "Noire Mode" for the rest of the game for a new look to the game.`,
		map: "shadows-of-evil",
		content: "content/side-quests/noire-mode-filter",
	}),
	makeQuest("snakeskin-boots-song", {
		state: Option.none(),
		title: "Snakeskin Boots Song",
		description: `Discover this Music Easter Egg Song "Snakeskin Boots" for Shadows of Evil by Jack Wall feat. Rick Riso with lyrics by Cindy Shapiro`,
		map: "shadows-of-evil",
		content: "content/side-quests/snakeskin-boots-song",
	}),
	makeQuest("cold-hard-cash", {
		state: Option.none(),
		title: "Cold Hard Cash",
		description: `Discover this Music Easter Egg Song "Cold Hard Cash" for Shadows of Evil by Jack Wall feat. Antonia Bennet with lyrics by Cindy Shapiro`,
		map: "shadows-of-evil",
		content: "content/side-quests/cold-hard-cash",
	}),
	makeQuest("margwa-mask", {
		state: Option.none(),
		title: "Margwa Mask",
		description: `Learn how to unlock the Margwa Mask for a wild look and slam protection by shooting 6 Margwa hearts from a moving train.`,
		map: "shadows-of-evil",
		content: "content/side-quests/margwa-mask",
	}),
	makeQuest("jump-scare", {
		state: Option.none(),
		title: "Jump Scare",
		description: `Discover this spooky jumpscare using a Sniper Rifle for a quick scare and laugh.`,
		map: "shadows-of-evil",
		content: "content/side-quests/jump-scare",
	}),
	makeQuest("upgraded-lil-arnies", {
		state: Option.none(),
		title: "Upgraded Lil' Arnies",
		description: `Learn how to upgrade your Lil' Arnies for a stronger, longer lasting, and cooler looking tactical equipment.`,
		map: "shadows-of-evil",
		content: "content/side-quests/upgraded-lil-arnies",
	}),
	makeQuest("shadowman-round-skip", {
		state: Option.none(),
		title: "Shadowman Round Skip",
		description: `Discover this way to skip through the early rounds and jump ahead to Round 5, 10, or 15 with extra points to speed up your game.`,
		map: "shadows-of-evil",
		content: "content/side-quests/shadowman-round-skip",
	}),
	makeQuest("beauty-of-annihilation-remix", {
		state: Option.none(),
		title: "Beauty of Annihilation Remix",
		description: `Discover the Remixed version of the original Beauty of Annihilation Music Easter Egg Song by Kevin Sherwood, sang by Elena Siegman`,
		map: "the-giant",
		content: "content/side-quests/beauty-of-annihilation-remix",
	}),
	makeQuest("hidden-perk-machine", {
		state: Option.none(),
		title: "Hidden Perk Machine",
		description: `Learn how to uncover this hidden sixth perk machine on The Giant that can either by Stamin-Up or Deadshot Daiquiri.`,
		map: "the-giant",
		content: "content/side-quests/hidden-perk-machine",
	}),
	makeQuest("dead-again", {
		state: Option.none(),
		title: "Dead Again",
		description: `Discover the "Dead Again" Music Easter Egg song for Der Eisendrache written by Kevin Sherwood and vocals by Elena Siegman.`,
		map: "der-eisendrache",
		content: "content/side-quests/dead-again",
	}),
	makeQuest("brm-wall-buy", {
		state: Option.none(),
		title: "BRM Wall Buy",
		description: `Learn how to unlock this hidden wall buy for the BRM Light Machine Gun by utilizing Anti-Gravity and wall running.`,
		map: "der-eisendrache",
		content: "content/side-quests/brm-wall-buy",
	}),
	makeQuest("skeletons-everywhere", {
		state: Option.none(),
		title: "Skeletons Everywhere",
		description: `Learn how to enable this cool effect that turns all zombies into skeletons, which you can disable at any time if you choose.`,
		map: "der-eisendrache",
		content: "content/side-quests/skeletons-everywhere",
	}),
	makeQuest("panzer-claw-helmet", {
		state: Option.none(),
		title: "Panzer Claw Helmet",
		description: `Learn how to obtain a Panzer Claw Helmet that will grant you full immunity from the Panzer's melee attacks.`,
		map: "der-eisendrache",
		content: "content/side-quests/panzer-claw-helmet",
	}),
	makeQuest("plunger-melee-weapon", {
		state: Option.none(),
		title: "Plunger Melee Weapon",
		description: `Learn how to obtain the Plunger Melee Weapon which has a hidden effect allowing you to instantly kill Panzersoldats.`,
		map: "der-eisendrache",
		content: "content/side-quests/plunger-melee-weapon",
	}),
	makeQuest("second-gondola", {
		state: Option.none(),
		title: "Second Gondola",
		description: `Learn how to enable the second Gondola at the start of the game to get a valuable reward like Monkey Bombs, Packed Man-O-War, or Packed Haymaker 12.`,
		map: "der-eisendrache",
		content: "content/side-quests/second-gondola",
	}),
	makeQuest("free-mega-gobblegum-der-eisendrache", {
		state: Option.none(),
		title: "Free Mega Gobblegum",
		description: `Learn how to obtain a Free Mega GobbleGum that can help enhance your game while you progress the Main Quest.`,
		map: "der-eisendrache",
		content: "content/side-quests/free-mega-gobblegum-der-eisendrache",
	}),
	makeQuest("dead-flowers", {
		state: Option.none(),
		title: "Dead Flowers",
		description: `Discover the hidden Music Easter Egg Song "Dead Flowers" written by Kevin Sherwood with vocals by Malukah.`,
		map: "zetsubou-no-shima",
		content: "content/side-quests/dead-flowers",
	}),
	makeQuest("doppelganger-jump-scare", {
		state: Option.none(),
		title: "Doppelganger Jump Scare",
		description: `Discover this eerie figure that looks like a Doppleganger of one of the four main crew characters, Dempsey, Nikolai, Takeo, or Richtofen.`,
		map: "zetsubou-no-shima",
		content: "content/side-quests/doppelganger-jump-scare",
	}),
	makeQuest("free-widows-wine", {
		state: Option.none(),
		title: "Free Widow's Wine",
		description: `Learn how to obtain the Widow's Wine perk as a nice reward for defeating a formidable foe.`,
		map: "zetsubou-no-shima",
		content: "content/side-quests/free-widows-wine",
	}),
	makeQuest("friendy-thrasher", {
		state: Option.none(),
		title: "Friendy Thrasher",
		description: `Learn how to turn a threatening enemy into a friendly asset to help you survive for up to three full rounds.`,
		map: "zetsubou-no-shima",
		content: "content/side-quests/friendy-thrasher",
	}),
	makeQuest("golden-bucket", {
		state: Option.none(),
		title: "Golden Bucket",
		description: `Learn how to obtain the Golden Bucket for your entire team, granting you an infinite amount of every type of water.`,
		map: "zetsubou-no-shima",
		content: "content/side-quests/golden-bucket",
	}),
	makeQuest("spider-bait", {
		state: Option.none(),
		title: "Spider Bait",
		description: `Learn how to transform your character into a spider, shooting webs, and gaining invincibility while active.`,
		map: "zetsubou-no-shima",
		content: "content/side-quests/spider-bait",
	}),
	makeQuest("dragon-shield-upgrade", {
		state: Option.none(),
		title: "Dragon Shield Upgrade",
		description: `Learn how to upgrade the Guard of Fafnir shield into Timat's Maw, increasing its health, damage, range and eye color of the shield to red.`,
		map: "gorod-krovi",
		content: "content/side-quests/dragon-shield-upgrade",
	}),
	makeQuest("dragon-strike-upgrade", {
		state: Option.none(),
		title: "Dragon Strike Upgrade",
		description: `Learn how to upgrade the Dragon Strike into the Draconite for increased damage, usage, and new visual effects.`,
		map: "gorod-krovi",
		content: "content/side-quests/dragon-strike-upgrade",
	}),
	makeQuest("melee-weapons", {
		state: Option.none(),
		title: "Melee Weapons",
		description: `Discover this interesting arsenal reward for completing certain rounds in under a specific amount of time.`,
		map: "gorod-krovi",
		content: "content/side-quests/melee-weapons",
	}),
	makeQuest("monkey-bombs-upgrade", {
		state: Option.none(),
		title: "Monkey Bombs Upgrade",
		description: `Learn how to upgrade the Monkey Bombs for increased effectiveness and a dubstep-remixed sound effect.`,
		map: "gorod-krovi",
		content: "content/side-quests/monkey-bombs-upgrade",
	}),
	makeQuest("dead-ended", {
		state: Option.none(),
		title: "Dead Ended",
		description: `Discover this hidden Music Easter Egg song "Dead Ended" by Kevin Sherwood with vocals by Clark S Nova.`,
		map: "gorod-krovi",
		content: "content/side-quests/dead-ended",
	}),
	makeQuest("ace-of-spades", {
		state: Option.none(),
		title: "Ace of Spades",
		description: `Discover this hidden Music Easter Egg song for the popular song Ace of Spades by Motorhead.`,
		map: "gorod-krovi",
		content: "content/side-quests/ace-of-spades",
	}),
	makeQuest("samanthas-sorrow", {
		state: Option.none(),
		title: "Samantha's Sorrow",
		description: `Learn how to activate the hidden Music Easter Egg song "Samantha's Sorrow" by Brian Tuey.`,
		map: "gorod-krovi",
		content: "content/side-quests/samanthas-sorrow",
	}),
	makeQuest("helmets-and-wings", {
		state: Option.none(),
		title: "Helmets & Wings",
		description: `Learn how to obtain the Dragon Wings, Mangler Helmet, and Valkrie Helmet for a worthy upgrade and quality-of-life improvement.`,
		map: "gorod-krovi",
		content: "content/side-quests/helmets-and-wings",
	}),
	makeQuest("melee-weapons-revelations", {
		state: Option.none(),
		title: "Melee Weapons Revelations",
		description: `Discover this interesting wall buy reward for completing certain rounds in under a specific amount of time.`,
		map: "revelations",
		content: "content/side-quests/melee-weapons-revelations",
	}),
	makeQuest("lil-arnies-upgrade", {
		state: Option.none(),
		title: "Lil' Arnies Upgrade",
		description: `Learn how to obtain the upgraded version of the Lil' Arnie's equipment for increased damage and a new visual look.`,
		map: "revelations",
		content: "content/side-quests/lil-arnies-upgrade",
	}),
	makeQuest("the-gift", {
		state: Option.none(),
		title: "The Gift",
		description: `Discover this hidden Music Easter Egg song "The Gift" by Kevin Sherwood with vocals by Elena Siegman.`,
		map: "revelations",
		content: "content/side-quests/the-gift",
	}),
	makeQuest("all-zombie-songs", {
		state: Option.none(),
		title: "All Zombie Songs",
		description: `Discover this hidden Music Easter Egg that plays multiple songs from past maps.`,
		map: "revelations",
		content: "content/side-quests/all-zombie-songs",
	}),
	makeQuest("permanent-pack-a-punch", {
		state: Option.none(),
		title: "Permanent Pack-a-Punch",
		description: `Discover this game-changing upgrade that makes all wall and box weapons instantly Pack-a-Punched for the rest of the game, and unlocks Takeo's Katana.`,
		map: "revelations",
		content: "content/side-quests/permanent-pack-a-punch",
	}),
	makeQuest("free-perk-wall-run", {
		state: Option.none(),
		title: "Free Perk Wall Run",
		description: `Learn how to obtain a Free Perk Power-Up, granting everyone in your game with a random perk.`,
		map: "revelations",
		content: "content/side-quests/free-perk-wall-run",
	}),
	makeQuest("chalk-quotes", {
		state: Option.none(),
		title: "Chalk Quotes",
		description: `Learn how to unlock the M1927 wall buy and a way for you to trade weapons with your teammates.`,
		map: "revelations",
		content: "content/side-quests/chalk-quotes",
	}),
	makeQuest("hats-and-masks", {
		state: Option.none(),
		title: "Hats & Masks",
		description: `Learn how to obtain all hats and masks that grant some strong gameplay advantages to help you survive.`,
		map: "revelations",
		content: "content/side-quests/hats-and-masks",
	}),
	makeQuest("viking-funeral", {
		state: Option.none(),
		title: "Viking Funeral",
		description:
			"Discover how to obtain a free Random Perk Power-Up by giving a fallen viking a proper sendoff.",
		map: "ix",
		content: "content/side-quests/viking-funeral",
	}),
	makeQuest("mad-hatter", {
		state: Option.none(),
		title: "Mad Hatter",
		description:
			"Discover how to activate the song 'Mad Hatter' by Avenged Sevenfold in your game.",
		map: "ix",
		content: "content/side-quests/mad-hatter",
	}),
	makeQuest("nos-fideles", {
		state: Option.none(),
		title: "Nos Fideles",
		description: "Discover how to activate the song 'Nos Fideles' by Jack Wall in your game.",
		map: "ix",
		content: "content/side-quests/nos-fideles",
	}),
	makeQuest("brazen-bull-upgrade", {
		state: Option.none(),
		title: "Brazen Bull Upgrade",
		description: "Learn how to upgrade the Brazen Bull shield into the Iron Bull.",
		map: "ix",
		content: "content/side-quests/brazen-bull-upgrade",
	}),
	makeQuest("fire-and-trap-immunity", {
		state: Option.none(),
		title: "Fire & Trap Immunity",
		description:
			"Learn how to obtain fire immunity and significant damage reduction from the Acid Trap.",
		map: "ix",
		content: "content/side-quests/fire-and-trap-immunity",
	}),
	makeQuest("drowning", {
		state: Option.none(),
		title: "Drowning",
		description: "Learn how to activate the Music Easter Egg Song 'Drowning' by Kevin Sherwood.",
		map: "voyage-of-despair",
		content: "content/side-quests/drowning",
	}),
	makeQuest("special-weapon-fire-sale", {
		state: Option.none(),
		title: "Special Weapon Fire Sale",
		description:
			"Discover this way to activate a special fire sale allowing you to change your special weapon in game.",
		map: "voyage-of-despair",
		content: "content/side-quests/special-weapon-fire-sale",
	}),
	makeQuest("bowie-knife-upgrade", {
		state: Option.none(),
		title: "Bowie Knife Upgrade",
		description:
			"Learn how to upgrade your Bowie Knife for a one hit kill past Round 30 with a cooldown.",
		map: "voyage-of-despair",
		content: "content/side-quests/bowie-knife-upgrade",
	}),
	makeQuest("fish-free-perk", {
		state: Option.none(),
		title: "Fish Free Perk",
		description:
			"Learn how to obtain a free Random Perk Power-Up by collecting six fish around the map.",
		map: "voyage-of-despair",
		content: "content/side-quests/fish-free-perk",
	}),
	makeQuest("elemental-shield-upgrade", {
		state: Option.none(),
		title: "Elemental Shield Upgrade",
		description:
			"Learn how to upgrade your Ballistic Shield into the Svalinn Guard elemental shield.",
		map: "voyage-of-despair",
		content: "content/side-quests/elemental-shield-upgrade",
	}),
	makeQuest("where-are-we-going-remix", {
		state: Option.none(),
		title: "Where Are We Going Remix",
		description:
			"Learn how to activate the remix of the original 'Where Are We Going' music easter egg song by Kevin Sherwood.",
		map: "blood-of-the-dead",
		content: "content/side-quests/where-are-we-going-remix",
	}),
	makeQuest("hells-retriever", {
		state: Option.none(),
		title: "Hell's Retriever",
		description: "Learn how to obtain the Hell's Retriever lethal equipment.",
		map: "blood-of-the-dead",
		content: "content/side-quests/hells-retriever",
	}),
	makeQuest("free-monkey-bombs", {
		state: Option.none(),
		title: "Free Monkey Bombs",
		description:
			"Learn how to obtain Free Monkey Bombs by killing enemies with your Special Weapon.",
		map: "blood-of-the-dead",
		content: "content/side-quests/free-monkey-bombs",
	}),
	makeQuest("upgraded-spectral-shield", {
		state: Option.none(),
		title: "Upgraded Spectral Shield",
		description: "Learn how to upgrade your Spectral Shield for increased shield charge capacity.",
		map: "blood-of-the-dead",
		content: "content/side-quests/upgraded-spectral-shield",
	}),
	makeQuest("free-blundergat", {
		state: Option.none(),
		title: "Free Blundergat",
		description:
			"Learn how to obtain a Free Blundergat by completing collecting five skulls around the map.",
		map: "blood-of-the-dead",
		content: "content/side-quests/free-blundergat",
	}),
	makeQuest("magmagat-upgrade", {
		state: Option.none(),
		title: "Magmagat Upgrade",
		description:
			"Learn how to upgrade your Blundergat to the Magmagat variant, greatly enhancing its functionality.",
		map: "blood-of-the-dead",
		content: "content/side-quests/magmagat-upgrade",
	}),
	makeQuest("golden-spork", {
		state: Option.none(),
		title: "Golden Spork",
		description: "Learn how to obtain a Golden Spork for an advanced melee weapon.",
		map: "blood-of-the-dead",
		content: "content/side-quests/golden-spork",
	}),
	makeQuest("shockwave", {
		state: Option.none(),
		title: "Shockwave",
		description: "Learn how to activate the Music Easter Egg song 'Shockwave' by Kevin Sherwood.",
		map: "classified",
		content: "content/side-quests/shockwave",
	}),
	makeQuest("this-jazz-is-classified", {
		state: Option.none(),
		title: "This Jazz Is Classified",
		description:
			"Learn how to activate the Music Easter Egg song 'This Jazz Is Classified' by Jack Wall.",
		map: "classified",
		content: "content/side-quests/this-jazz-is-classified",
	}),
	makeQuest("free-winters-howl", {
		state: Option.none(),
		title: "Free Winter's Howl",
		description: "Learn how to obtain a Free Winters Howl for an advanced melee weapon.",
		map: "classified",
		content: "content/side-quests/free-winters-howl",
	}),
	makeQuest("mystery", {
		state: Option.none(),
		title: "Mystery",
		description:
			"Discover how to activate the hidden Music Easter Egg song 'Mystery' by Kevin Sherwood.",
		map: "dead-of-the-night",
		content: "content/side-quests/mystery",
	}),
	makeQuest("secret-doors", {
		state: Option.none(),
		title: "Secret Doors",
		description: "Discover how to unlock three secret doors each granting you a nice reward.",
		map: "dead-of-the-night",
		content: "content/side-quests/secret-doors",
	}),
	makeQuest("stake-knife", {
		state: Option.none(),
		title: "Stake Knife",
		description: "Learn how to obtain a Stake Knife, increasing your damage against all enemies.",
		map: "dead-of-the-night",
		content: "content/side-quests/stake-knife",
	}),
	makeQuest("savage-impaler", {
		state: Option.none(),
		title: "Savage Impaler",
		description:
			"Learn how to obtain the Savage Impaler weapon, which is like a second Wonder Weapon.",
		map: "dead-of-the-night",
		content: "content/side-quests/savage-impaler",
	}),
	makeQuest("stormbound", {
		state: Option.none(),
		title: "Stormbound",
		description:
			"Discover how to activate the music Easter Egg song 'Stormbound' by Kevin Sherwood.",
		map: "ancient-evil",
		content: "content/side-quests/stormbound",
	}),
	makeQuest("i-am-the-well", {
		state: Option.none(),
		title: "I Am The Well",
		description:
			"Discover how to activate the music Easter Egg song 'I Am The Well' by Kevin Sherwood.",
		map: "alpha-omega",
		content: "content/side-quests/i-am-the-well",
	}),
	makeQuest("adam-unit-free-perk", {
		state: Option.none(),
		title: "A.D.A.M. Unit Free Perk",
		description:
			"Learn how to obtain a free Random Perk Power-Up by shooting the heads of all A.D.A.M. units.",
		map: "alpha-omega",
		content: "content/side-quests/adam-unit-free-perk",
	}),
	makeQuest("a-light-from-the-shore", {
		state: Option.none(),
		title: "A Light From The Shore",
		description:
			"Discover how to activate the hidden Music Easter Egg song 'A Light From The Shore' by Kevin Sherwood.",
		map: "tag-der-toten",
		content: "content/side-quests/a-light-from-the-shore",
	}),
	makeQuest("george-romero-glasses", {
		state: Option.none(),
		title: "George Romero Glasses",
		description:
			"Learn how to obtain a Free 500 Points by interacting with George Romero's glasses.",
		map: "tag-der-toten",
		content: "content/side-quests/george-romero-glasses",
	}),
	makeQuest("paper-jumpscare", {
		state: Option.none(),
		title: "Paper Jumpscare",
		description: "Discover this hidden jumpscare by aiming at a piece of paper on the Forecastle.",
		map: "tag-der-toten",
		content: "content/side-quests/paper-jumpscare",
	}),
	makeQuest("statue-free-perk", {
		state: Option.none(),
		title: "Statue Free Perk",
		description: "Learn how to obtain a free Random Perk Power-Up by collecting four statues.",
		map: "tag-der-toten",
		content: "content/side-quests/statue-free-perk",
	}),
	makeQuest("heat-pack", {
		state: Option.none(),
		title: "Heat Pack",
		description:
			"Learn how to obtain a Heat Pack allowing you to move and swim faster in water without freezing.",
		map: "tag-der-toten",
		content: "content/side-quests/heat-pack",
	}),
	makeQuest("lighthouse-jumpscare", {
		state: Option.none(),
		title: "Lighthouse Jumpscare",
		description: "Discover this hidden jumpscare by aiming at the top of the lighthouse.",
		map: "tag-der-toten",
		content: "content/side-quests/lighthouse-jumpscare",
	}),
	makeQuest("free-tundragun", {
		state: Option.none(),
		title: "Free Tundragun",
		description: "Learn how to obtain a Free Tundragun by doing a little target practice.",
		map: "tag-der-toten",
		content: "content/side-quests/free-tundragun",
	}),
	makeQuest("free-thundergun", {
		state: Option.none(),
		title: "Free Thundergun",
		description: "Learn how to obtain a Free Thundergun by completing all five challenge totems.",
		map: "tag-der-toten",
		content: "content/side-quests/free-thundergun",
	}),
	makeQuest("upgraded-snowballs", {
		state: Option.none(),
		title: "Upgraded Snowballs",
		description: "Learn how to upgrade your Snowballs for a one-hit kill until Round 35.",
		map: "tag-der-toten",
		content: "content/side-quests/upgraded-snowballs",
	}),
	makeQuest("alone", {
		state: Option.none(),
		title: "Alone",
		description:
			"Discover how to activate the hidden Music Easter Egg song 'Alone' by Kevin Sherwood.",
		map: "die-maschine",
		content: "content/side-quests/alone",
	}),
	makeQuest("coffin-dance", {
		state: Option.none(),
		title: "Coffin Dance",
		description: "Learn how to activate this meme reference and receive a free Juggernog perk.",
		map: "die-maschine",
		content: "content/side-quests/coffin-dance",
	}),
	makeQuest("satellite-points", {
		state: Option.none(),
		title: "Satellite Points",
		description: "Learn how to obtain a free 1500 points by messing with some satellites.",
		map: "die-maschine",
		content: "content/side-quests/satellite-points",
	}),
	makeQuest("monster-hand", {
		state: Option.none(),
		title: "Monster Hand",
		description: "Learn how to obtain a free Legendary Rarity upgrade by feeding a monster.",
		map: "die-maschine",
		content: "content/side-quests/monster-hand",
	}),
	makeQuest("floating-bodies", {
		state: Option.none(),
		title: "Floating Bodies",
		description:
			"Learn how to obtain either a free Scorestreak or trigger a jumpscare within the Dark Aether.",
		map: "die-maschine",
		content: "content/side-quests/floating-bodies",
	}),
	makeQuest("lost", {
		state: Option.none(),
		title: "Lost",
		description: "Discover the hidden music easter egg song 'Lost' by Kevin Sherwood.",
		map: "firebase-z",
		content: "content/side-quests/lost",
	}),
	makeQuest("dark-aether-bunny", {
		state: Option.none(),
		title: "Dark Aether Bunny",
		description:
			"Learn how to obtain a free Juggernog perk along with other rewards by following a Dark Aether Bunny.",
		map: "firebase-z",
		content: "content/side-quests/dark-aether-bunny",
	}),
	makeQuest("sergei-head-free-perk", {
		state: Option.none(),
		title: "Sergei Head Free Perk",
		description:
			"Learn how to obtain a free perk along by extracting some information out of the head of Sergei.",
		map: "firebase-z",
		content: "content/side-quests/sergei-head-free-perk",
	}),
	makeQuest("upgraded-monkey-bombs", {
		state: Option.none(),
		title: "Upgraded Monkey Bombs",
		description:
			"Learn how to upgrade your Monkey Bombs for more damage, a new tune, and have zombies dance to the beat.",
		map: "firebase-z",
		content: "content/side-quests/upgraded-monkey-bombs",
	}),
	makeQuest("amoeba", {
		state: Option.none(),
		title: "Amoeba",
		description:
			"Discover how to activate the hidden music easter egg song 'Amoeba' by Adolescents.",
		map: "mauer-der-toten",
		content: "content/side-quests/amoeba",
	}),
	makeQuest("sharpshooter", {
		state: Option.none(),
		title: "Sharpshooter",
		description: "Learn how to obtain a free Aether Tool by completing a sharpshooter challenge.",
		map: "mauer-der-toten",
		content: "content/side-quests/sharpshooter",
	}),
	makeQuest("bunny-disco", {
		state: Option.none(),
		title: "Bunny Disco",
		description:
			"Learn how to enter the bunny disco nightclub for a chance at earning the Wonder Weapon.",
		map: "mauer-der-toten",
		content: "content/side-quests/bunny-disco",
	}),
	makeQuest("bubby", {
		state: Option.none(),
		title: "Bubby",
		description:
			"Learn how to obtain at least one free perk, activate the music easter egg, and potentially earn the Wonder Weapon.",
		map: "forsaken",
		content: "content/side-quests/bubby",
	}),
	makeQuest("free-rarity-upgrade", {
		state: Option.none(),
		title: "Free Rarity Upgrade",
		description:
			"Learn how to obtain a free rarity upgrade for a Pistol, SMG, or Sniper Rifle weapon.",
		map: "forsaken",
		content: "content/side-quests/free-rarity-upgrade",
	}),
	makeQuest("ronald-raygun", {
		state: Option.none(),
		title: "Ronald Raygun",
		description: "Learn how to potentially obtain a free Raygun by delivering some pizza.",
		map: "forsaken",
		content: "content/side-quests/ronald-raygun",
	}),
	makeQuest("arc-xd-race", {
		state: Option.none(),
		title: "ARC-XD Race",
		description:
			"Learn how to play this hidden ARC-XD map race for a chance to earn the Wonder Weapon.",
		map: "forsaken",
		content: "content/side-quests/arc-xd-race",
	}),
	makeQuest("tombstone-perkaholic", {
		state: Option.none(),
		title: "Tombstone Perkaholic",
		description: "Learn how to earn all perks in the game by manipulating death.",
		map: "forsaken",
		content: "content/side-quests/tombstone-perkaholic",
	}),
	makeQuest("destroy-something-beautiful", {
		state: Option.none(),
		title: "Destroy Something Beautiful",
		description: `Discover and listen to the hidden Music Easter Egg song for Liberty Falls "Destroy Something Beautiful" by Kevin Sherwood.`,
		map: "liberty-falls",
		content: "content/side-quests/destroy-something-beautiful",
	}),
	makeQuest("vending-machine", {
		state: Option.none(),
		title: "Vending Machine",
		description: `Discover the hidden goodies inside this Vending Machine to test your luck for a chance of getting a Free Perk, Raygun, Pack-a-Punch Upgrade, Scorestreak or Aether Tool.`,
		map: "liberty-falls",
		content: "content/side-quests/vending-machine",
	}),
	makeQuest("raining-zombies", {
		state: Option.none(),
		title: "Raining Zombies",
		description: `Discover this hidden secret that has zombies raining from the skies dropping loot including, an Aether Tool, Scorestreaks, Points, Salavge, and more!`,
		map: "liberty-falls",
		content: "content/side-quests/raining-zombies",
	}),
	makeQuest("free-deadshot-perk", {
		state: Option.none(),
		title: "Free Deadshot Perk",
		description: `Discover this hidden easter egg that tests your aim and quickness with an old wild west challenge rewarding you with a free Deadshot Daiquiri perk as your reward.`,
		map: "liberty-falls",
		content: "content/side-quests/free-deadshot-perk",
	}),
	makeQuest("mister-peeks-bowling", {
		state: Option.none(),
		title: "Mister Peeks Bowling",
		description: `It's time to go bowling within Fuller's Liberty Lanes! If you score high enough you can earn yourself a free Raygun, Legendary Weapon, Aether Tool or Pack-a-Punch upgrade.`,
		map: "liberty-falls",
		content: "content/side-quests/mister-peeks-bowling",
	}),
	makeQuest("aetherella-superhero", {
		state: Option.none(),
		title: "Aetherella Superhero",
		description: `Transform into a full-sized Aetherella superhero and wreck havoc on zombies of all shapes and sizes with this hidden side quest.`,
		map: "liberty-falls",
		content: "content/side-quests/aetherella-superhero",
	}),
	makeQuest("mister-peeks-car", {
		state: Option.none(),
		title: "Mister Peeks Car",
		description: `Mister Peeks is potentially hiding some valuable items within his car, find the correct car, blow it up with the right equipment, and see if luck is on your side for a chance to get the Ray Gun, Jet Gun, and other weapons.`,
		map: "liberty-falls",
		content: "content/side-quests/mister-peeks-car",
	}),
	makeQuest("the-vault", {
		state: Option.none(),
		title: "The Vault",
		description: `The bank vault is holding more than just money, find the three codes and gain access to the vault to see what loot has been hiding inside.`,
		map: "liberty-falls",
		content: "content/side-quests/the-vault",
	}),
	makeQuest("blood-pool", {
		state: Option.none(),
		title: "Blood Pool",
		description: `Behind the motel lies a hellish secret, a pool filled with blood. Toss in some explosives, and you might just awaken its hidden treasures. Repeat the ritual three times for a guaranteed Fire Sale. Dare to dive in?`,
		map: "liberty-falls",
		content: "content/side-quests/blood-pool",
	}),
	makeQuest("gravedigging", {
		state: Option.none(),
		title: "Gravedigging",
		description: `Unearth the past of Liberty Falls to find their graves filled with loot; dig them all up for a chance to get a Free Perk, RayGun, JetGun and more! Curious about where to find a shovel to uncover these hidden treasures?`,
		map: "liberty-falls",
		content: "content/side-quests/gravedigging",
	}),
	makeQuest("pool-table", {
		state: Option.none(),
		title: "Pool Table",
		description: `Discover this quick and easy way to get 100 points to help jumpstart every game you play.`,
		map: "liberty-falls",
		content: "content/side-quests/pool-table",
	}),
	makeQuest("hidden-power-ups", {
		state: Option.none(),
		title: "Hidden Power Ups",
		description: `Discover the location of every hidden Power-Up drop in case you need them.`,
		map: "liberty-falls",
		content: "content/side-quests/hidden-power-ups",
	}),
	makeQuest("candles-fire-trap", {
		state: Option.none(),
		title: "Candles Fire Trap",
		description: `Discover this hidden fire trap that can help you during the Liberty Falls Main Quest final encounter.`,
		map: "liberty-falls",
		content: "content/side-quests/candles-fire-trap",
	}),
	makeQuest("can-you-hear-me-come-in", {
		state: Option.none(),
		title: "Can You Hear Me? (Come In)",
		description: `Discover and listen to the hidden Terminus Music Easter Egg song "Can you hear me? (Come in)" by Kevin Sherwood`,
		map: "terminus",
		content: "content/side-quests/can-you-hear-me-come-in",
	}),
	makeQuest("basketball-free-points", {
		state: Option.none(),
		title: "Basketball Free Points",
		description: `Uncover the hidden basketball and try to sink a shot to unlock a rewarding Easter egg that rewards players with thousands of points.`,
		map: "terminus",
		content: "content/side-quests/basketball-free-points",
	}),
	makeQuest("mega-stuffy-pet", {
		state: Option.none(),
		title: "Mega Stuffy Pet",
		description: `Uncover the secret quest unlocking this stuffy ally that will aid you in combat, reviving you when you go down, knocking down zombies, and providing some companionship.`,
		map: "terminus",
		content: "content/side-quests/mega-stuffy-pet",
	}),
	makeQuest("meteor-crash", {
		state: Option.none(),
		title: "Meteor Crash",
		description: `Take aim at the sky, forcing a meteor containing loot and potentially the RayGun or Beamsmasher to come crashing down at Castle Rock Island.`,
		map: "terminus",
		content: "content/side-quests/meteor-crash",
	}),
	makeQuest("zombie-prisoners", {
		state: Option.none(),
		title: "Zombie Prisoners",
		description: `All zombies must die, even those imprisoned within the facility. Luckily, these zombies would rather be dead then caged and will reward you with a Free Perk for "freeing" them.`,
		map: "terminus",
		content: "content/side-quests/zombie-prisoners",
	}),
	makeQuest("boat-race", {
		state: Option.none(),
		title: "Boat Race",
		description: `Set sail for loot with a boat race mini-game hidden within the map! Compete against friends or the clock as you navigate treacherous waters and sharp turns. Master the course to earn unique rewards and bragging rights.`,
		map: "terminus",
		content: "content/side-quests/boat-race",
	}),
	makeQuest("island-spores", {
		state: Option.none(),
		title: "Island Spores",
		description: `The smaller islands of the map seems to have some growths on them that need to be cleaned up. Complete the job the earn a Free Perk, along with other rewards.`,
		map: "terminus",
		content: "content/side-quests/island-spores",
	}),
	makeQuest("underwater-crates", {
		state: Option.none(),
		title: "Underwater Crates",
		description: `Beneath the waters are hidden loot crates for you to discover containing some nice rewards. Find them all and you will be given a Free Perk for your efforts.`,
		map: "terminus",
		content: "content/side-quests/underwater-crates",
	}),
	makeQuest("cooking-fish", {
		state: Option.none(),
		title: "Cooking Fish",
		description: `Being stranded on an island means you need to cook your own food. However, this food can be "enhanced" to provide some extraordinary benefits.`,
		map: "terminus",
		content: "content/side-quests/cooking-fish",
	}),
	makeQuest("whack-a-crab", {
		state: Option.none(),
		title: "Whack A Crab",
		description: `Like Whack-a-Mole but with a crab instead. Try your best in this mini-game to win a Free Perk along with other rewards.`,
		map: "terminus",
		content: "content/side-quests/whack-a-crab",
	}),
	makeQuest("cursed-talisman", {
		state: Option.none(),
		title: "Cursed Talisman",
		description: `Help an old ship captain reclaim what was once his from his former crewmates who betrayed him, rewarding you with legendary weapons. Be patient and you can also claim a Cursed Talisman granting a permanent Double Points for its owner.`,
		map: "terminus",
		content: "content/side-quests/cursed-talisman",
	}),
	makeQuest("perkaholic", {
		state: Option.none(),
		title: "Perkaholic",
		description: `Who needs a Perkaholic GobbleGum when you can earn one for free simply by blowing up fish? Hopefully you don't like fish.`,
		map: "terminus",
		content: "content/side-quests/perkaholic",
	}),
	makeQuest("pool-table-terminus", {
		state: Option.none(),
		title: "Pool Table",
		description: `Discover this quick and easy way to get 100 points to help jumpstart every game you play on Terminus.`,
		map: "terminus",
		content: "content/side-quests/pool-table-terminus",
	}),
	makeQuest("sentinel-artifact-rune", {
		state: Option.none(),
		title: "Sentinel Artifact Rune",
		description: `Discover this neat side easter egg to fast travel back to spawn from Temple Island.`,
		map: "terminus",
		content: "content/side-quests/sentinel-artifact-rune",
	}),
	makeQuest("elevator-jumpscare", {
		state: Option.none(),
		title: "Elevator Jumpscare",
		description: `Learn how to trigger a jumpscare that you can use to scare your friends or teammates.`,
		map: "terminus",
		content: "content/side-quests/elevator-jumpscare",
	}),
	makeQuest("hidden-power-ups-terminus", {
		state: Option.none(),
		title: "Hidden Power Ups",
		description: `Discover the location of every hidden free Power-Up drop in case you need them.`,
		map: "terminus",
		content: "content/side-quests/hidden-power-ups-terminus",
	}),
	makeQuest("slave", {
		state: Option.none(),
		title: "Slave",
		description: `Discover and listen to the Citadelle Des Morts Music Easter Egg song "Slave" by Kevin Sherwood.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/slave",
	}),
	makeQuest("bartender", {
		state: Option.none(),
		title: "Bartender",
		description: `Even the undead have the urge to stop for a drink. Become a bartender and quench the thirsty undead for a worthy reward of free points and PHD Flopper.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/bartender",
	}),
	makeQuest("mister-peeks-free-perk", {
		state: Option.none(),
		title: "Mister Peeks Free Perk",
		description: `Take aim at the mysterious Mister Peeks figure to be granted a free random perk for finding all of his hiding places.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/mister-peeks-free-perk",
	}),
	makeQuest("rat-king", {
		state: Option.none(),
		title: "Rat King",
		description: `Take the crown of Rat King for yourself by bringing a treat to the rats of the castle, but first you must gather them. Complete the quest for plenty of loot that may include a free perk or pack-a-punch upgrade.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/rat-king",
	}),
	makeQuest("fireplace-protector", {
		state: Option.none(),
		title: "Fireplace Protector",
		description: `Race against time to ignite four fireplaces, succeed to gain a fiery ally, fail and you will need to try again the next round.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/fireplace-protector",
	}),
	makeQuest("mayas-revenge", {
		state: Option.none(),
		title: "Maya's Revenge",
		description: `Time for Maya to get her revenge on Franco for the crimes against her brother Nathan that happened on Terminus. Complete the quest for a free legendary GS45 Pistol.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/mayas-revenge",
	}),
	makeQuest("dragon-sword-song", {
		state: Option.none(),
		title: "Dragon Sword Song",
		description: `Ever wanted to listen to the full song that plays when getting the Dragon Sword? Luckily, there is a secret way to activate the song after getting the Dragon Sword to allow everyone in your game to listen to it in full`,
		map: "citadelle-des-morts",
		content: "content/side-quests/dragon-sword-song",
	}),
	makeQuest("wishing-well", {
		state: Option.none(),
		title: "Wishing Well",
		description: `This wishing well has something hiding inside, clear it out to be able to "wish" for things like free points, doubling your points, and sharing your points with your friends.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/wishing-well",
	}),
	makeQuest("lockdown-free-perk", {
		state: Option.none(),
		title: "Lockdown Free Perk",
		description: `The power of the incantations spreads farther than we realized, use their power on the Symbol Board to start a lockdown, rewarding players with a free perk and plenty of loot if successful.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/lockdown-free-perk",
	}),
	makeQuest("knight-guardian", {
		state: Option.none(),
		title: "Knight Guardian",
		description: `Find the hidden chess piece, and activate a cursed chessboard summoning a Knight Guardian to aid you in your battles against the undead.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/knight-guardian",
	}),
	makeQuest("lion-cannon", {
		state: Option.none(),
		title: "Lion Cannon",
		description: `Restore the cannon back to its original functionality to gain a new way to traverse the map, and even gain access to a now accessible free power-up every 10 rounds.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/lion-cannon",
	}),
	makeQuest("raven-free-perk", {
		state: Option.none(),
		title: "Raven Free Perk",
		description: `The Raven's Talon isn't the only item this raven is withholding, learn how to get a free perk out of this mysterious bird.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/raven-free-perk",
	}),
	makeQuest("pool-table-citadelle-des-morts", {
		state: Option.none(),
		title: "Pool Table",
		description: `Discover this small easter egg granting you 100 points that you can repeat to start every game of Citadelle Des Morts.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/pool-table-citadelle-des-morts",
	}),
	makeQuest("hidden-power-ups-citadelle-des-morts", {
		state: Option.none(),
		title: "Hidden Power Ups",
		description: `Discover the location of every hidden free Power-Up drop in case you need them.`,
		map: "citadelle-des-morts",
		content: "content/side-quests/hidden-power-ups-citadelle-des-morts",
	}),
	makeQuest("dig", {
		state: Option.none(),
		title: "Dig",
		description: `Discover and listen to The Tomb's Music Easter Egg song "Dig" by Kevin Sherwood.`,
		map: "the-tomb",
		content: "content/side-quests/dig",
	}),
	makeQuest("free-pack-a-punch", {
		state: Option.none(),
		title: "Free Pack-a-Punch",
		description: `Discover a way to earn a free Aetherium Crystal offerring a level 1 Pack-a-Punch upgrade to any weapon you are currently holding.`,
		map: "the-tomb",
		content: "content/side-quests/free-pack-a-punch",
	}),
	makeQuest("free-aether-tool", {
		state: Option.none(),
		title: "Free Aether Tool",
		description: `Discover this way to earn a free Epic or Legendary Aether Tool to upgrade the rarity of your weapon without spending any salvage!`,
		map: "the-tomb",
		content: "content/side-quests/free-aether-tool",
	}),
	makeQuest("free-ray-gun", {
		state: Option.none(),
		title: "Free Ray Gun",
		description: `Discover this quest to earn a Free Ray Gun wonder weapon very early in your game to give you a huge boost during your game!`,
		map: "the-tomb",
		content: "content/side-quests/free-ray-gun",
	}),
	makeQuest("free-perk", {
		state: Option.none(),
		title: "Free Perk",
		description: `Discover this ritual which once completed will grant a Random Perk Power-Up to give everyone in your game a free perk!`,
		map: "the-tomb",
		content: "content/side-quests/free-perk",
	}),
	makeQuest("free-self-revive", {
		state: Option.none(),
		title: "Free Self Revive",
		description: `Discover this quest to earn yourself a free Self-Revive Kit and Light Mend ammo mod, strengthen your weapons against Doppleghasts and giving you an extra life!`,
		map: "the-tomb",
		content: "content/side-quests/free-self-revive",
	}),
	makeQuest("free-brain-rot", {
		state: Option.none(),
		title: "Free Brain Rot",
		description: `Discover this quest to earn yourself a free Brain Rot ammo mod, increasing your damage delt to Shock Mimics!`,
		map: "the-tomb",
		content: "content/side-quests/free-brain-rot",
	}),
	makeQuest("golden-armor", {
		state: Option.none(),
		title: "Golden Armor",
		description: `Discover this quest to earn Golden Armor Plates for your entire team to purchase for free, allowing you regenerate armor over time!`,
		map: "the-tomb",
		content: "content/side-quests/golden-armor",
	}),
	makeQuest("zombie-soldiers", {
		state: Option.none(),
		title: "Zombie Soldiers",
		description: `Learn how to quickly summon a small army of zombie soldiers to fight for you for a short time.`,
		map: "the-tomb",
		content: "content/side-quests/zombie-soldiers",
	}),
	makeQuest("free-1000-points", {
		state: Option.none(),
		title: "Free 1000 Points",
		description: `Discover this small easter egg to obtain a free 1000 points, and a Full Power Power-Up.`,
		map: "the-tomb",
		content: "content/side-quests/free-1000-points",
	}),
	makeQuest("hidden-power-ups-the-tomb", {
		state: Option.none(),
		title: "Hidden Power Ups",
		description: `Discover the location of every hidden free Power-Up drop in case you need them.`,
		map: "the-tomb",
		content: "content/side-quests/hidden-power-ups-the-tomb",
	}),
	makeQuest("mummy-jumpscare", {
		state: Option.none(),
		title: "Mummy Jumpscare",
		description: `Discover this hidden easter egg that allows you to jumpscare your teammates or yourself if you are solo.`,
		map: "the-tomb",
		content: "content/side-quests/mummy-jumpscare",
	}),
	makeQuest("aether", {
		state: Option.none(),
		title: "Aether",
		description: `Learn how to trigger the hidden Music Easter Egg song "Aether" by Brian Tuey.`,
		map: "the-tomb",
		content: "content/side-quests/aether",
	}),
	makeQuest("free-wunderwaffe-dg2", {
		state: Option.none(),
		title: "Free Wunderwaffe DG-2",
		description: `Learn how to obtain a free Wunderwaffe DG-2 Wonder Weapon in the Shattered Veil, seemingly restoring the one dropped by Edward Richtofen himself.`,
		map: "shattered-veil",
		content: "content/side-quests/free-wunderwaffe-dg2",
	}),
	makeQuest("sam-trap-unlock", {
		state: Option.none(),
		title: "S.A.M. Trap Unlock",
		description: `Learn how to unlock a new trap for the S.A.M. AI in the Mainframe Chamber to use throughout your game for a cost of 2000 points per activation.`,
		map: "shattered-veil",
		content: "content/side-quests/sam-trap-unlock",
	}),
	makeQuest("mister-peeks-bodyguard", {
		state: Option.none(),
		title: "Mister Peeks Bodyguard",
		description: `Learn how to get a friendly zombie companion for a few rounds to help you in your battle against the undead horde.`,
		map: "shattered-veil",
		content: "content/side-quests/mister-peeks-bodyguard",
	}),
	makeQuest("falling-to-pieces", {
		state: Option.none(),
		title: "Falling To Pieces",
		description: `Discover the Music Easter Egg Song "Falling to Pieces" for Shattered Veil, written by Kevin Sherwood with vocals by Malukah!`,
		map: "shattered-veil",
		content: "content/side-quests/falling-to-pieces",
	}),
	makeQuest("jumpscare-free-perk", {
		state: Option.none(),
		title: "Jumpscare Free Perk",
		description: `Discover this creepy jumpscare in the Shattered Veil that will reward you with a free perk and scorestreak for finding it.`,
		map: "shattered-veil",
		content: "content/side-quests/jumpscare-free-perk",
	}),
	makeQuest("marine-sp-upgrade", {
		state: Option.none(),
		title: "Marine SP Upgrade",
		description: `Learn how to get a free rarity and pack-a-punch upgrade to your Marine-SP shotgun in every game of the Shattered Veil.`,
		map: "shattered-veil",
		content: "content/side-quests/marine-sp-upgrade",
	}),
	makeQuest("sleepwalking-free-perk", {
		state: Option.none(),
		title: "Sleepwalking Free Perk",
		description: `Learn how to get a guaranteed free perk in the Shattered Veil by entering your characters dreams.`,
		map: "shattered-veil",
		content: "content/side-quests/sleepwalking-free-perk",
	}),
	makeQuest("115-free-perk", {
		state: Option.none(),
		title: "115 Free Perk",
		description: `Learn how to obtain a free random perk Power-Up with a nice reference to one of the most important elements in our zombies universe.`,
		map: "shattered-veil",
		content: "content/side-quests/115-free-perk",
	}),
	makeQuest("fog-rolling-in", {
		state: Option.none(),
		title: "Fog Rolling In",
		description: `Discover this hidden reference to one of the most iconic memes in the zombies community from the Black Ops II days, yeilding great potential rewards.`,
		map: "shattered-veil",
		content: "content/side-quests/fog-rolling-in",
	}),
	makeQuest("hidden-power-ups-shattered-veil", {
		state: Option.none(),
		title: "Hidden Power Ups",
		description: `Discover every hidden Power-Up location within Shattered Veil for you to spawn in at any time if you need them.`,
		map: "shattered-veil",
		content: "content/side-quests/hidden-power-ups-shattered-veil",
	}),
	makeQuest("round-100-boss-fight", {
		state: Option.none(),
		title: "Round 100 Boss Fight",
		description: `Discover this secret hardcore version of the Z-Rex boss fight that you can attempt after getting to Round 100 and completing the main quest.`,
		map: "shattered-veil",
		content: "content/side-quests/round-100-boss-fight",
	}),
	makeQuest("remember-us", {
		state: Option.none(),
		title: "Remember Us",
		description: `Discover the hidden Music Easter Egg Song "Remember Us" by Kevin Sherwood with vocals by Elena Siegman.`,
		map: "reckoning",
		content: "content/side-quests/remember-us",
	}),
	makeQuest("samanthas-peace", {
		state: Option.none(),
		title: "Samantha's Peace",
		description: `Discover this hidden Music Easter Egg Song "Samantha's Peace" by Brian Tuey.`,
		map: "reckoning",
		content: "content/side-quests/samanthas-peace",
	}),
	makeQuest("chicken-bucket-hat", {
		state: Option.none(),
		title: "Chicken Bucket Hat",
		description: `Learn how to obtain this greasy cosmetic Chicken Bucket Hat that you can wear through out your game.`,
		map: "reckoning",
		content: "content/side-quests/chicken-bucket-hat",
	}),
	makeQuest("vending-machine-reckoning", {
		state: Option.none(),
		title: "Vending Machine",
		description: `Discover the hidden loot inside this Vending Machine to test your luck for a chance of getting a Free Perk, Raygun, Pack-a-Punch Upgrade, Scorestreak or Aether Tool.`,
		map: "reckoning",
		content: "content/side-quests/vending-machine-reckoning",
	}),
	makeQuest("free-self-revive-reckoning", {
		state: Option.none(),
		title: "Free Self Revive",
		description: `Learn how to earn a free Self-Revive with a reference to the Element 115.`,
		map: "reckoning",
		content: "content/side-quests/free-self-revive-reckoning",
	}),
	makeQuest("paintings", {
		state: Option.none(),
		title: "Paintings",
		description: `Learn how to obtain a total of 1500 points by completing some interior design inside of the Director's Office.`,
		map: "reckoning",
		content: "content/side-quests/paintings",
	}),
	makeQuest("parachuting-challenge", {
		state: Option.none(),
		title: "Parachuting Challenge",
		description: `Learn how to complete this Mister Peeks parachuting challenge to obtain a Free Perk Power-Up in your game.`,
		map: "reckoning",
		content: "content/side-quests/parachuting-challenge",
	}),
	makeQuest("hardcore-bossfight", {
		state: Option.none(),
		title: "Hardcore Bossfight",
		description: `Discover this secret hardcore version of the Reckoning boss fight that you can attempt after getting to Round 100 and completing the main quest.`,
		map: "reckoning",
		content: "content/side-quests/hardcore-bossfight",
	}),
	makeQuest("aetherella-companion", {
		state: Option.none(),
		title: "Aetherella Companion",
		description: `Learn how to enable this dormant Aetherella figurine to become a strong companion helping you kill zombies for a few rounds.`,
		map: "reckoning",
		content: "content/side-quests/aetherella-companion",
	}),
	makeQuest("points-challenge", {
		state: Option.none(),
		title: "Points Challenge",
		description: `Learn how to obtain a Free Random Perk Power-Up inside of your game while completing one of the Main Quest steps.`,
		map: "reckoning",
		content: "content/side-quests/points-challenge",
	}),
	makeQuest("target-practice", {
		state: Option.none(),
		title: "Target Practice",
		description: `Learn how to obtain a free random Ammo Mod, Aether Tool, and Aetherium Crystal by playing a mini-game within the spawn.`,
		map: "reckoning",
		content: "content/side-quests/target-practice",
	}),
	makeQuest("golden-trash-bin", {
		state: Option.none(),
		title: "Golden Trash Bin",
		description: `Learn how to unlock the Golden Trash Bin that rewards you with valuable loot upon interaction.`,
		map: "reckoning",
		content: "content/side-quests/golden-trash-bin",
	}),
	makeQuest("caster-turret-upgrade", {
		state: Option.none(),
		title: "C.A.S.T.E.R. Turret Upgrade",
		description: `Learn how to unlock all upgrades to the C.A.S.T.E.R. Turret traps for increased effectiveness and gained effects.`,
		map: "reckoning",
		content: "content/side-quests/caster-turret-upgrade",
	}),
	makeQuest("hidden-power-ups-reckoning", {
		state: Option.none(),
		title: "Hidden Power Ups",
		description: `Discover every hidden Power-Up location within Reckoning for you to spawn in at any time if you need them.`,
		map: "reckoning",
		content: "content/side-quests/hidden-power-ups-reckoning",
	}),
	makeQuest("jump-scare-reckoning", {
		state: Option.none(),
		title: "Jump Scare",
		description: `Discover this hidden jumpscare within Reckoning that will remind you of the loss Richtofen has faced.`,
		map: "reckoning",
		content: "content/side-quests/jump-scare-reckoning",
	}),
	makeQuest("free-deadshot-daiquiri", {
		state: Option.none(),
		title: "Free Deadshot Daiquiri",
		description: `Learn how to obtain a free Deadshot Daiquiri perk in a similar way as seen in Liberty Falls.`,
		map: "reckoning",
		content: "content/side-quests/free-deadshot-daiquiri",
	}),
	makeQuest("aether-blade", {
		state: Option.none(),
		title: "Aether Blade",
		description: `Learn how to obtain one of the most powerful lethal equipment in Call of Duty: Zombies in your game.`,
		map: "reckoning",
		content: "content/side-quests/aether-blade",
	}),
	makeQuest("arc-xd-race-aotd", {
		state: Option.none(),
		title: "ARC-XD Race",
		description: `Discover this hidden ARC-XD Race to race against your teammates or the clock if solo for rewards.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/arc-xd-race-aotd",
	}),
	makeQuest("hidden-power-ups-aotd", {
		state: Option.none(),
		title: "Hidden Power Ups",
		description: `Discover all hidden power up locations in Ashes of the Damned to collect when you need them.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/hidden-power-ups-aotd",
	}),
	makeQuest("free-ray-gun-mark-2", {
		state: Option.none(),
		title: "Free Ray Gun MK II",
		description: `Learn how to obtain a free Ray Gun MK II, perks, and more by deciphering a hidden code.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/free-ray-gun-mark-2",
	}),
	makeQuest("toxic-growth-plant", {
		state: Option.none(),
		title: "Toxic Growth Plant",
		description: `Learn how to obtain Free Perks, Aetherium Crystals, Aether Tools, and more with the use of Toxic Growth.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/toxic-growth-plant",
	}),
	makeQuest("mister-peeks-axe-throw", {
		state: Option.none(),
		title: "Mister Peeks Axe Throw",
		description: `Learn how to obtain some free loot by completing a short axe throwing challenge.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/mister-peeks-axe-throw",
	}),
	makeQuest("vending-machine-ashes-of-the-damned", {
		state: Option.none(),
		title: "Vending Machine",
		description: `Learn how to obtain some free loot by trying your luck at a couple of vending machines.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/vending-machine-ashes-of-the-damned",
	}),
	makeQuest("free-wisp-tea", {
		state: Option.none(),
		title: "Free Wisp Tea",
		description: `Learn how to obtain a free Wisp Tea perk by interacting with the Farmhouse TV and finding the lost twins.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/free-wisp-tea",
	}),
	makeQuest("mixologist", {
		state: Option.none(),
		title: "Mixologist",
		description: `Learn how to obtain Juggernog, Quick Revive, Stamin-Up, or Speed Cola by mixing ingredients at the soda fountain.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/mixologist",
	}),
	makeQuest("zursa-skulls", {
		state: Option.none(),
		title: "Zursa Skulls",
		description: `Learn how to spawn a Zursa on-demand by shooting skulls with the Necrofluid Gauntlet.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/zursa-skulls",
	}),
	makeQuest("turn-to-ashes", {
		state: Option.none(),
		title: "Turn to Ashes",
		description: `Learn how to activate the music easter egg song 'Turn To Ashes' by Kevin Sherwood.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/turn-to-ashes",
	}),
	makeQuest("war-hero", {
		state: Option.none(),
		title: "War Hero",
		description: "Discover this Dempsey 'War Hero' dog tag, revealing some truths about his past.",
		map: "ashes-of-the-damned",
		content: "content/side-quests/war-hero",
	}),
	makeQuest("permanent-double-points", {
		state: Option.none(),
		title: "Permanent Double Points",
		description: `Learn how to obtain a permanent double points multiplier for your melee kills only.`,
		map: "ashes-of-the-damned",
		content: "content/side-quests/permanent-double-points",
	}),
	makeQuest("gramophone-free-perks", {
		state: Option.none(),
		title: "Gramophone Free Perks",
		description: `Learn how to obtain three free perks by completing three quick gramophone challenges.`,
		map: "astra-malorum",
		content: "content/side-quests/gramophone-free-perks",
	}),
	makeQuest("skulls-free-perk", {
		state: Option.none(),
		title: "Skulls Free Perk",
		description: `Learn how to obtain a free perk by collecting five skulls and completing a memory game.`,
		map: "astra-malorum",
		content: "content/side-quests/skulls-free-perk",
	}),
	makeQuest("nikolais-demons", {
		state: Option.none(),
		title: "Nikolai's Demons",
		description: `Discover some great backstory and a free legendary weapon by facing Nikolai's demons.`,
		map: "astra-malorum",
		content: "content/side-quests/nikolais-demons",
	}),
	makeQuest("magic", {
		state: Option.none(),
		title: "Magic",
		description: `Discover how to activate the Music Easter Egg song 'Magic' by Avenged Sevenfold.`,
		map: "astra-malorum",
		content: "content/side-quests/magic",
	}),
	makeQuest("original-pareidolia", {
		state: Option.none(),
		title: "Original Pareidolia",
		description: `Discover how to activate the original pareidolia Music Easter Egg song by Kevin Sherwood.`,
		map: "astra-malorum",
		content: "content/side-quests/original-pareidolia",
	}),
	makeQuest("pareidolia-remix", {
		state: Option.none(),
		title: "Pareidolia Remix",
		description: `Discover how to activate the pareidolia remix Music Easter Egg song by Kevin Sherwood.`,
		map: "astra-malorum",
		content: "content/side-quests/pareidolia-remix",
	}),
	makeQuest("bongo", {
		state: Option.none(),
		title: "Bongo",
		description: `Learn how to befriend a Ravager named Bongo to fight for you in Astra Malorum.`,
		map: "astra-malorum",
		content: "content/side-quests/bongo",
	}),
	makeQuest("skull-jumpscare", {
		state: Option.none(),
		title: "Skull Jumpscare",
		description: `Discover this hidden skull jumpscare within the telescope in the Observatory Dome.`,
		map: "astra-malorum",
		content: "content/side-quests/skull-jumpscare",
	}),
	makeQuest("twins", {
		state: Option.none(),
		title: "Twins",
		description: `Learn how to summon the ghost twins to obtain a free Cryo Freeze ammo mod and more loot.`,
		map: "astra-malorum",
		content: "content/side-quests/twins",
	}),
	makeQuest("hidden-power-ups-astra-malorum", {
		state: Option.none(),
		title: "Hidden Power Ups",
		description: `Discover all hidden power up locations in Astra Malorum to collect when you need them`,
		map: "astra-malorum",
		content: "content/side-quests/hidden-power-ups-astra-malorum",
	}),
	makeQuest("lantern-wisp", {
		state: Option.none(),
		title: "Lantern Wisp",
		description: "Learn how to obtain multiple golden wisps capable of one-shotting zombies.",
		map: "astra-malorum",
		content: "content/side-quests/lantern-wisp",
	}),
	makeQuest("zarya-rocket", {
		state: Option.none(),
		title: "Zarya Rocket",
		description: "Discover this hidden reference and music easter egg floating through space.",
		map: "astra-malorum",
		content: "content/side-quests/zarya-rocket",
	}),
	makeQuest("come-back-down", {
		state: Option.none(),
		title: "Come Back Down",
		description:
			"Learn how to activate the music easter egg song 'Come Back Down' by Kevin Sherwood.",
		map: "paradox-junction",
		content: "content/side-quests/come-back-down",
	}),
	makeQuest("hidden-power-ups-paradox-junction", {
		state: Option.none(),
		title: "Hidden Power-Ups",
		description:
			"Discover all hidden power up locations in Paradox Junction to collect when you need them",
		map: "paradox-junction",
		content: "content/side-quests/hidden-power-ups-paradox-junction",
	}),
	makeQuest("115-clock-tower", {
		state: Option.none(),
		title: "115 Clock Tower",
		description:
			"Learn how to obtain a Mystery Perk, Aetherium Crystal, Aether Tool, Scorestreak and more by completing this nostalgic callback.",
		map: "paradox-junction",
		content: "content/side-quests/115-clock-tower",
	}),
	makeQuest("golf-minigame", {
		state: Option.none(),
		title: "Golf Minigame",
		description: "Learn how to obtain three free Power-Ups by completing a short golf minigame.",
		map: "paradox-junction",
		content: "content/side-quests/golf-minigame",
	}),
	makeQuest("lost-key", {
		state: Option.none(),
		title: "Lost Key",
		description:
			"Learn how to obtain a free Aether Tool along with some other rewards, by finding the lost key.",
		map: "paradox-junction",
		content: "content/side-quests/lost-key",
	}),
	makeQuest("bunker-free-perk", {
		state: Option.none(),
		title: "Bunker Free Perk",
		description:
			"Learn how to obtain a Mystery Perk, along with some other rewards by opening the Nuketown bunker.",
		map: "paradox-junction",
		content: "content/side-quests/bunker-free-perk",
	}),
	makeQuest("mannequin-free-perk", {
		state: Option.none(),
		title: "Mannequin Free Perk",
		description:
			"Learn how to obtain a free Random Perk by melting all 12 mannequins in the Normal version of the map.",
		map: "paradox-junction",
		content: "content/side-quests/mannequin-free-perk",
	}),
	makeQuest("haunted-mannequin", {
		state: Option.none(),
		title: "Haunted Mannequin",
		description:
			"Learn how to obtain a Mystery Perk, Aetherium Crystal, Aether Tool, Scorestreak and more by completing this creepy quest.",
		map: "paradox-junction",
		content: "content/side-quests/haunted-mannequin",
	}),
	makeQuest("masked-mannequin", {
		state: Option.none(),
		title: "Masked Mannequin",
		description:
			"Learn how to obtain multiple Aetherium Crystals, Aether Tools, and Perks by reforming a masked mannequin.",
		map: "paradox-junction",
		content: "content/side-quests/masked-mannequin",
	}),
	makeQuest("tv-jumpscare", {
		state: Option.none(),
		title: "TV Jumpscare",
		description: "Scare your friends with this not so obvious jumpscare.",
		map: "paradox-junction",
		content: "content/side-quests/tv-jumpscare",
	}),
	makeQuest("purple-cyst", {
		state: Option.none(),
		title: "Purple Cyst",
		description: "Learn how to feed this mysterious purple cyst that yields powerful rewards.",
		map: "paradox-junction",
		content: "content/side-quests/purple-cyst",
	}),
	makeQuest("no-one-there", {
		state: Option.none(),
		title: "No One There",
		description:
			"Learn how to activate the music easter egg song 'No One There' by Kevin Sherwood.",
		map: "totenreich",
		content: "content/side-quests/no-one-there",
	}),
	makeQuest("kneehigh-helm", {
		state: Option.none(),
		title: "Kneehigh Helm",
		description:
			'Find out how to obtain the "Kneehigh Helm" allowing you to become a Gnome granting you invincibility while still being able to kill zombies.',
		map: "totenreich",
		content: "content/side-quests/kneehigh-helm",
	}),
	makeQuest("domineering", {
		state: Option.none(),
		title: "Domineering",
		description:
			'Discover the truth behind Richtofen\'s past and how he achieved his "Proudest Moment" which single-handedly won the war for Nazi Germany.',
		map: "totenreich",
		content: "content/side-quests/domineering",
	}),
	makeQuest("fishy-fish-bot", {
		state: Option.none(),
		title: "Fishy Fish Bot",
		description:
			'Learn how to unlock this secret "Fishy Fish Bot" trap that makes use of an old friend.',
		map: "totenreich",
		content: "content/side-quests/fishy-fish-bot",
	}),
	makeQuest("golden-tide-helm", {
		state: Option.none(),
		title: "Golden Tide Helm",
		description:
			'Find out how to obtain the "Golden Tide Helm" granting you increased rewards from fishing.',
		map: "totenreich",
		content: "content/side-quests/golden-tide-helm",
	}),
	makeQuest("icebane-helm", {
		state: Option.none(),
		title: "Icebane Helm",
		description:
			'Find out how to obtain the "Icebane Helm" granting you cold immunity, and a frosty slide.',
		map: "totenreich",
		content: "content/side-quests/icebane-helm",
	}),
	makeQuest("cointoss-helm", {
		state: Option.none(),
		title: "Cointoss Helm",
		description:
			'Find out how to obtain the "Cointoss Helm" granting you increased Power-Up drops.',
		map: "totenreich",
		content: "content/side-quests/cointoss-helm",
	}),
	makeQuest("hidden-power-ups-totenreich", {
		state: Option.none(),
		title: "Hidden Power-Ups",
		description:
			"Discover the location of every hidden Power-Up drop in Totenreich, in case you need them.",
		map: "totenreich",
		content: "content/side-quests/hidden-power-ups-totenreich",
	}),
	makeQuest("richtofen-jumpscare", {
		state: Option.none(),
		title: "Richtofen's Jumpscare",
		description: "Learn how to trigger the hidden jumpscare within the Richtofen Side Quest.",
		map: "totenreich",
		content: "content/side-quests/richtofen-jumpscare",
	}),
	makeQuest("the-reunion", {
		state: Option.none(),
		title: "The Reunion",
		description:
			"Confront Takeo's past in this cinematic story-driven experience revealing hidden mysterious about this character.",
		map: "kowakujo",
		content: "content/side-quests/the-reunion",
	}),
	makeQuest("maneka-mecha", {
		state: Option.none(),
		title: "Maneka Mecha",
		description:
			"Rebuild and destroy a familiar enemy and gain access to one of the most powerful innovations of human engineering.",
		map: "kowakujo",
		content: "content/side-quests/maneka-mecha",
	}),
	makeQuest("path-of-sorrows", {
		state: Option.none(),
		title: "Path of Sorrows",
		description:
			"Learn how to obtain Takeo Masaki's legendary katana by perfectly solving his father's murder.",
		map: "kowakujo",
		content: "content/side-quests/path-of-sorrows",
	}),
	makeQuest("neko-cafe", {
		state: Option.none(),
		title: "Neko Cafe",
		description:
			"Find and gather all the stray cats in the castle to open your very own Neko Cafe and obtain some useful rewards.",
		map: "kowakujo",
		content: "content/side-quests/neko-cafe",
	}),
	makeQuest("maneki-bomb", {
		state: Option.none(),
		title: "Maneki-Bomb",
		description:
			"Learn how to upgraded the map specific tactical to increase its effectiveness and usability.",
		map: "kowakujo",
		content: "content/side-quests/maneki-bomb",
	}),
	makeQuest("evencry", {
		state: Option.none(),
		title: "Evencry",
		description:
			'Discover how to activate the hidden music easter egg song "Evencry" by Kevin Sherwood.',
		map: "kowakujo",
		content: "content/side-quests/evencry",
	}),
	makeQuest("horse-race", {
		state: Option.none(),
		title: "Horse Race",
		description:
			"Race against the clock to earn powerful rewards, including a secret reward if you're really fast.",
		map: "kowakujo",
		content: "content/side-quests/horse-race",
	}),
	makeQuest("ghostly-rifleman-upgrade", {
		state: Option.none(),
		title: "Ghostly Rifleman Upgrade",
		description:
			"Learn how to upgrade the Ghostly Rifleman traps up to four total times to make them incredibly effective and useful.",
		map: "kowakujo",
		content: "content/side-quests/ghostly-rifleman-upgrade",
	}),
	makeQuest("hidden-power-ups-kowakujo", {
		state: Option.none(),
		title: "Hidden Power-Ups",
		description:
			"Discover the location of every hidden Power-Up drop in Kowakujō, in case you need them.",
		map: "kowakujo",
		content: "content/side-quests/hidden-power-ups-kowakujo",
	}),
	makeQuest("par-course", {
		state: Option.none(),
		title: "Par Course",
		description:
			"Complete this fiery parkour course on the map to receive a familiar weapon in a familiar way of the past.",
		map: "kowakujo",
		content: "content/side-quests/par-course",
	}),
	makeQuest("skull-mask", {
		state: Option.some("New"),
		title: "Skull Mask",
		description:
			"Learn how to obtain the Skull Mask, providing you with an additional Ammo Mod that summons the Twins for a short duration.",
		map: "rex-infernus",
		content: "content/side-quests/skull-mask",
	}),
	makeQuest("horned-mask", {
		state: Option.some("New"),
		title: "Horned Mask",
		description:
			'Learn how to obtain the Horned Mask, providing abilities similar to the Black Ops 4 perk "Stone Cold Stronghold"',
		map: "rex-infernus",
		content: "content/side-quests/horned-mask",
	}),
	makeQuest("uber-klaus-helmet", {
		state: Option.some("New"),
		title: "Uber Klaus Helmet",
		description:
			"Learn how to obtain the Uber Klaus Helmet, extending the duration of all grapples by 30 seconds.",
		map: "rex-infernus",
		content: "content/side-quests/uber-klaus-helmet",
	}),
	makeQuest("wardens-hat", {
		state: Option.some("New"),
		title: "Warden's Hat",
		description:
			"Learn how to obtain the Warden's Hat, granting you complete immunity to all web effects from Deathspinners and the Web Mother.",
		map: "rex-infernus",
		content: "content/side-quests/wardens-hat",
	}),
	makeQuest("dance-off", {
		state: Option.some("New"),
		title: "Dance Off",
		description:
			"Discover Mister Peeks' dance off and complete the dance challenge to earn potentially valuable rewards.",
		map: "rex-infernus",
		content: "content/side-quests/dance-off",
	}),
	makeQuest("corrupted-weapons", {
		state: Option.some("New"),
		title: "Corrupted Weapons",
		description:
			"Learn how to obtain Ultra Rarity Corrupted Olympia or TR2 guaranteed in your game.",
		map: "rex-infernus",
		content: "content/side-quests/corrupted-weapons",
	}),
	makeQuest("all-we-are", {
		state: Option.some("New"),
		title: "All We Are",
		description:
			'Discover the hidden music easter egg song "All We Are" by Kevin Sherwood with vocals by Elena Siegman.',
		map: "rex-infernus",
		content: "content/side-quests/all-we-are",
	}),
	makeQuest("dravakar-anvil", {
		state: Option.some("New"),
		title: "Dravakar Anvil",
		description:
			"Learn how to dismantle your weapons into Aether Tools and Aetherium Crystals that you can use to upgrade other weapons.",
		map: "rex-infernus",
		content: "content/side-quests/dravakar-anvil",
	}),
])

const SIDE_QUEST_INSERTION_INDEX_BY_ID = new Map<SideQuestKey, number>(
	[...SIDE_QUESTS.keys()].map((id, i) => [id, i]),
)
