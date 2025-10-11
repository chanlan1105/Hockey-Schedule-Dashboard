/**
 * Human-readable time selector option based on internal codes
 */
export const timeSelectorOptions = {
    "all": "Complete",
    "last7": "Last 7 Days",
    "today": "Today",
    "next7": "Next 7 Days",
    "next30": "Next 30 Days",
    "nextall": "All Future"
};

/**
 * API time selector field to pass based on internal codes
 */
export const API_timeSelector = {
    "all": "complete",
    "last7": "past_7_days",
    "today": "today",
    "next7": "next_7_days",
    "next30": "next_30_days",
    "nextall": "complete"
};

export type InternalTimeSelector = keyof typeof timeSelectorOptions;