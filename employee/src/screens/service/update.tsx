import UpdateServiceTab from "@/components/tab/update-service";
import { detailServiceApi } from "@/lib/redux/actions/service.action";
import { serviceSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { updateServiceSchema } from "@/schemas/service.schemas";
import { generateUUID } from "@/utils/uuid.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

export default function UpdateServiceScreen() {
    const dispatch = useAppDispatch();
    const { detail } = useAppSelector(serviceSelector);

    const { id } = useParams();

    const [sessionId] = useState<string>(generateUUID());

    const form = useForm<z.infer<typeof updateServiceSchema>>({
        defaultValues: {
            base: {
                description: "",
                name: "",
                price: 0,
                duration: 0,
                serviceId: "",
                medias: [],
                categoryId: "",
            },
            employees: [],
            steps: [],
        },
        resolver: zodResolver(updateServiceSchema),
    });

    useEffect(() => {
        if (id) dispatch(detailServiceApi(id));
    }, [id]);

    if (!detail)
        return (
            <div className="flex-1 flex items-center justify-center">
                <p>Không có dịch vụ nào phù hợp</p>
            </div>
        );

    return (
        <UpdateServiceTab form={form} sessionId={sessionId} detail={detail} />
    );
}
