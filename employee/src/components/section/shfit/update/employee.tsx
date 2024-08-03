import DialogAssignEmployeeShift from "@/components/dialog/shift/assign-employee";
import DialogReassignEmployeeShift from "@/components/dialog/shift/reassign-employee";
import PopoverSelectMutipleEmployee from "@/components/popover/employee/select-mutiple";
import ShiftEmployeeStatus from "@/components/shift-employee-status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { EShiftEmployeeStatus } from "@/enum/shift.enum";
import { IEmployee, IEmployeeShift } from "@/interface/api/employee.interface";
import { IShiftDetail } from "@/interface/api/shift.interface";
import {
    assignmentAddApi,
    assignmentRemoveApi,
} from "@/lib/redux/actions/shift.action";
import { useAppDispatch } from "@/lib/redux/store";
import { api_media_url } from "@/utils/apiCall";
import { useEffect, useState } from "react";

interface IUpdateShiftEmployeeSectionProps {
    detail: IShiftDetail;
}

export default function UpdateShiftEmployeeSection({
    detail,
}: IUpdateShiftEmployeeSectionProps) {
    const dispatch = useAppDispatch();

    const [employees, SetEmployees] = useState<IEmployeeShift[]>([]);
    const [selectedEmployee, SetSelectedEmployee] = useState<IEmployee[]>([]);
    const [newEmployee, SetNewEmployee] = useState<IEmployee | null>(null);
    const [deleteEmployee, SetDeleteEmployee] = useState<IEmployee | null>(
        null
    );

    const setEmployee = (detail: IShiftDetail) => {
        SetSelectedEmployee(
            detail.employees.map((emp) => {
                return emp.employee;
            })
        );
        SetEmployees(
            detail.employees.map((emp) => {
                return emp;
            })
        );
    };

    const onCancelAdd = () => {
        SetNewEmployee(null);
        SetSelectedEmployee(
            detail.employees.map((emp) => {
                return emp.employee;
            })
        );
    };

    const onCancelDelete = () => {
        SetDeleteEmployee(null);
        SetSelectedEmployee(
            detail.employees.map((emp) => {
                return emp.employee;
            })
        );
    };

    const onDeleteEmployee = (employee: IEmployee) => {
        dispatch(
            assignmentRemoveApi({
                employeeIds: [employee.id],
                shiftId: detail.shift.id,
            })
        );
    };

    const onAddEmployee = (employee: IEmployee) => {
        dispatch(
            assignmentAddApi({
                shiftId: detail.shift.id,
                assignments: [
                    {
                        employeeId: employee.id,
                        status: EShiftEmployeeStatus.AVAILABLE,
                    },
                ],
            })
        );
    };

    const onSelectEmployee = (employee: IEmployee) => {
        if (!employees.find((emp) => emp.employeeId === employee.id)) {
            SetNewEmployee(employee);
        } else {
            SetDeleteEmployee(employee);
        }
    };

    useEffect(() => {
        setEmployee(detail);
    }, [detail]);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
                <p className="text-sm">Số lượng nhân viên:</p>
                <p className="font-semibold border px-2 rounded">
                    {detail.employees.length < 10
                        ? `0${detail.employees.length}`
                        : detail.employees.length}
                </p>
            </div>
            <div className="w-fit">
                <PopoverSelectMutipleEmployee
                    onSelect={onSelectEmployee}
                    selects={selectedEmployee}
                />
            </div>
            <div className="flex flex-col">
                <div className="grid grid-cols-5 gap-2">
                    {employees.map((e) => (
                        <div
                            key={e.employee.id}
                            className="w-full h-fit box-border p-3 border rounded-md overflow-hidden flex flex-col gap-2 hover:border-primary group/emp"
                        >
                            <div className="w-full aspect-[4/3] rounded-md overflow-hidden relative">
                                <div className="absolute right-2 top-2 hidden group-hover/emp:block z-10">
                                    <Button
                                        variant="destructive"
                                        onClick={() =>
                                            onSelectEmployee(e.employee)
                                        }
                                    >
                                        Loại bỏ
                                    </Button>
                                </div>
                                <img
                                    src={
                                        api_media_url +
                                        e.employee.userBase.userAvatar?.path
                                    }
                                    alt="emp"
                                    className="w-full h-full object-cover group-hover/emp:scale-105 duration-150"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex justify-start items-center gap-2">
                                    <ShiftEmployeeStatus status={e.status} />
                                </div>
                                <div className="flex justify-start items-center gap-2">
                                    <Label>Tên:</Label>
                                    <p className="w-full line-clamp-1 text-sm">
                                        {e.employee.userBase.lastname}{" "}
                                        {e.employee.userBase.firstname}
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
            <DialogAssignEmployeeShift
                SetOpen={onCancelAdd}
                employee={newEmployee}
                onAdd={onAddEmployee}
            />
            <DialogReassignEmployeeShift
                SetOpen={onCancelDelete}
                employee={deleteEmployee}
                onRemove={onDeleteEmployee}
            />
        </div>
    );
}
