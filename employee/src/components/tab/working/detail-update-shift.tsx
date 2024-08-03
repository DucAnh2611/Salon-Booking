import Failure from "@/components/failure";
import Loading from "@/components/loading";
import NoRecord from "@/components/no-record";
import { detailShiftApi } from "@/lib/redux/actions/shift.action";
import { shiftSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useEffect } from "react";
import UpdateWorkingShiftTab from "./update-shift";

interface IDetailUpdateWorkingHourShiftTabProps {
    id: string;
}

export default function DetailUpdateWorkingHourShiftTab({
    id,
}: IDetailUpdateWorkingHourShiftTabProps) {
    const dispatch = useAppDispatch();
    const { detail, isCalling, isFailure, isUpdating } =
        useAppSelector(shiftSelector);

    const handleReload = (id: string) => {
        dispatch(detailShiftApi(id));
    };

    useEffect(() => {
        handleReload(id);
    }, [id]);

    useEffect(() => {
        if (!isFailure && !isUpdating) {
            handleReload(id);
        }
    }, [isUpdating, isFailure]);

    if (isCalling) return <Loading />;
    if (isFailure && !detail) return <Failure type="Ca làm việc" />;
    if (!detail) return <NoRecord type="Ca làm việc" />;

    return <UpdateWorkingShiftTab detail={detail} />;
}
