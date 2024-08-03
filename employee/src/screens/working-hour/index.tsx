import CalendarWorking from "@/components/calendar-working";
import CreateWorkingDay from "@/components/dialog/working/create";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import { rangeWorkingHourApi } from "@/lib/redux/actions/working-hour.action";
import { workingHourSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { endOfMonth, startOfMonth } from "date-fns";
import { RefreshCwIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

export default function CalendarWorkinghourScreen() {
    const dispatch = useAppDispatch();
    const { isCalling } = useAppSelector(workingHourSelector);

    const [debounceDate, SetDebounceDate] = useDebounce<Date>(new Date());
    const [selectedDate, SetSelectedDate] = useState<Date>(new Date());

    const getCalendar = (date: Date) => () => {
        const startMonth = startOfMonth(date);
        const endMonth = endOfMonth(date);

        dispatch(rangeWorkingHourApi(startMonth, endMonth));
    };

    const handlePrevMonth = () =>
        SetSelectedDate(
            new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1)
        );

    const handleNextMonth = () =>
        SetSelectedDate(
            new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1)
        );

    const handleChangMonth = (e: ChangeEvent<HTMLInputElement>) => {
        const month = Math.floor(parseInt(e.target.value) % 12);
        SetSelectedDate(new Date(selectedDate.getFullYear(), month));
    };

    const handleChangYear = (e: ChangeEvent<HTMLInputElement>) => {
        const year = Math.floor(parseInt(e.target.value) % 100);
        e.target.value =
            year.toString().length === 1 ? `0${year}` : year.toString();

        SetSelectedDate(
            new Date(parseInt(`20${year}`), selectedDate.getMonth())
        );
    };

    useEffect(() => {
        SetDebounceDate(selectedDate);
    }, [selectedDate]);

    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="w-full flex justify-between relative">
                    <div className="flex flex-1 justify-start gap-2 sticky top-0 left-0">
                        <Button variant="secondary" onClick={handlePrevMonth}>
                            Tháng trước
                        </Button>
                        <div className="w-[70px]">
                            <Input
                                type="number"
                                placeholder="Tháng"
                                onChange={handleChangMonth}
                                value={selectedDate.getMonth() + 1}
                            />
                        </div>
                        <Button variant="secondary" onClick={handleNextMonth}>
                            Tháng sau
                        </Button>
                        <div className="w-fit rounded border flex items-center">
                            <p className="pl-4 pr-1 border-r text-muted-foreground text-sm">
                                20
                            </p>
                            <Input
                                placeholder="Năm"
                                type="number"
                                className="w-[40px] rounded-none border-none px-1"
                                value={selectedDate.getFullYear() % 100}
                                onChange={handleChangYear}
                            />
                        </div>
                    </div>
                    <div className="w-fit flex gap-2">
                        <Button
                            onClick={getCalendar(debounceDate)}
                            variant="outline"
                            className="gap-1"
                            disabled={isCalling}
                        >
                            <RefreshCwIcon
                                size={14}
                                className={`${isCalling ? "animate-spin" : ""}`}
                            />
                            <p className="font-normal">
                                {isCalling ? "Đang tải" : "Tải lại"}
                            </p>
                        </Button>

                        <CreateWorkingDay />
                    </div>
                </div>
            </CardHeader>
            <CardContent className="flex-1">
                <CalendarWorking selectedDate={debounceDate} />
            </CardContent>
        </Card>
    );
}
