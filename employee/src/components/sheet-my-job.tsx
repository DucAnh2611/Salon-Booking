import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib";
import { myJob } from "@/lib/redux/actions/job.action";
import { jobSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { format } from "date-fns";
import { CalendarIcon, RotateCcw, XIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import DatePicker from "./date-picker";
import JobCard from "./job-card";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./ui/sheet";

interface ISheetMyJobProps {
    trigger: ReactNode;
}

export default function SheetMyJob({ trigger }: ISheetMyJobProps) {
    const dispatch = useAppDispatch();
    const { reload, jobs, isCalling, isFailure } = useAppSelector(jobSelector);
    const [page, SetPage] = useState<number>(1);
    const [limit, SetLimit] = useState<number>(20);
    const [from, SetFrom, fromV] = useDebounce<Date | undefined>(undefined);
    const [to, SetTo, toV] = useDebounce<Date | undefined>(undefined);

    const handleSelectDate = (type: "from" | "to") => (date: Date | null) => {
        let setter = undefined;
        switch (type) {
            case "from":
                setter = SetFrom;

                if (date && toV && date > toV) {
                    SetTo(date);
                }
                break;

            case "to":
                setter = SetTo;
                break;

            default:
                return;
        }
        SetPage(1);
        setter(date || undefined);
    };

    const handleReload = () => {
        dispatch(
            myJob({ ...(from && { from }), ...(to && { to }), page, limit })
        );
    };

    useEffect(() => {
        dispatch(
            myJob({ ...(from && { from }), ...(to && { to }), page, limit })
        );
    }, [from, to, page, limit]);

    useEffect(() => {
        if (reload) {
            dispatch(
                myJob({ ...(from && { from }), ...(to && { to }), page, limit })
            );
        }
    }, [reload]);

    return (
        <Sheet>
            <SheetTrigger asChild>{trigger}</SheetTrigger>
            <SheetContent className="flex flex-col gap-5 h-full !max-w-none !w-[500px]">
                <SheetHeader>
                    <div className="flex justify-between items-center w-full pr-3">
                        <SheetTitle>Công việc của tôi</SheetTitle>
                        <div>
                            <Button
                                variant="outline"
                                className="gap-1"
                                onClick={handleReload}
                                disabled={isCalling}
                            >
                                <RotateCcw
                                    size={15}
                                    className={isCalling ? "animate-spin" : ""}
                                />
                                Làm mới
                            </Button>
                        </div>
                    </div>
                </SheetHeader>
                <div className="flex-1 flex flex-col gap-5 overflow-hidden">
                    <div className="flex flex-col flex-1 overflow-hidden">
                        {!!jobs.length ? (
                            <ScrollArea className="pr-3 h-full">
                                {jobs.map((job) => (
                                    <div key={job.id}>
                                        <JobCard job={job} />
                                    </div>
                                ))}
                            </ScrollArea>
                        ) : (
                            <p>Không có công việc</p>
                        )}
                    </div>

                    <div className="flex gap-2 flex-col mt-2">
                        <div className="flex gap-2 items-center">
                            <p className="text-xs w-[100px] whitespace-nowrap">
                                Từ ngày
                            </p>
                            <div className="flex-1">
                                <DatePicker
                                    value={fromV}
                                    onChange={handleSelectDate("from")}
                                    trigger={
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "justify-start text-left font-normal w-full",
                                                !fromV &&
                                                    "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {fromV ? (
                                                format(fromV, "dd/MM/yyyy")
                                            ) : (
                                                <span>Chọn ngày bắt đầu</span>
                                            )}
                                        </Button>
                                    }
                                />
                            </div>
                            {!!fromV && (
                                <Button
                                    variant="destructive"
                                    onClick={() => {
                                        handleSelectDate("from")(null);
                                    }}
                                >
                                    <XIcon size={15} />
                                    Xóa
                                </Button>
                            )}
                        </div>
                        <div>
                            <div className="flex gap-2 items-center">
                                <p className="text-xs w-[100px] whitespace-nowrap">
                                    Tới ngày
                                </p>
                                <div className="flex-1">
                                    <DatePicker
                                        value={toV}
                                        onChange={handleSelectDate("to")}
                                        fromDate={fromV}
                                        trigger={
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !toV &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {toV ? (
                                                    format(toV, "dd/MM/yyyy")
                                                ) : (
                                                    <span>
                                                        Chọn ngày kết thúc
                                                    </span>
                                                )}
                                            </Button>
                                        }
                                    />
                                </div>
                                {!!toV && (
                                    <Button
                                        variant="destructive"
                                        onClick={() => {
                                            handleSelectDate("to")(null);
                                        }}
                                    >
                                        <XIcon size={15} />
                                        Xóa
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
