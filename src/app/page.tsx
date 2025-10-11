import GameListing from "@/components/GameListing";
import TimeSelector from "@/components/TimeSelector";
import { InternalTimeSelector, isInternalTimeSelector } from "@/lib/timeSelector";
import { SearchParams } from "next/dist/server/request/search-params";
import { Suspense } from "react";

export default async function Home({ searchParams }: { searchParams: Promise<SearchParams> }) {
    const timeSelectorParam = ((await searchParams).timeSelector as string) ?? "today";
    const timeSelector: InternalTimeSelector = isInternalTimeSelector(timeSelectorParam) ? timeSelectorParam : "today";

    return (
        <main className="mx-auto container xs:px-4 lg:px-12">
            <TimeSelector active={timeSelector}></TimeSelector>

            <Suspense key={timeSelector} fallback={<p>Loading...</p>}>
                <GameListing timeSelector={timeSelector}></GameListing>
            </Suspense>
        </main>
    );
}
