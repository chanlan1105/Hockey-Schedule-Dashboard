import { createContext, Dispatch, SetStateAction } from "react";

type GameListingContextType = {
    checked: {[k: string]: boolean},
    handleToggle: (location: string, value: boolean) => void,
    selectAll: () => void,
    selectHome: () => void,
    selectNone: () => void,
    homeLocations: string[],
    locations: string[],
    allLocations: string[]
};

const GameListingContext = createContext<GameListingContextType | null>(null);

export default GameListingContext;