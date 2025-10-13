import GameListingContext from "@/context/GameListingContext";
import { Button } from "flowbite-react";
import { useContext } from "react";

function FilterLabel({
    location, checked, onToggle
}: {
    location: string;
    checked: boolean;
    onToggle: (location: string, value: boolean) => void;
}) {
    return <label className="label">
        <input type="checkbox" checked={checked} className="checkbox" onChange={() => onToggle(location, !checked)} />
        {location}
    </label>;
}

function QuickFilters({
    homeLocations, selectAll, selectNone, selectHome
}: {
    homeLocations: boolean;
    selectAll: () => void;
    selectNone: () => void;
    selectHome: () => void;
}) {
    return <div className="text-center mb-3">
        {homeLocations ? <Button color={"alternative"} size="sm" className="inline-flex" onClick={selectHome}>Select Zone Locations</Button> : <></>}
        <Button color={"alternative"} size="sm" className="inline-flex" onClick={selectAll}>Select All</Button>
        <Button color={"alternative"} size="sm" className="inline-flex" onClick={selectNone}>Select None</Button>
    </div>;
}

export default function Filters() {
    const contextValues = useContext(GameListingContext);
    if (!contextValues) return;

    const { homeLocations, locations, checked, selectAll, selectNone, selectHome, handleToggle } = contextValues;

    return <div className="collapse collapse-arrow border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm dark:shadow-none border my-4">
        <input type="checkbox" />
        <div className="collapse-title font-semibold flex gap-x-2">
            <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M5.05 3C3.291 3 2.352 5.024 3.51 6.317l5.422 6.059v4.874c0 .472.227.917.613 1.2l3.069 2.25c1.01.742 2.454.036 2.454-1.2v-7.124l5.422-6.059C21.647 5.024 20.708 3 18.95 3H5.05Z" />
            </svg>
            Filters
        </div>
        <div className="collapse-content">
            <fieldset className="fieldset bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700 rounded-md max-w-md border p-4 max-h-[20rem] overflow-y-scroll">
                <legend className="fieldset-legend text-gray-600 dark:text-gray-300 px-1">Location</legend>

                <QuickFilters homeLocations={homeLocations.length != 0} selectAll={selectAll} selectHome={selectHome} selectNone={selectNone} />

                {
                    // Home locations, if any
                    homeLocations.map(location => <FilterLabel key={location} location={location} checked={checked[location]} onToggle={handleToggle} />
                    )}

                {
                    // Show divider only if there are home and other locations
                    homeLocations.length && locations.length ? <hr className="border-gray-300 dark:border-gray-700 my-3" /> : <></>}

                {
                    // Other locations, if any
                    locations.map(location => <FilterLabel key={location} location={location} checked={checked[location]} onToggle={handleToggle} />
                    )}
            </fieldset>
        </div>
    </div>
}