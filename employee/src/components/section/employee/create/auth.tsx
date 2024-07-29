import PopoverSelectParentRole from "@/components/popover/role/select-parent";
import RequireField from "@/components/require-field";
import { Button } from "@/components/ui/button";
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
import { employeeFormSchema } from "@/schemas/employee.schema";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import PermissionEmployeeSection from "../permission";

interface IAuthEmployeeCreateSectionProps {
    form: UseFormReturn<z.infer<typeof employeeFormSchema>>;
}

export default function AuthEmployeeCreateSection({
    form,
}: IAuthEmployeeCreateSectionProps) {
    const [showPass, SetShowPass] = useState<boolean>(false);
    const [eRole, SetERole] = useState<IRole | null>(null);

    const toggleShowPassword = () => {
        SetShowPass(!showPass);
    };

    const handleChangeERole = (role: IRole | null) => {
        form.setValue("eRoleId", role?.id || "");
        SetERole(role);
    };

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
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="flex-1">
                                    <FormLabel>
                                        Mật khẩu
                                        <RequireField />
                                    </FormLabel>
                                    <FormControl>
                                        <div className="relative w-full ">
                                            <Input
                                                placeholder="Mật khẩu"
                                                type={
                                                    showPass
                                                        ? "text"
                                                        : "password"
                                                }
                                                {...field}
                                            />

                                            <Button
                                                className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 box-content p-1 flex items-center justify-center text-for"
                                                onClick={toggleShowPassword}
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                            >
                                                {showPass ? (
                                                    <EyeOffIcon size={15} />
                                                ) : (
                                                    <EyeIcon size={15} />
                                                )}
                                            </Button>
                                        </div>
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
