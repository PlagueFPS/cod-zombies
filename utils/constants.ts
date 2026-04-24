import type { Metadata } from "next"

/** Whether the current environment is development */
export const IN_DEVELOPMENT = process.env.NODE_ENV === "development"
export const SITE_TITLE = "Call of Duty: Zombies Guides"
export const SITE_DESCRIPTION =
	"Detailed main/side quests and Cursed Relic step-by-step guides, interactive maps, a complete bestiary, and more to give you all the resources you'll need for zombies."
/** Default date options for the date formatting function */
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "long",
	day: "numeric",
}
/** Limit for the amount of cards shown per page on every grid */
export const CARD_LIMIT = 12
/** Limit for the amount of preview cards shown per section on the home page */
export const HOME_PREVIEW_LIMIT = 3
/** Default Open Graph properties for the website */
export const GLOBAL_OG_PROPS: Metadata["openGraph"] = {
	siteName: SITE_TITLE,
	locale: "en_US",
	type: "website",
	emails: ["contact@codzombiesguides.com"],
}
