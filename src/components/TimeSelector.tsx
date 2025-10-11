"use client";

import { InternalTimeSelector, timeSelectorOptions } from "@/lib/timeSelector";
import { Button, ButtonGroup } from "flowbite-react";
import { useRouter, useSearchParams } from "next/navigation";
import { startTransition, useOptimistic } from "react";

export default function TimeSelector({ active }: { active: InternalTimeSelector }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [oActive, setoActive] = useOptimistic(active);

    return <div className="flex justify-center mb-5">
        <ButtonGroup>
            {
                Object.entries(timeSelectorOptions).map(([key, text]) => 
                    <Button
                        key={key}
                        color={key == oActive ? "default" : "alternative"}
                        className={`transition-colors select-none ${key == oActive ? "pointer-events-none" : "cursor-pointer"}`}
                        onClick={() => {
                            startTransition(() => {
                                // Update the optimistic active value to immediately update active button
                                setoActive(key as InternalTimeSelector);

                                // On button click, update URL search paramter to clicked timeSelector
                                const nextSearchParams = new URLSearchParams(searchParams);
                                nextSearchParams.set("timeSelector", key);
                                router.push(`/?${nextSearchParams.toString()}`);
                            });
                        }}
                    >
                        {text}
                    </Button>
                )
            }
        </ButtonGroup>
    </div>;
}