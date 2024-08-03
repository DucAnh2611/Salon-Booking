import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IWorkingHour } from "@/interface/api/working-hour.interface";
import { cn } from "@/lib";
import { deleteWorkingHourApi } from "@/lib/redux/actions/working-hour.action";
import { workingHourSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface IToggleOffWorkingDayProps {
    working: IWorkingHour;
}

export default function DialogDeleteWorkingDay({
    working,
}: IToggleOffWorkingDayProps) {
    const dispatch = useAppDispatch();
    const { isCreating, isFailure } = useAppSelector(workingHourSelector);

    const [open, SetOpen] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);

    const toggleOpen = () => {
        SetOpen((o) => !o);
    };

    const handleSubmit = () => {
        SetSubmit(true);
        dispatch(deleteWorkingHourApi([working.id]));
    };

    useEffect(() => {
        if (submit && !isCreating && !isFailure) {
            SetSubmit(false);
            SetOpen(false);
        }
    }, [submit, isCreating, isFailure]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button
                    className={cn(
                        "gap-1 text-left p-2 py-1.5 h-fit w-full font-semibold justify-start text-destructive"
                    )}
                    variant="ghost"
                >
                    Xóa
                </Button>
            </DialogTrigger>
            <DialogContent className="w-fit max-w-none">
                <DialogHeader>
                    <DialogTitle>Xóa ngày làm việc</DialogTitle>
                    <DialogDescription>
                        Ngày làm việc{" "}
                        <b>{format(working.date, "dd/MM/yyyy")}</b> sẽ bị xóa
                        khỏi lịch.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <DialogFooter className="mt-3">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={toggleOpen}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="destructive"
                            type="button"
                            onClick={handleSubmit}
                            className="gap-1"
                        >
                            Xóa <b>{format(working.date, "dd/MM/yyyy")}</b>
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
