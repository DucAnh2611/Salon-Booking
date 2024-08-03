import Failure from "@/components/failure";
import Loading from "@/components/loading";
import NoRecord from "@/components/no-record";
import UpdateWorkingHourTab from "@/components/tab/working/update";
import { detailWorkingHourApi } from "@/lib/redux/actions/working-hour.action";
import { shiftSelector, workingHourSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function UpdateWorkingHourScreen() {
    const dispatch = useAppDispatch();
    const { isCalling, isFailure, detail } =
        useAppSelector(workingHourSelector);

    const {
        isFailure: isFailureShift,
        isUpdating: isUpdatingShift,
        isCreating: isCreatingShift,
        isDeleting: isDeletingShift,
    } = useAppSelector(shiftSelector);

    const { id } = useParams();

    const getDetail = (id: string) => {
        dispatch(detailWorkingHourApi(id));
    };

    useEffect(() => {
        if (id) getDetail(id);
    }, [id]);

    useEffect(() => {
        if (
            id &&
            !isFailureShift &&
            !isDeletingShift &&
            !isUpdatingShift &&
            !isCreatingShift
        )
            getDetail(id);
    }, [isCreatingShift, isFailureShift, isDeletingShift, isUpdatingShift]);

    if (isCalling) return <Loading />;
    if (isFailure) return <Failure type="Chi tiết giờ làm" />;
    if (!detail) return <NoRecord type="Chi tiết giờ làm" />;

    return <UpdateWorkingHourTab detail={detail} />;
}
