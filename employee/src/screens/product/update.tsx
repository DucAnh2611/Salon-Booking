import UpdateProductTab from "@/components/tab/update-product";
import { detailProductApi } from "@/lib/redux/actions/product.action";
import { productSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { updateProductSchema } from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { z } from "zod";

export default function UpdateProductScreen() {
    const dispath = useAppDispatch();
    const { detail } = useAppSelector(productSelector);
    const { id } = useParams();

    const getDetail = (id: string) => {
        dispath(detailProductApi(id));
    };

    const onSuccess = () => {
        if (id) {
            dispath(detailProductApi(id));
        }
    };

    const form = useForm<z.infer<typeof updateProductSchema>>({
        defaultValues: {
            base: {
                name: "",
                brand: "",
                description: "",
                price: 0,
                quantity: 0,
                sku: "",
                categoryId: "",
                thumbnailIds: [],
                thumbnailUrls: [],
            },
            details: [],
            types: {
                selectAttribute: {},
                types: [],
            },
        },
        resolver: zodResolver(updateProductSchema),
    });

    useEffect(() => {
        if (id) getDetail(id);
    }, [id]);

    if (!detail)
        return (
            <div className="flex-1 flex items-center justify-center">
                <p>Không có sản phẩm nào phù hợp</p>
            </div>
        );

    return (
        <UpdateProductTab form={form} detail={detail} onSuccess={onSuccess} />
    );
}
