import { EMPLOYEE_SHIFT_STATUS_TEXT } from "@/constants/shift.constant";
import { EShiftEmployeeStatus } from "@/enum/shift.enum";
import { cn } from "@/lib";

interface IShiftEmployeeStatusProps {
    status: EShiftEmployeeStatus;
}

const classStatus: Record<
    EShiftEmployeeStatus,
    Record<"border" | "inside", string>
> = {
    [EShiftEmployeeStatus.AVAILABLE]: {
        border: "border-green-400",
        inside: "bg-green-400",
    },
    [EShiftEmployeeStatus.ON_JOB]: {
        border: "border-primary",
        inside: "bg-primary",
    },
    [EShiftEmployeeStatus.URGENT_LEAVE]: {
        border: "border-destructive",
        inside: "bg-destructive",
    },
};

export default function ShiftEmployeeStatus({
    status,
}: IShiftEmployeeStatusProps) {
    return (
        <div className="flex gap-2 items-center bg-muted rounded px-3 py-2">
            <div
                className={cn(
                    "size-3 rounded-full p-[1px] box-border border",
                    classStatus[status].border
                )}
            >
                <div
                    className={cn(
                        "w-full h-full rounded-full animate-ping",
                        classStatus[status].inside
                    )}
                />
            </div>
            <p className="text-sm">{EMPLOYEE_SHIFT_STATUS_TEXT[status]}</p>
        </div>
    );
}
