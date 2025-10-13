"use client";

import { API_GameDataFields } from "@/lib/gameListing";
import { useState, useCallback } from "react";
import GameTable from "./GameTable";
import Filters from "./Filters";
import GameListingContext from "@/context/GameListingContext";

export default function GameListingDisplay({ homeLocations, locations, gameDataJSON }: { homeLocations: string[]; locations: string[]; gameDataJSON: API_GameDataFields[]; }) {
    const allLocations = homeLocations.concat(locations);

    const [checked, setChecked] = useState(
        // Every location starts off as checked
        Object.fromEntries(
            allLocations.map(l => [l, true])
        )
    );

    /** Callback to handle individual checkbox toggling */
    const handleToggle = useCallback((location: string, value: boolean) => {
        // Update state
        setChecked(prev => ({ ...prev, [location]: value }));
    }, []);

    /** Callback to select all locations */
    const selectAll = useCallback(() => {
        allLocations.forEach(l => handleToggle(l, true));
    }, [allLocations]);

    /** Callback to select no locations */
    const selectNone = useCallback(() => {
        allLocations.forEach(l => handleToggle(l, false));
    }, [allLocations]);

    /** Callback to select home locations */
    const selectHome = useCallback(() => {
        homeLocations.forEach(l => handleToggle(l, true));
        locations.forEach(l => handleToggle(l, false));
    }, [homeLocations, locations]);

    return <GameListingContext value={{ checked, handleToggle, selectAll, selectNone, selectHome, homeLocations, locations, allLocations }}>
        {/* FILTERS */}
        <Filters />

        {/* GAME TABLE */}
        <GameTable gameDataJSON={gameDataJSON} locations={checked}></GameTable>
    </GameListingContext>;
}
