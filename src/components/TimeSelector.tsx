import { InternalTimeSelector, timeSelectorOptions } from "@/lib/timeSelector";
import { Button, ButtonGroup } from "flowbite-react";
import { Dispatch, SetStateAction } from "react";

export default function TimeSelector({ active }: { active: InternalTimeSelector }) {
    return <div className="flex justify-center mb-5">
        <ButtonGroup>
            {
                Object.entries(timeSelectorOptions).map(([key, text]) => 
                    <Button
                        key={key}
                        color={key == active ? "default" : "alternative"}
                        className={`transition-colors select-none ${key == active ? "pointer-events-none" : "cursor-pointer"}`}
                    >
                        {text}
                    </Button>
                )
            }
        </ButtonGroup>
    </div>;
}