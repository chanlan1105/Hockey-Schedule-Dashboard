import { API_GameDataFields } from "@/lib/gameListing";
import { API_timeSelector, InternalTimeSelector } from "@/lib/timeSelector";
import { use } from "react";
import GameListingDisplay from "./GameListingDisplay";

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

const homeLocationRegex = /^centre civique ddo [0-9]$|^pierrefonds [0-9]$|cs st-raphael( [0-9])?/i;

export default function GameListing({ timeSelector }: { timeSelector: InternalTimeSelector }) {
    const gameDataJSON = use(fetchData(timeSelector));
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