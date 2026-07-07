/** Whether the current environment is development */
export const IN_DEVELOPMENT = process.env.NODE_ENV === "development"
export const SITE_TITLE = "Call of Duty: Zombies Guides"
export const SITE_DESCRIPTION =
	"Detailed Main/Side Quest and Cursed Relic step-by-step guides, Interactive Maps, a complete Bestiary, and more."
/** Default date options for the date formatting function */
export const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
	year: "numeric",
	month: "long",
	day: "numeric",
}
/** Limit for the amount of preview cards shown per section on the home page */
export const HOME_PREVIEW_LIMIT = 3
