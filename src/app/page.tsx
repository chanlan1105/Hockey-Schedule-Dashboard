import GameListing from "@/components/GameListing";
import TimeSelector from "@/components/TimeSelector";
export default function Home() {
    return (
        <main className="mx-auto container xs:px-4 lg:px-12">
            <TimeSelector active="today"></TimeSelector>

            <GameListing timeSelector="today"></GameListing>
        </main>
    );
}
