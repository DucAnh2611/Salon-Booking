import CreateProductBaseSection from "@/components/section/product/create/product-base-create";
import CreateProductDetailSection from "@/components/section/product/create/product-detail-create";
import CreateProductTypeSection from "@/components/section/product/create/product-type-create";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { createProductApi } from "@/lib/redux/actions/product.action";
import { productSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { createProductSchema } from "@/schemas/product.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidV4 } from "uuid";
import { z } from "zod";

export default function CreateProductScreen() {
    const dispatch = useAppDispatch();
    const { isCreating, isFailure } = useAppSelector(productSelector);
    const [sessionId] = useState<string>(uuidV4());
    const [submit, SetSubmit] = useState<boolean>(false);

    const handleSubmit = async () => {
        const payload = form.getValues();

        payload.base.price = parseInt(payload.base.price.toString());
        payload.base.quantity = parseInt(payload.base.quantity.toString());

        dispatch(createProductApi(payload));
        SetSubmit(true);
    };

    const reset = () => {
        form.reset();
        SetSubmit(false);
    };

    const form = useForm<z.infer<typeof createProductSchema>>({
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
            types: [],
        },
        resolver: zodResolver(createProductSchema),
    });

    useEffect(() => {
        if (submit && !isFailure && !isCreating) {
            toast({
                title: "Thành công!",
                description: "Tạo sản phẩm mới thành cồng!",
            });

            window.location.reload();
        }
    }, [isCreating, isFailure]);

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-2">
                        <CreateProductBaseSection
                            form={form}
                            sessionId={sessionId}
                        />
                        <CreateProductDetailSection
                            form={form}
                            sessionId={sessionId}
                        />
                        <CreateProductTypeSection
                            form={form}
                            sessionId={sessionId}
                        />

                        <div className="sticky bottom-0 right-0 w-full h-fit flex justify-end gap-2">
                            <Button
                                type="submit"
                                className="gap-1"
                                disabled={submit}
                            >
                                {submit && (
                                    <LoaderCircleIcon
                                        size={15}
                                        className="animation-spin"
                                    />
                                )}
                                Tạo sản phẩm
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
