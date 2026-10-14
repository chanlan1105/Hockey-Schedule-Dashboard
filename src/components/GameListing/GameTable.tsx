import { GameEntryOptions, FlatGameDataFields } from "@/lib/gameListing";
import { Table, TableHead, TableRow, TableHeadCell, TableBody, TableCell } from "flowbite-react";

/**
 * @param options The information for this game.
 * @returns React component representing one row in the GameListing table.
 */
function GameEntry({ datetime, gameNum, category, location, visitor, local, gameSheet }: GameEntryOptions) {
    const cells = [
        { label: "datetime", content: datetime },
        { label: "gameNum", content: gameNum },
        { label: "category", content: category },
        { label: "location", content: location },
        { label: "visitor", content: visitor },
        { label: "local", content: local },
        { label: "gameSheet", content: gameSheet }
    ];

    return <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white">
        {
            cells.map(({ label, content }) => 
                <TableCell key={label} className="text-center text-gray-800 dark:text-white px-3 py-2 text-xs">{content}</TableCell>
            )
        }
    </TableRow>;
}

export default function GameTable({ gameDataJSON, locations }: { gameDataJSON: FlatGameDataFields[], locations: { [k: string]: boolean } }) {
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
                    <TableHeadCell className="text-center px-3">Game Sheet</TableHeadCell>
                </TableRow>
            </TableHead>
            <TableBody className="divide-y border-gray-200">
                {
                    gameDataJSON.map(({ id, flat_date, flat_time, gameNumber, divisionName, levelName, locationName, homeTeamName, awayTeamName, tournamentId, leagueId }) =>
                        locations[locationName] ? (
                            <GameEntry
                                key={`${id ?? tournamentId ?? leagueId}-${divisionName}-${levelName}-${gameNumber}`}
                                datetime={<>{flat_date}<br />{flat_time}</>}
                                gameNum={gameNumber}
                                category={`${divisionName.replace("oins de ", "").replace(" ans", "")} ${levelName}`}
                                location={locationName}
                                visitor={awayTeamName}
                                local={homeTeamName}
                                gameSheet={id ? (
                                    <a
                                        href={`https://pdf.play.spordle.com/game/${id}?locale=fr`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline text-nowrap"
                                    >
                                        <svg className="w-3.5 h-3.5 shrink-0" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                            <path fillRule="evenodd" d="M9 2.221V7H4.221a2 2 0 0 1 .53-.883l3.366-3.366a2 2 0 0 1 .883-.53Zm2 0V7a2 2 0 0 1-2 2H4v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7ZM8 16a1 1 0 0 1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1-5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z" clipRule="evenodd"/>
                                        </svg>
                                        GAME SHEET
                                    </a>
                                ) : null}
                            />
                        ) : null
                    )
                }
            </TableBody>
        </Table>
    </div>;
}