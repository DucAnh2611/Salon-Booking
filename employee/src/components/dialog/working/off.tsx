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
import { toggleOffWorkingHourApi } from "@/lib/redux/actions/working-hour.action";
import { workingHourSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { format } from "date-fns";
import { useEffect, useState } from "react";

interface IToggleOffWorkingDayProps {
    working: IWorkingHour;
}

export default function DialogToggleOffWorkingDay({
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
        dispatch(toggleOffWorkingHourApi(working.date));
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
                        "gap-1 text-left p-2 py-1.5 h-fit w-full font-semibold justify-start",
                        working.isOff ? "text-green-500" : "text-primary"
                    )}
                    variant="ghost"
                >
                    {working.isOff ? "Mở cửa" : "Nghỉ làm"}
                </Button>
            </DialogTrigger>
            <DialogContent className="w-fit max-w-none">
                <DialogHeader>
                    <DialogTitle>
                        {working.isOff ? "Mở lại" : "Nghỉ"} ngày làm việc
                    </DialogTitle>
                    <DialogDescription>
                        Ngày làm việc{" "}
                        <b>{format(working.date, "dd/MM/yyyy")}</b> sẽ được đánh
                        dấu là <b>{working.isOff ? "đi làm" : "nghỉ"}</b>.{" "}
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
                            variant="default"
                            type="button"
                            onClick={handleSubmit}
                        >
                            {working.isOff ? "Mở lại" : "Nghỉ"}
                        </Button>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
