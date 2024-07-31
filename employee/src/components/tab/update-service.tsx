import { IServiceDetail } from "@/interface/api/service.interface";
import { IServiceUpdateSectionProps } from "@/interface/service-section.interface";
import {
    detailServiceApi,
    updateServiceApi,
} from "@/lib/redux/actions/service.action";
import { serviceSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
    updateServiceEmployeeSchema,
    updateServiceSchema,
    updateServiceStepSchema,
} from "@/schemas/service.schemas";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import UpdateServiceBaseSection from "../section/service/update/base";
import UpdateServiceEmployeeSection from "../section/service/update/employee";
import UpdateServiceStepSection from "../section/service/update/step";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { toast } from "../ui/use-toast";

interface IUpdateServiceTabProps extends IServiceUpdateSectionProps {
    detail: IServiceDetail;
}

export default function UpdateServiceTab({
    form,
    sessionId,
    detail,
}: IUpdateServiceTabProps) {
    const dispatch = useAppDispatch();
    const { isUpdating, isFailure } = useAppSelector(serviceSelector);
    const [submit, SetSubmit] = useState<boolean>(false);

    const mapToForm = (
        detail: IServiceDetail,
        form: UseFormReturn<z.infer<typeof updateServiceSchema>>
    ) => {
        const { name, description, categoryId, price, duration, media } =
            detail.base;

        form.setValue("base.serviceId", detail.base.id);
        form.setValue("base.name", name);
        form.setValue("base.description", description);
        form.setValue("base.categoryId", categoryId);
        form.setValue("base.price", price);
        form.setValue("base.duration", duration);
        form.setValue("base.medias", media);

        const employees: Array<z.infer<typeof updateServiceEmployeeSchema>> =
            [];
        detail.employees.forEach((emp) => {
            const addEmployee: z.infer<typeof updateServiceEmployeeSchema> = {
                employeeId: emp.employeeId,
                experience: emp.experience,
            };

            employees.push(addEmployee);
        });

        form.setValue("employees", employees);

        const steps: Array<z.infer<typeof updateServiceStepSchema>> = [];
        detail.steps.forEach((stepInfo) => {
            const addStep: z.infer<typeof updateServiceStepSchema> = {
                id: stepInfo.id,
                name: stepInfo.name,
                description: stepInfo.description,
                step: stepInfo.step,
                thumbnailId: stepInfo.thumbnailId,
                thumbnailUrl: "",
            };

            steps.push(addStep);
        });
        form.setValue(
            "steps",
            steps.sort((a, b) => a.step - b.step)
        );
    };

    const handleSubmit =
        (test = false) =>
        () => {
            if (test) {
                console.log(form.getValues());
                return;
            }
            const payload = form.getValues();

            payload.base.duration = parseInt(payload.base.duration.toString());
            payload.base.price = parseInt(payload.base.price.toString());

            SetSubmit(true);
            dispatch(updateServiceApi(payload));
        };

    useMemo(() => {
        mapToForm(detail, form);
    }, [detail]);

    useEffect(() => {
        if (submit && !isUpdating && !isFailure) {
            SetSubmit(false);
            toast({
                title: "Thành công",
                description: "Sửa thông tin dịch vụ thành công",
            });
            dispatch(detailServiceApi(detail.base.id));
        }
    }, [isUpdating, isFailure]);

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit(false))}>
                    <div className="flex flex-col gap-2 relative">
                        <UpdateServiceBaseSection
                            form={form}
                            sessionId={sessionId}
                            base={detail.base}
                        />

                        <UpdateServiceEmployeeSection
                            form={form}
                            sessionId={sessionId}
                            employees={detail.employees}
                        />

                        <UpdateServiceStepSection
                            stepDetail={detail.steps}
                            form={form}
                            sessionId={sessionId}
                        />

                        <div className="sticky bottom-0 left-full w-fit flex gap-2">
                            <Button
                                type="submit"
                                className="gap-1"
                                disabled={submit}
                                onClick={handleSubmit(true)}
                            >
                                {submit && (
                                    <LoaderCircleIcon
                                        size={15}
                                        className="animate-spin"
                                    />
                                )}
                                Sửa dịch vụ
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
