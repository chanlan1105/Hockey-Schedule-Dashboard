import { GameDataFields, ScoresheetsAPI_Fields, scoresheetsTournaments, spordlePageLeagues } from "@/lib/gameListing";
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
    game: GameDataFields,
    /** A reference to the source array of games this specific game belongs to. */
    games: GameDataFields[],
    /** The index of the next game in the array */
    nextIdx: number
}

/**
 * Function searches all specified leagues/tournaments and returns game listings.
 * @param timeSelector The time filter to search for
 * @param tournaments The scoresheets.ca leagues/tournaments to search through
 * @param leagues The Spordle Page leagues to search through
 * @returns The game data
 */
async function fetchData(timeSelector: InternalTimeSelector, tournaments: scoresheetsTournaments[], leagues: spordlePageLeagues[]) {
    // Fetch data from scoresheets.ca backend
    const scoresheetsRequests = tournaments.map(tournament => 
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
                    // Extract the required fields from the scoresheets.ca data 
                    // and parse the game's timestamp
                    return data.data.map(({
                        game_date,
                        startTime,
                        gameNumber,
                        divisionName,
                        levelName,
                        locationName,
                        awayTeamName,
                        homeTeamName,
                        tournamentId
                    }: ScoresheetsAPI_Fields) => ({
                        date_time: dayjs(`${game_date} ${startTime}`),
                        gameNumber,
                        divisionName,
                        levelName,
                        locationName,
                        awayTeamName,
                        homeTeamName,
                        tournamentId
                    })) as GameDataFields[];
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

    // Fetch data from Spordle play backend
    /** @TODO appropriate date filtering */
    const dateFilter = [];

    // Adjust Spordle filter based on currently selected timeSelector
    if (timeSelector == "last7") {
        dateFilter[0] = dayjs().subtract(7, "day").format("YYYY-MM-DD");
        dateFilter[1] = dayjs().format("YYYY-MM-DD");
    }
    else if (timeSelector == "all") {
        // Check if we are in the second half of the season (April or earlier). If this is the 
        // case, then we need to roll back the date to the previous year
        dateFilter[0] = dayjs().subtract(dayjs().get("month") <= 3 ? 1 : 0, "year").set("month", 7).set("date", 1).format("YYYY-MM-DD");
        
        // Also, if we are NOT in the second half of the season (April or earlier), then we 
        // need to roll forward the end date to the next year
        dateFilter[1] = dayjs().add(dayjs().get("month") <= 4 ? 0 : 1, "year").set("month", 3).set("date", 30).format("YYYY-MM-DD");
    }
    else {
        // Set the start date to today.
        dateFilter[0] = dayjs().format("YYYY-MM-DD");

        if (timeSelector == "today")
            dateFilter[1] = dayjs().format("YYYY-MM-DD");
        else if (timeSelector == "next7")
            dateFilter[1] = dayjs().add(7, "days").format("YYYY-MM-DD");
        else if (timeSelector == "next30")
            dateFilter[1] = dayjs().add(30, "days").format("YYYY-MM-DD");
        else if (timeSelector == "nextall")
            dateFilter[1] = dayjs().add(dayjs().get("month") <= 4 ? 0 : 1, "year").set("month", 3).set("date", 30).format("YYYY-MM-DD");
    }

    const spordleFilter = {
        order: "startTime ASC",
        skip: 0,
        where: {
            and: [
                { date: { between: dateFilter } },
                { or: leagues.map(league => ({ officeId: league })) }
            ]
        },
        include: ["teamStats", "surface", "office", "category", "awayTeam", "homeTeam", "externalProviders"]
    };

    const spordleRequests = fetch(`https://pub-api.play.spordle.com/api/sp/games?filter=${encodeURIComponent(JSON.stringify(spordleFilter))}`, {
        method: 'GET',
        headers: {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'fr;en',
            'authorization': 'API-Key f08ed9064e3cdc382e6abb305ff543d0150fb52f',
            'origin': 'https://page.spordle.com',
            'referer': 'https://page.spordle.com/',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36',
            'x-page-type': 'LEAGUE'
        }
    }).then(async res => {
        const rawText = await res.text();

        try {
            const data = JSON.parse(rawText);

            return data.map((d: any) => ({
                date_time: dayjs(d.startTime),
                gameNumber: d.number,
                divisionName: d.category.i18n.fr.name.split(" ")[0],
                levelName: `${d.category.i18n.fr.name.split(" ")[1]}${d.category.gender.toLowerCase() == "female" ? " F." : ""}`,
                locationName: d.surface.alias ?? `${d.surface.venue.name.replace(/ar(e|é)na /i, "")} ${d.surface.name.replace(/glace /i, "")}`,
                awayTeamName: d.awayTeam?.shortName,
                homeTeamName: d.homeTeam?.shortName,
                leagueId: d.officeId
            })) as GameDataFields[];
        }
        catch (err) {
            throw new Error(
                err instanceof Error ? err.message :
                typeof err == "string" ? err : "JSON parse error",
                { cause: err }
            );
        }
    });

    const allGameData = await Promise.all(scoresheetsRequests.concat(spordleRequests));

    // Create a min-heap storing the next available game for each tournament
    const heap = new Heap<HeapNode>((a, b) => 
        a.game.date_time.isBefore(b.game.date_time) ? -1 : 1
    );

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
    const sortedGames: GameDataFields[] = [];
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
    const gameDataJSON = use(fetchData(
        timeSelector,
        Object.values(scoresheetsTournaments).filter(v => typeof v === 'number') as scoresheetsTournaments[],
        Object.values(spordlePageLeagues).filter(v => typeof v === 'number') as spordlePageLeagues[]
    )).map(game => {
        return {
            ...game,
            date_time: undefined,
            flat_date: game.date_time.format("YYYY-MM-DD"),
            flat_time: game.date_time.format("HH:mm")
        }
    });

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