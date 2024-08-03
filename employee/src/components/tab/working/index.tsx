import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ROUTER_PATH } from "@/constants/router.constant";
import { IWorkingHourDetail } from "@/interface/api/working-hour.interface";
import { formatTimeToHHMM } from "@/utils/date.utils";
import { MinusIcon, Undo2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DetailWorkingHourShiftTab from "./detail-shift";
import DetailWorkingHourTab from "./detail-working";

interface IWorkingHourTabProps {
    detail: IWorkingHourDetail;
}

export default function WorkingHourTab({ detail }: IWorkingHourTabProps) {
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
                <TabsList>
                    <TabsTrigger
                        value="default"
                        onClick={handleClick(
                            `${ROUTER_PATH.WORKING}/${detail.id}`
                        )}
                    >
                        Ngày làm việc
                    </TabsTrigger>
                    {detail.shifts.map((shift, index) => (
                        <TabsTrigger
                            value={shift.id}
                            key={shift.id}
                            onClick={handleClick(
                                `${ROUTER_PATH.WORKING}/${detail.id}?shift=${shift.id}`
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
                <TabsContent value="default">
                    <DetailWorkingHourTab detail={detail} />
                </TabsContent>
                {detail.shifts.map((shift, index) => (
                    <TabsContent value={shift.id} key={shift.id}>
                        <DetailWorkingHourShiftTab id={shift.id} />
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
