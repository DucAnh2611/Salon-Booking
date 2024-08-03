import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTER_PATH } from "@/constants/router.constant";
import { IShift } from "@/interface/api/shift.interface";
import { formatTimeToHHMM } from "@/utils/date.utils";
import { ColumnDef } from "@tanstack/react-table";
import { MinusIcon } from "lucide-react";
import { Link } from "react-router-dom";

export const shiftColumnDef: ColumnDef<IShift>[] = [
    {
        id: "index",
        header: "Ca",
        cell: ({ row }) => {
            const index = row.index;
            return <p>{index + 1}</p>;
        },
        size: 10,
    },
    {
        header: "Thời gian ca làm",
        cell: ({ row }) => {
            const shift = row.original;
            const startTime = formatTimeToHHMM(shift.start);
            const endTime = formatTimeToHHMM(shift.end);

            return (
                <div className="flex gap-2 items-center">
                    <Badge variant="outline">{startTime}</Badge>
                    <MinusIcon size={15} />
                    <Badge variant="outline">{endTime}</Badge>
                </div>
            );
        },
    },
    {
        header: "Thời gian đặt lịch",
        cell: ({ row }) => {
            const shift = row.original;
            const startTime = formatTimeToHHMM(shift.bookingStart);
            const endTime = formatTimeToHHMM(shift.bookingEnd);

            return (
                <div className="flex gap-2 items-center">
                    <Badge variant="outline">{startTime}</Badge>
                    <MinusIcon size={15} />
                    <Badge variant="outline">{endTime}</Badge>
                </div>
            );
        },
    },
    {
        id: "actions",
        header: "Chức năng",
        cell: ({ row }) => {
            const shift = row.original;
            return (
                <Button variant="outline" asChild>
                    <Link
                        to={`${ROUTER_PATH.WORKING}/${shift.workingHourId}?shift=${shift.id}`}
                    >
                        Xem chi tiết
                    </Link>
                </Button>
            );
        },
    },
];
