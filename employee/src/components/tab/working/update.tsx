import DialogCreateShift from "@/components/dialog/shift/create";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTER_PATH } from "@/constants/router.constant";
import { IWorkingHourDetail } from "@/interface/api/working-hour.interface";
import { formatTimeToHHMM } from "@/utils/date.utils";
import { MinusIcon, Undo2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DetailUpdateWorkingHourShiftTab from "./detail-update-shift";
import DetailWorkingHourTab from "./detail-working";

interface IUpdateWorkingHourTabProps {
    detail: IWorkingHourDetail;
}

export default function UpdateWorkingHourTab({
    detail,
}: IUpdateWorkingHourTabProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const [value, SetValue] = useState<string>("default");

    const handleClick = (value: string) => () => {
        navigate(value);
    };

    const handleBack = () => {
        navigate(`${ROUTER_PATH.WORKING}`);
    };

    useEffect(() => {
        const search = new URLSearchParams(location.search);

        SetValue(search.get("shift") || "default");
    }, [location]);

    return (
        <div className="flex flex-col gap-3">
            <Tabs defaultValue="default" value={value} className="w-full">
                <div className="flex gap-2">
                    <TabsList>
                        <TabsTrigger
                            value="default"
                            onClick={handleClick(
                                `${ROUTER_PATH.WORKING}/u/${detail.id}`
                            )}
                        >
                            Ngày làm việc
                        </TabsTrigger>
                        {detail.shifts.map((shift, index) => (
                            <TabsTrigger
                                value={shift.id}
                                key={shift.id}
                                onClick={handleClick(
                                    `${ROUTER_PATH.WORKING}/u/${detail.id}?shift=${shift.id}`
                                )}
                            >
                                <div className="flex gap-2 items-center">
                                    <p>Ca</p>
                                    <p>{formatTimeToHHMM(shift.start)}</p>
                                    <MinusIcon size={10} />
                                    <p>{formatTimeToHHMM(shift.end)}</p>
                                </div>
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <DialogCreateShift workingHourId={detail.id} />
                </div>
                <TabsContent value="default">
                    <DetailWorkingHourTab detail={detail} />
                </TabsContent>
                {detail.shifts.map((shift, index) => (
                    <TabsContent value={shift.id} key={shift.id}>
                        <DetailUpdateWorkingHourShiftTab id={shift.id} />
                    </TabsContent>
                ))}
            </Tabs>
            <div className="flex gap-2 w-full justify-end">
                <Button
                    variant="outline"
                    className="gap-2"
                    onClick={handleBack}
                >
                    <Undo2Icon size={15} /> Quay lại trang lịch làm
                </Button>
            </div>
        </div>
    );
}
