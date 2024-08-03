import { IWorkingHour } from "@/interface/api/working-hour.interface";
import { cn } from "@/lib";
import { formatTimeToHHMM } from "@/utils/date.utils";
import { format, isToday } from "date-fns";

interface IWorkingDayProps {
    day: Date;
    isCurrentMonth: boolean;
    workingHour: IWorkingHour | null;
}

export default function WorkingDay({
    day,
    isCurrentMonth,
    workingHour,
}: IWorkingDayProps) {
    return (
        <div
            className={cn(
                "w-full aspect-square flex flex-col items-start justify-end box-border border relative p-2",
                isCurrentMonth
                    ? isToday(day)
                        ? "border-primary hover:border-primary"
                        : "border-muted hover:border-primary"
                    : "bg-card text-foreground opacity-30 border-muted",
                workingHour && workingHour.isOff ? "border-destructive" : ""
            )}
        >
            <div className="w-full h-fit flex items-center justify-end">
                <span className="text-xs">{format(day, "d")}</span>
            </div>
            <div className="flex-1 w-full">
                {!workingHour ? (
                    <div className="w-full h-full"></div>
                ) : (
                    <div
                        className={cn(
                            "w-full h-full flex flex-col justify-between gap-1"
                        )}
                    >
                        {workingHour.start && (
                            <div
                                className={cn(
                                    "flex items-center gap-1 w-full box-border relative"
                                )}
                            >
                                <p className="text-xs text-foreground px-1 text-center">
                                    {formatTimeToHHMM(workingHour.start)}
                                </p>
                                <span className="flex-1 h-[1px] bg-foreground text-foreground" />
                            </div>
                        )}
                        <div className="flex flex-col items-start flex-1 gap-1">
                            {workingHour.shifts.map((shift, index) => (
                                <div
                                    key={shift.id}
                                    className={cn(
                                        "flex-1 w-full flex bg-primary rounded box-border px-2 items-center"
                                    )}
                                >
                                    <p className="text-sm text-black font-semibold">
                                        Ca {index + 1}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {workingHour.end && (
                            <div
                                className={cn(
                                    "flex items-center gap-1 w-full box-border relative"
                                )}
                            >
                                <p className="text-xs text-destructive px-1 text-center">
                                    {formatTimeToHHMM(workingHour.end)}
                                </p>
                                <span className="flex-1 h-[1px] bg-destructive" />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
