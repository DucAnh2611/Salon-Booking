import AuthEmployeeUpdateSection from "@/components/section/employee/update/auth";
import BaseEmployeeUpdateSection from "@/components/section/employee/update/base";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { ROUTER_PATH } from "@/constants/router.constant";
import { EGender } from "@/enum/gender.enum";
import { IEmployeeDetail } from "@/interface/api/employee.interface";
import {
    detailEmployeeApi,
    updateEmployeeApi,
} from "@/lib/redux/actions/employee.action";
import { employeeSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { employeeUpdateFormSchema } from "@/schemas/employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { z } from "zod";

export default function UpdateEmployeeScreen() {
    const { id } = useParams();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { detail, isUpdating, isFailure } = useAppSelector(employeeSelector);

    const [submit, SetSubmit] = useState<boolean>(false);

    const handleGetDetail = (id: string) => {
        dispatch(detailEmployeeApi(id));
    };

    const toFormData = (values: z.infer<typeof employeeUpdateFormSchema>) => {
        const formdata = new FormData();

        Object.entries(values).forEach(([field, value]) => {
            if (value) {
                if (typeof value === "object") {
                    if (value instanceof Date) {
                        formdata.append(field, value.toISOString());
                    }
                    if (value instanceof File) {
                        formdata.append(field, value);
                    }
                } else if (typeof value === "string") {
                    formdata.append(field, value.trim());
                }
            }
        });

        return formdata;
    };

    const handleSubmit = () => {
        if (detail) {
            SetSubmit(true);
            dispatch(
                updateEmployeeApi(detail.id, toFormData(form.getValues()))
            );
        }
    };

    const handleCancelUpdate = () => {
        navigate(ROUTER_PATH.EMPLOYEE);
    };

    const setForm = (detail: IEmployeeDetail) => {
        form.setValue("birthday", new Date(detail.userBase.birthday));
        form.setValue("eRoleId", detail.eRoleId || "");
        form.setValue("firstname", detail.userBase.firstname);
        form.setValue("lastname", detail.userBase.lastname);
        form.setValue("gender", detail.userBase.gender);
        form.setValue("phone", detail.userBase.phone);
        form.setValue("username", detail.username);
        form.setValue("avatar", detail.userBase.avatar || "");
    };

    const form = useForm<z.infer<typeof employeeUpdateFormSchema>>({
        defaultValues: {
            birthday: new Date(),
            eRoleId: "",
            firstname: "",
            gender: EGender.OTHER,
            lastname: "",
            phone: "",
            image: undefined,
            avatar: "",
            username: "",
        },
        resolver: zodResolver(employeeUpdateFormSchema),
    });

    useEffect(() => {
        if (id) {
            handleGetDetail(id);
        }
    }, [id]);

    useEffect(() => {
        if (detail) {
            setForm(detail);
        }
    }, [detail]);

    useEffect(() => {
        if (submit && !isUpdating && !isFailure) {
            SetSubmit(false);
            toast({
                title: "Thành công",
                description: "Cập nhật nhân viên thành công.",
            });
        }
    }, [isUpdating, isFailure, submit]);

    if (!detail) {
        return (
            <div className="w-full h-full border-dashed rounded-md flex items-center justify-center">
                <p>Không tìm thấy nhân viên yêu cầu.</p>
            </div>
        );
    }

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex flex-col gap-5 relative"
                >
                    <BaseEmployeeUpdateSection
                        form={form}
                        userAvatar={detail.userBase.userAvatar?.path || null}
                        employee={detail}
                    />

                    <AuthEmployeeUpdateSection
                        form={form}
                        role={detail.eRole}
                    />

                    <div className="flex justify-end gap-2 sticky bottom-0 right-0 w-full z-10">
                        <Button
                            type="button"
                            variant="outline"
                            disabled={submit && isUpdating}
                            onClick={handleCancelUpdate}
                        >
                            Hủy
                        </Button>
                        <Button
                            type="submit"
                            disabled={submit && isUpdating}
                            className="gap-1"
                        >
                            {submit && isUpdating && (
                                <LoaderCircleIcon
                                    size={15}
                                    className="animate-spin"
                                />
                            )}
                            Sửa nhân viên
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
