import PopoverSelectParentRole from "@/components/popover/role/select-parent";
import RequireField from "@/components/require-field";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { IRole } from "@/interface/api/role.interface";
import { employeeUpdateFormSchema } from "@/schemas/employee.schema";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import PermissionEmployeeSection from "../permission";

interface IAuthEmployeeUpdateSectionProps {
    form: UseFormReturn<z.infer<typeof employeeUpdateFormSchema>>;
    role: IRole | null;
}

export default function AuthEmployeeUpdateSection({
    form,
    role,
}: IAuthEmployeeUpdateSectionProps) {
    const [showPass, SetShowPass] = useState<boolean>(false);
    const [eRole, SetERole] = useState<IRole | null>(role);

    const handleChangeERole = (role: IRole | null) => {
        form.setValue("eRoleId", role?.id || "");
        SetERole(role);
    };
    useEffect(() => {
        SetERole(role);
    }, [role]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin xác thực nhân viên</CardTitle>
                <CardDescription>
                    Thông tin về chức vụ, tài khoản mật khẩu đăng nhập.
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
                <div className="w-full flex flex-col gap-5">
                    <div className="flex-1 h-fit grid grid-cols-2 gap-1">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>
                                        Tên đăng nhập
                                        <RequireField />
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Tên đăng nhập"
                                            {...field}
                                            disabled
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="eRoleId"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>
                                        Chức vụ
                                        <RequireField />
                                    </FormLabel>
                                    <PopoverSelectParentRole
                                        onSelectParent={handleChangeERole}
                                        selected={eRole}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {eRole && <PermissionEmployeeSection eRoleId={eRole.id} />}
                </div>
            </CardContent>
        </Card>
    );
}
