import { GameEntryOptions, API_GameDataFields } from "@/lib/gameListing";
import { Table, TableHead, TableRow, TableHeadCell, TableBody, TableCell } from "flowbite-react";

/**
 * @param options The information for this game.
 * @returns React component representing one row in the GameListing table.
 */
function GameEntry(options: GameEntryOptions) {
    return <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800 text-gray-900 dark:text-white">
        {
            Object.entries(options).map(([label, option]) => 
                <TableCell key={label} className="text-center text-gray-800 dark:text-white px-3 py-2 text-xs">{option}</TableCell>
            )
        }
    </TableRow>;
}

export default function GameTable({ gameDataJSON, locations }: { gameDataJSON: API_GameDataFields[], locations: { [k: string]: boolean } }) {
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
                    gameDataJSON.map(({ game_date, startTime, gameNumber, divisionName, levelName, locationName, homeTeamName, awayTeamName, tournamentId }) =>
                        locations[locationName] ? (
                            <GameEntry
                                key={`${tournamentId}-${gameNumber}`}
                                datetime={<>{game_date}<br />{startTime}</>}
                                gameNum={gameNumber}
                                category={`${divisionName.replace("oins de ", "").replace(" ans", "")} ${levelName}`}
                                location={locationName}
                                local={homeTeamName}
                                visitor={awayTeamName}
                            />
                        ) : null
                    )
                }
            </TableBody>
        </Table>
    </div>;
}