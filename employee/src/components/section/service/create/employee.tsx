import MediaLoader from "@/components/media-load";
import PopoverSelectEmployeeExp from "@/components/popover/employee/select-exp";
import PopoverSelectMutipleEmployee from "@/components/popover/employee/select-mutiple";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { EServiceEmployeeExperience } from "@/enum/service.enum";
import { IEmployee } from "@/interface/api/employee.interface";
import { IServiceEmployeeCreate } from "@/interface/api/service.interface";
import { IServiceCreateSectionProps } from "@/interface/service-section.interface";
import { useMemo, useState } from "react";

interface ICreateServiceEmployeeSection extends IServiceCreateSectionProps {}

export default function CreateServiceEmployeeSection({
    form,
    sessionId,
}: ICreateServiceEmployeeSection) {
    const [selectedEmployee, SetSelectedEmployee] = useState<IEmployee[]>([]);
    const [employeeService, SetEmployeeService] = useState<
        IServiceEmployeeCreate[]
    >([]);

    const setNewFormValue = (employeeService: IServiceEmployeeCreate[]) => {
        form.setValue(
            "employees",
            employeeService.map((e) => ({
                employeeId: e.employee.id,
                experience: e.experience,
            }))
        );
    };

    const onSelectEmployee = (selected: IEmployee) => {
        if (selectedEmployee.some((s) => s.id === selected.id)) {
            SetSelectedEmployee((s) => s.filter((e) => e.id !== selected.id));
            SetEmployeeService((s) =>
                s.filter((e) => e.employee.id !== selected.id)
            );
        } else {
            SetSelectedEmployee((s) => [...s, selected]);
            SetEmployeeService((s) => [
                ...s,
                {
                    employee: selected,
                    experience: EServiceEmployeeExperience.BEGINNER,
                },
            ]);
        }
    };

    const onRemoveEmployee = (employee: IEmployee) => () => {
        onSelectEmployee(employee);
        SetSelectedEmployee((list) =>
            list.filter((item) => item.id !== employee.id)
        );

        SetEmployeeService((list) =>
            list.filter((item) => item.employee.id !== employee.id)
        );
    };

    const onSelectEmployeeExmp =
        (employee: IEmployee) => (exp: EServiceEmployeeExperience) => {
            SetEmployeeService((employeeService) => {
                const index = employeeService.findIndex(
                    (e) => e.employee.id === employee.id
                );
                if (index !== -1) {
                    employeeService[index] = {
                        employee,
                        experience: exp,
                    };
                }
                setNewFormValue(employeeService);
                return employeeService;
            });
        };

    useMemo(() => {
        setNewFormValue(employeeService);
    }, [employeeService.length]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Nhân viên phục vụ</CardTitle>
                <CardDescription>
                    Các nhân viên phục vụ của dịch vụ sẽ được hiển thị cho người
                    dùng.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="w-full h-fit max-h-[400px] overflow-y-auto whitespace-nowrap rounded-md border box-border p-3 flex flex-col gap-2">
                    <div>
                        <PopoverSelectMutipleEmployee
                            selects={selectedEmployee}
                            onSelect={onSelectEmployee}
                        />
                    </div>
                    <div className="w-full grid grid-cols-5 gap-3">
                        {employeeService.map((e) => (
                            <div
                                key={e.employee.id}
                                className="w-full h-fit box-border p-3 border rounded-md overflow-hidden flex flex-col gap-2 hover:border-primary group/emp"
                            >
                                <div className="w-full aspect-[4/3] rounded-md overflow-hidden relative">
                                    <div className="absolute right-2 top-2 group-hover/emp:block hidden z-10">
                                        <Button
                                            variant="destructive"
                                            type="button"
                                            size="sm"
                                            onClick={onRemoveEmployee(
                                                e.employee
                                            )}
                                        >
                                            Loại bỏ
                                        </Button>
                                    </div>
                                    <div className="w-full h-full object-cover group-hover/emp:scale-105 duration-150">
                                        <MediaLoader
                                            media={
                                                e.employee.userBase.userAvatar
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
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
                                    <div className="flex justify-start items-center gap-2">
                                        <Label>Kinh nghiệm:</Label>
                                        <PopoverSelectEmployeeExp
                                            select={e.experience}
                                            onSelect={onSelectEmployeeExmp(
                                                e.employee
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
