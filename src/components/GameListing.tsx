import { API_GameDataFields, GameEntryOptions } from "@/lib/gameListing";
import { API_timeSelector, InternalTimeSelector } from "@/lib/timeSelector";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { Suspense, use } from "react";

/**
 * @param options The information for this game.
 * @returns React component representing one row in the GameListing table.
 */
function GameEntry(options: GameEntryOptions) {
    return <TableRow key={options.gameNum} className="bg-white dark_border-gray-700 dark_bg-gray-800 text-gray-900 dark:text-white">
        {
            Object.entries(options).map(([label, option]) => 
                <TableCell key={label} className="text-center text-gray-800 dark:text-white px-3 py-2 text-xs">{option}</TableCell>
            )
        }
    </TableRow>;
}

async function fetchData(timeSelector: InternalTimeSelector) {
    const gameData = await fetch("https://scoresheets.ca/classes/TournamentPublicData.php", {
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
            "cookie": "_ga=GA1.1.1527184177.1757463976; PHPSESSID=1a440c128e9e2240fad8a36fd7114e9c; _ga_QQ1YRY8RZ0=GS2.1.s1760133614$o12$g1$t1760133639$j35$l0$h0",
            "Referer": "https://scoresheets.ca/tournament-schedules.php?tournamentId=15&tournamentName=LIGUE%20HOCKEY%20DU%20GRAND-MONTR%C3%89AL"
        },
        "body": `filterBy=tournament&filterRange=${API_timeSelector[timeSelector]}&getTournamentGameList=TournamentPublicData&divisionId=-1&tournamentId=15&levelId=-1&sortingColumn=date&sortingOrder=asc&searchInp=`,
        "method": "POST"
    });

    const gameDataJSON: API_GameDataFields[] = (await gameData.json()).data;

    return gameDataJSON;
}

export default function GameListing({ timeSelector }: { timeSelector: InternalTimeSelector }) {
    const gameDataJSON = use(fetchData(timeSelector));

    return <div className="overflow-x-auto">
        <Table hoverable>
            <TableHead>
                <TableRow className="text-nowrap">
                    <TableHeadCell className="text-center px-3">Date & Time</TableHeadCell>
                    <TableHeadCell className="text-center px-3">Game No</TableHeadCell>
                    <TableHeadCell className="text-center px-3">Category</TableHeadCell>
                    <TableHeadCell className="text-center px-3">Location</TableHeadCell>
                    <TableHeadCell className="text-center px-3">Visitor</TableHeadCell>
                    <TableHeadCell className="text-center px-3">Local</TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody className="divide-y border-gray-200">
                {
                    gameDataJSON.map(({ game_date, startTime, gameNumber, divisionName, levelName, locationName, homeTeamName, awayTeamName }) => 
                        GameEntry({
                            datetime: <>{game_date}<br />{startTime}</>,
                            gameNum: gameNumber,
                            category: `${divisionName.replace("oins de ", "").replace(" ans", "")} ${levelName}`,
                            location: locationName,
                            local: homeTeamName,
                            visitor: awayTeamName
                        })
                    )
                }
            </TableBody>
        </Table>
    </div>;
}