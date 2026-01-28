import { API_GameDataFields, scoresheetsTournaments } from "@/lib/gameListing";
import { API_timeSelector, InternalTimeSelector } from "@/lib/timeSelector";
import { use } from "react";
import GameListingDisplay from "./GameListingDisplay";
import dayjs from "dayjs";
import Heap from "heap-js";

/**
 * Represents a node in the min-heap of game listings across multiple tournaments.
*/
interface HeapNode {
    /** The current game to be compared and sorted. */
    game: API_GameDataFields,
    /** A reference to the source array of games this specific game belongs to. */
    games: API_GameDataFields[],
    /** The index of the next game in the array */
    nextIdx: number
}

/**
 * Function searches all specified leagues/tournaments and returns game listings.
 * @param timeSelector The time filter to search for
 * @param tournaments The leagues/tournaments to search through
 * @returns The game data
 */
async function fetchData(timeSelector: InternalTimeSelector, tournaments: scoresheetsTournaments[]) {
    // Fetch data from scoresheets.ca backend
    const requests = tournaments.map(tournament => 
        fetch("https://scoresheets.ca/classes/TournamentPublicData.php", {
            "headers": {
                "accept": "application/json, text/javascript, */*; q=0.01",
                "accept-language": "en-US,en;q=0.9,fr-CA;q=0.8,fr;q=0.7,es-US;q=0.6,es;q=0.5",
                "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                "sec-ch-ua": "\"Chromium\";v=\"140\", \"Not=A?Brand\";v=\"24\", \"Google Chrome\";v=\"140\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "x-requested-with": "XMLHttpRequest",
                "cookie": "_ga=GA1.1.1527184177.1757463976; PHPSESSID=1a440c128e9e2240fad8a36fd7114e9c; _ga_QQ1YRY8RZ0=GS2.1.s1760133614$o12$g1$t1760133639$j35$l0$h0"
            },
            "body": `filterBy=tournament&filterRange=${API_timeSelector[timeSelector]}&getTournamentGameList=TournamentPublicData&divisionId=-1&tournamentId=${tournament}&levelId=-1&sortingColumn=date&sortingOrder=asc&searchInp=`,
            "method": "POST"
        }).then(async res => {
            const rawText = await res.text();

            try {
                const data = JSON.parse(rawText);
                if (data.resp)
                    return data.data as API_GameDataFields[];
                else 
                    return [];
            }
            catch (err) {
                if (rawText.includes(`"resp":false`)) {
                    // No games on this day.
                    return [];
                }
                else {
                    throw new Error(
                        err instanceof Error ? err.message :
                        typeof err == "string" ? err : "JSON parse error",
                        { cause: err }
                    );
                }
            }
        })
    );

    const allGameData = await Promise.all(requests);

    // Create a min-heap storing the next available game for each tournament
    const heap = new Heap<HeapNode>((a, b) => {
        const dateA = dayjs(`${a.game.game_date} ${a.game.startTime}`);
        const dateB = dayjs(`${b.game.game_date} ${b.game.startTime}`);

        return dateA.isBefore(dateB) ? -1 : 1;
    });

    // Push the first game from each tournament to the heap
    allGameData.forEach(games => {
        if (games.length) {
            const game = games[0];
            heap.push({
                game,
                games,
                nextIdx: 1
            });
        }
    });

    // Now populate an array from the min-heap
    const sortedGames: API_GameDataFields[] = [];
    while (!heap.isEmpty()) {
        // Add the next game to the sorted array.
        const { game, games, nextIdx } = heap.poll()!;
        sortedGames.push(game);

        // Check the array of games from the tournament we just pulled from.
        // If there are games remaining in it, add the next one to the min-heap.
        if (nextIdx < games.length) {
            const nextGame = games[nextIdx];
            heap.push({
                game: nextGame,
                games,
                nextIdx: nextIdx + 1
            });
        }
    }

    return sortedGames;
}

const homeLocationRegex = /^centre civique ddo [0-9]$|^pierrefonds [0-9]$|^cs st-raphael( [0-9])?$|^complexe sportif st-raphael$/i;

export default function GameListing({ timeSelector }: { timeSelector: InternalTimeSelector }) {
    const gameDataJSON = use(fetchData(timeSelector, [ scoresheetsTournaments.GrandMontreal, scoresheetsTournaments.CHL ]));

    const [homeLocations, locations] = [...new Set(gameDataJSON.map(({ locationName }) => locationName))]
        .sort()
        .reduce((acc: string[][], val: string) => {
            acc[val.match(homeLocationRegex) ? 0 : 1].push(val);
            return acc;
        }, [[], []]);

    return <>
        <GameListingDisplay homeLocations={homeLocations} locations={locations} gameDataJSON={gameDataJSON}></GameListingDisplay>
    </>;
}