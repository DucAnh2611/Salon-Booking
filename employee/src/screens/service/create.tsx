import CreateServiceBaseSection from "@/components/section/service/create/base";
import CreateServiceEmployeeSection from "@/components/section/service/create/employee";
import CreateServiceStepSection from "@/components/section/service/create/step";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { createServiceApi } from "@/lib/redux/actions/service.action";
import { serviceSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { createServiceSchema } from "@/schemas/service.schemas";
import { generateUUID } from "@/utils/uuid.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CreateServiceScreen() {
    const dispatch = useAppDispatch();

    const { isCreating, isFailure } = useAppSelector(serviceSelector);

    const [sessionId] = useState<string>(generateUUID());
    const [submit, SetSubmit] = useState<boolean>(false);

    const handleSubmit = () => {
        const payload = form.getValues();

        payload.base.price = parseInt(payload.base.price.toString());
        payload.base.duration = parseInt(payload.base.duration.toString());

        console.log(payload);

        SetSubmit(true);
        dispatch(createServiceApi(payload));
    };

    const form = useForm<z.infer<typeof createServiceSchema>>({
        defaultValues: {
            base: {
                name: "",
                description: "",
                duration: 0,
                price: 0,
                medias: [],
            },
            employees: [],
            steps: [],
        },
        resolver: zodResolver(createServiceSchema),
    });

    useEffect(() => {
        if (submit && !isCreating && !isFailure) {
            SetSubmit(false);
            toast({
                title: "Thành công",
                description: "Tạo mới dịch vụ thành công",
            });
            window.location.reload();
        }
    }, [submit, isCreating, isFailure]);

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="w-full flex flex-col gap-3 relative">
                        <CreateServiceBaseSection
                            form={form}
                            sessionId={sessionId}
                        />
                        <CreateServiceEmployeeSection
                            form={form}
                            sessionId={sessionId}
                        />
                        <CreateServiceStepSection
                            form={form}
                            sessionId={sessionId}
                        />
                        <div className="w-fit sticky bottom-0 left-full flex gap-2">
                            <Button>Tạo dịch vụ</Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
