import { cn } from "@/lib";
import { formatTimeDifference } from "@/utils/date.utils";
import { useEffect, useState } from "react";

interface IDateStateProps {
    start: Date;
    end: Date;
}

type TDateState = "NOT_START" | "WORKING" | "END";

const classState: Record<TDateState, Record<"border" | "inside", string>> = {
    NOT_START: {
        border: "border-primary",
        inside: "bg-primary",
    },
    WORKING: {
        border: "border-green-400",
        inside: "bg-green-400",
    },
    END: {
        border: "border-destructive",
        inside: "bg-destructive",
    },
};

export default function DateState({ start, end }: IDateStateProps) {
    const currentState = (start: Date, end: Date): TDateState => {
        const nStart = new Date(start);
        const nEnd = new Date(end);
        const current = new Date();

        if (current < nStart) {
            return "NOT_START";
        } else if (current >= nStart && current < nEnd) {
            return "WORKING";
        } else {
            return "END";
        }
    };

    const calDiffTime = (start: Date, end: Date) => {
        const state = currentState(start, end);

        if (state === "NOT_START") {
            return `Bắt đầu trong ${formatTimeDifference(
                new Date(start),
                new Date()
            )}`;
        }
        if (state === "WORKING") {
            return `Đã bắt đầu ${formatTimeDifference(
                new Date(start),
                new Date()
            )}`;
        }
        if (state === "END") {
            return `Đã kết thúc ${formatTimeDifference(
                new Date(end),
                new Date()
            )}`;
        }
        return "Đang tính toán...";
    };

    const [state, SetState] = useState<string>(calDiffTime(start, end));

    useEffect(() => {
        const interval = setInterval(() => {
            SetState(calDiffTime(start, end));
        }, 1000);
        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="flex items-center gap-2 w-fit">
            <div
                className={cn(
                    "size-3 rounded-full border p-[2px] box-border flex items-center",
                    classState[currentState(start, end)].border
                )}
            >
                <div
                    className={cn(
                        "w-full h-full rounded-full animate-ping",
                        classState[currentState(start, end)].inside
                    )}
                />
            </div>

            <p className={cn("text-xs")}>{state}</p>
        </div>
    );
}
