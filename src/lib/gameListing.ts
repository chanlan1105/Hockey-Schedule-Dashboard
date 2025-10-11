import { JSX } from "react"

/**
 * Required options to display game listings on frontend UI
 */
export interface GameEntryOptions {
    /** The date and time of the game, formatted in human-readable format */
    datetime: JSX.Element,
    /** The game number as a string or number */
    gameNum: string | number,
    /** Category, ex. MD AA */
    category: string,
    /** Location */
    location: string,
    /** The visiting team */
    visitor: string,
    /** The local team */
    local: string
}

/**
 * Required fields to extract from fetched API game data
 */
export interface API_GameDataFields {
    game_date: string,
    startTime: string,
    gameNumber: number,
    divisionName: string,
    levelName: string,
    locationName: string,
    awayTeamName: string,
    homeTeamName: string
}