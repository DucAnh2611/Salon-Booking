import useDebounce from "@/hooks/useDebounce";
import { cn } from "@/lib";
import { myJob } from "@/lib/redux/actions/job.action";
import { jobSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { format } from "date-fns";
import {
    CalendarIcon,
    ChevronLeft,
    ChevronRight,
    LoaderCircle,
    RotateCcw,
    XIcon,
} from "lucide-react";
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
    const { reload, jobs, count, isCalling } = useAppSelector(jobSelector);
    const [limit, SetLimit] = useState<number>(10);
    const [page, SetPage, pageV, pageDebouncing] = useDebounce<number>(1);
    const [from, SetFrom, fromV] = useDebounce<Date | undefined>(undefined);
    const [to, SetTo, toV] = useDebounce<Date | undefined>(undefined);

    const handleChangePage = (page: number) => () => {
        SetPage(page || 1);
    };

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
            myJob({ ...(from && { from }), ...(to && { to }), page: 1, limit })
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
                <div className="flex-1 flex flex-col gap-5 overflow-hidden relative">
                    <div className="flex flex-col flex-1 overflow-hidden relative z-[0]">
                        {!!jobs.length ? (
                            <ScrollArea className="pr-3 h-full ">
                                {jobs.map((job) => (
                                    <div key={job.id}>
                                        <JobCard job={job} />
                                    </div>
                                ))}
                            </ScrollArea>
                        ) : (
                            <p>Không có công việc</p>
                        )}
                        {(isCalling || pageDebouncing) && (
                            <div className="absolute top-0 left-0 w-full h-full z-[1] backdrop-blur-sm">
                                <div className="w-full h-full absolute top-0 left-0 bg-muted-foreground opacity-25 " />
                                <div className="flex relative z-[1] h-full w-full text-xs items-center justify-center gap-2">
                                    <LoaderCircle
                                        size={15}
                                        className="animate-spin"
                                    />
                                    <p>Đang tải</p>
                                </div>
                            </div>
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
                        <div className=" flex gap-2 w-full items-center">
                            <div className="text-xs flex gap-1 w-[100px]">
                                <span className="text-primary">
                                    {jobs.length + (pageV - 1) * limit}
                                </span>
                                <span>/</span>
                                <span>{count}</span>
                                <span>Công việc</span>
                            </div>
                            <div className="flex gap-2 flex-1">
                                <Button
                                    className="gap-2 flex-1"
                                    disabled={pageV <= 1}
                                    variant="outline"
                                    onClick={handleChangePage(pageV - 1)}
                                >
                                    <ChevronLeft size={15} /> Trang trước
                                </Button>
                                <Button
                                    className="gap-2 flex-1"
                                    disabled={pageV >= Math.ceil(count / limit)}
                                    variant="outline"
                                    onClick={handleChangePage(pageV + 1)}
                                >
                                    <ChevronRight size={15} /> Trang sau
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}
