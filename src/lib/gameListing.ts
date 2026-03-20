import dayjs from "dayjs"
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
 * Fields required to represent a game internally
 */
export interface GameDataFields {
    date_time: dayjs.Dayjs,
    gameNumber: number,
    divisionName: string,
    levelName: string,
    locationName: string,
    awayTeamName: string,
    homeTeamName: string,
    tournamentId?: scoresheetsTournaments
    leagueId?: spordlePageLeagues
}

/**
 * Internal representation of a game, where the dayjs `date_time` has been flattened to a string
 */
export interface FlatGameDataFields extends Omit<GameDataFields, "date_time"> {
    flat_date: string,
    flat_time: string
}

/**
 * Fields required to extract from Scoresheets.ca API to construct a Game using GameDataFields
 */
export interface ScoresheetsAPI_Fields {
    game_date: string,
    startTime: string,
    gameNumber: number,
    divisionName: string,
    levelName: string,
    locationName: string,
    awayTeamName: string,
    homeTeamName: string,
    tournamentId: scoresheetsTournaments
}

/**
 * Enum of URL encoded tournaments/leagues from scoresheets.ca to pull data from
 */
export enum scoresheetsTournaments {
    GrandMontreal = 15,
    CHL = 18,
    LRLSL = 20,
    CHL_Series = 22,
    GrandMontreal_Series = 25,
    LSL_Regionals = 26
};

/**
 * Enum of Spordle Page leagues to pull data from
 */
export enum spordlePageLeagues {
    LQHF = 8508,
    LHEQF = 9176
};