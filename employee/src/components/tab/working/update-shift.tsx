import DateState from "@/components/date-state";
import DeleteShiftDialog from "@/components/dialog/shift/delete";
import UpdateShiftBaseSection from "@/components/section/shfit/update/base";
import UpdateShiftEmployeeSection from "@/components/section/shfit/update/employee";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UpdateHistory from "@/components/update-history";
import { IShiftDetail } from "@/interface/api/shift.interface";

interface IUpdateWorkingShiftTabProps {
    detail: IShiftDetail;
}

export default function UpdateWorkingShiftTab({
    detail,
}: IUpdateWorkingShiftTabProps) {
    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader>
                    <div className="flex justify-between">
                        <CardTitle>Thông tin ca làm việc </CardTitle>
                        <DeleteShiftDialog shift={detail.shift} />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-2">
                        <div>
                            {detail.shift.start && detail.shift.end && (
                                <DateState
                                    start={detail.shift.start}
                                    end={detail.shift.end}
                                />
                            )}
                        </div>

                        <UpdateShiftBaseSection detail={detail} />
                        <UpdateShiftEmployeeSection detail={detail} />
                    </div>
                </CardContent>
            </Card>
            <UpdateHistory
                createdAt={detail.shift.createdAt}
                updatedAt={detail.shift.updatedAt}
                userCreate={detail.shift.userCreate}
                userUpdate={detail.shift.userUpdate}
            />
        </div>
    );
}
