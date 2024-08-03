import Failure from "@/components/failure";
import Loading from "@/components/loading";
import NoRecord from "@/components/no-record";
import WorkingHourTab from "@/components/tab/working";
import { detailWorkingHourApi } from "@/lib/redux/actions/working-hour.action";
import { workingHourSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function DetailWorkingHourScreen() {
    const dispatch = useAppDispatch();
    const { detail, isCalling, isFailure } =
        useAppSelector(workingHourSelector);
    const { id } = useParams();

    const getDetail = (id: string) => {
        dispatch(detailWorkingHourApi(id));
    };

    useEffect(() => {
        if (id) getDetail(id);
    }, [id]);

    if (isCalling) return <Loading />;

    if (!isCalling && isFailure) return <Failure type="Ngày làm việc" />;

    if (!detail) return <NoRecord type="Ngày làm việc" />;

    return <WorkingHourTab detail={detail} />;
}
