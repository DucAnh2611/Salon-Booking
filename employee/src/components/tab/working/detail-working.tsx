import UpdateHistory from "@/components/update-history";
import { IWorkingHourDetail } from "@/interface/api/working-hour.interface";
import { formatTimeToHHMM } from "@/utils/date.utils";
import { format } from "date-fns";
import ShiftDataTable from "../../data-table/table/shift";
import DateState from "../../date-state";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";

interface IDetailWorkingHourTabProps {
    detail: IWorkingHourDetail;
}

export default function DetailWorkingHourTab({
    detail,
}: IDetailWorkingHourTabProps) {
    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin ngày làm việc</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <div>
                            {detail.start && detail.end && (
                                <DateState
                                    start={detail.start}
                                    end={detail.end}
                                />
                            )}
                        </div>
                        <div className="flex gap-2 items-center">
                            <p className="text-sm">Ngày làm việc:</p>
                            <p className="font-semibold border px-2 rounded">
                                {format(detail.date, "dd/MM/yyyy")}
                            </p>
                        </div>
                        {detail.start && (
                            <div className="flex gap-2 items-center">
                                <p className="text-sm">Thời gian bắt đầu:</p>
                                <p className="font-semibold border px-2 rounded">
                                    {formatTimeToHHMM(detail.start)}
                                </p>
                            </div>
                        )}
                        {detail.end && (
                            <div className="flex gap-2 items-center">
                                <p className="text-sm">Thời gian kết thúc:</p>
                                <p className="font-semibold border px-2 rounded">
                                    {formatTimeToHHMM(detail.end)}
                                </p>
                            </div>
                        )}
                        <div className="flex gap-2 items-center">
                            <p className="text-sm">Số lượng ca làm:</p>
                            <p className="font-semibold border px-2 rounded">
                                {detail.shifts.length < 10
                                    ? `0${detail.shifts.length}`
                                    : detail.shifts.length}
                            </p>
                        </div>
                        {detail.shifts.length > 0 && (
                            <div>
                                <ShiftDataTable shifts={detail.shifts} />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
            <UpdateHistory
                createdAt={detail.createdAt}
                updatedAt={detail.updatedAt}
                userCreate={detail.userCreate}
                userUpdate={detail.userUpdate}
            />
        </div>
    );
}
