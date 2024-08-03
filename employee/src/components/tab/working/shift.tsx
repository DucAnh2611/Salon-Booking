import DateState from "@/components/date-state";
import ShiftEmployeeStatus from "@/components/shift-employee-status";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import UpdateHistory from "@/components/update-history";
import { IShiftDetail } from "@/interface/api/shift.interface";
import { api_media_url } from "@/utils/apiCall";
import { formatTimeToHHMM } from "@/utils/date.utils";

interface IWorkingShiftTabProps {
    detail: IShiftDetail;
}

export default function WorkingShiftTab({ detail }: IWorkingShiftTabProps) {
    return (
        <div className="flex flex-col gap-3">
            <Card>
                <CardHeader>
                    <CardTitle>Thông tin ca làm việc </CardTitle>
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
                        <div className="flex gap-2 items-center">
                            <p className="text-sm">Thời gian ca làm bắt đầu:</p>
                            <p className="font-semibold border px-2 rounded">
                                {formatTimeToHHMM(detail.shift.start)}
                            </p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <p className="text-sm">
                                Thời gian ca làm kết thúc:
                            </p>
                            <p className="font-semibold border px-2 rounded">
                                {formatTimeToHHMM(detail.shift.end)}
                            </p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <p className="text-sm">
                                Thời gian booking bắt đầu:
                            </p>
                            <p className="font-semibold border px-2 rounded">
                                {formatTimeToHHMM(detail.shift.bookingStart)}
                            </p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <p className="text-sm">
                                Thời gian booking kết thúc:
                            </p>
                            <p className="font-semibold border px-2 rounded">
                                {formatTimeToHHMM(detail.shift.bookingEnd)}
                            </p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <p className="text-sm">Số lượng nhân viên:</p>
                            <p className="font-semibold border px-2 rounded">
                                {detail.employees.length < 10
                                    ? `0${detail.employees.length}`
                                    : detail.employees.length}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div className="grid grid-cols-5 gap-2">
                                {detail.employees.map((e) => (
                                    <div
                                        key={e.employee.id}
                                        className="w-full h-fit box-border p-3 border rounded-md overflow-hidden flex flex-col gap-2 hover:border-primary group/emp"
                                    >
                                        <div className="w-full aspect-[4/3] rounded-md overflow-hidden relative">
                                            <img
                                                src={
                                                    api_media_url +
                                                    e.employee.userBase
                                                        .userAvatar?.path
                                                }
                                                alt="emp"
                                                className="w-full h-full object-cover group-hover/emp:scale-105 duration-150"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <div className="flex justify-start items-center gap-2">
                                                <ShiftEmployeeStatus
                                                    status={e.status}
                                                />
                                            </div>
                                            <div className="flex justify-start items-center gap-2">
                                                <Label>Tên:</Label>
                                                <p className="w-full line-clamp-1 text-sm">
                                                    {
                                                        e.employee.userBase
                                                            .lastname
                                                    }{" "}
                                                    {
                                                        e.employee.userBase
                                                            .firstname
                                                    }
                                                </p>
                                            </div>
                                            <div className="flex justify-start items-center gap-2">
                                                <Label>Chức vụ:</Label>
                                                <Badge variant="default">
                                                    {e.employee.eRole?.title}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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
