export type ContentState = "New" | "Coming Soon"

export interface TimeRange {
	/** Minimum time required to complete on average in mins */
	min: number
	/** Maximum time required to complete on average in mins */
	max: number
	/** Reason explaining why the estimates are what they are */
	reason?: string
}

export interface APIResult {
	/** Whether the request was successful */
	success: boolean
	/** The result message */
	message: string
}
