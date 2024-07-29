import AuthEmployeeCreateSection from "@/components/section/employee/create/auth";
import BaseEmployeeCreateSection from "@/components/section/employee/create/base";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { EGender } from "@/enum/gender.enum";
import { createEmployeeApi } from "@/lib/redux/actions/employee.action";
import { employeeSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { employeeFormSchema } from "@/schemas/employee.schema";
import { DateFromNow } from "@/utils/date.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateEmployeeScreen() {
    const dispatch = useAppDispatch();
    const { isCreating, isFailure } = useAppSelector(employeeSelector);

    const [submit, SetSubmit] = useState<boolean>(false);

    const toFormData = (values: z.infer<typeof employeeFormSchema>) => {
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
        SetSubmit(true);
        dispatch(createEmployeeApi(toFormData(form.getValues())));
    };

    const form = useForm<z.infer<typeof employeeFormSchema>>({
        defaultValues: {
            birthday: DateFromNow(0),
            eRoleId: "",
            firstname: "",
            gender: EGender.OTHER,
            lastname: "",
            password: "",
            phone: "",
            image: undefined,
            username: "",
        },
        resolver: zodResolver(employeeFormSchema),
    });

    useEffect(() => {
        if (submit && !isCreating && !isFailure) {
            form.reset();
            toast({
                title: "Thành công",
                description: "Tạo mới nhân viên thành công.",
            });
        }
    }, [isCreating, isFailure, submit]);

    return (
        <div>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="w-full flex flex-col gap-5 relative"
                >
                    <BaseEmployeeCreateSection form={form} />

                    <AuthEmployeeCreateSection form={form} />

                    <div className="flex justify-end gap-2 sticky bottom-0 right-0 w-full z-10">
                        <Button
                            type="submit"
                            disabled={submit && isCreating}
                            className="gap-1"
                        >
                            {submit && isCreating && (
                                <LoaderCircleIcon
                                    size={15}
                                    className="animate-spin"
                                />
                            )}
                            Tạo nhân viên
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
