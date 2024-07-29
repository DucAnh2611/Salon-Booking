import { IProductInfo } from "@/interface/api/product.interface";
import { IProductTabUpdateProps } from "@/interface/product-tabs.interface";
import { updateProductApi } from "@/lib/redux/actions/product.action";
import { productSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
    productTypeDetailSchema,
    updateProductDetailSchema,
    updateProductSchema,
    updateProductTypeSchema,
} from "@/schemas/product.schema";
import { generateUUID } from "@/utils/uuid.utils";
import { LoaderCircleIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import UpdateProductBaseTab from "../section/product/update/base";
import UpdateProductDetailTab from "../section/product/update/details";
import UpdateProductTypeTab from "../section/product/update/types";
import { Button } from "../ui/button";
import { Form } from "../ui/form";

interface IUpdateProductTabProps {
    detail: IProductInfo;
}

export default function UpdateProductTab({
    form,
    detail,
}: Omit<IProductTabUpdateProps, "sessionId"> & IUpdateProductTabProps) {
    const dispatch = useAppDispatch();
    const { isUpdating, isFailure } = useAppSelector(productSelector);

    const [sessionId] = useState<string>(generateUUID());
    const [submit, SetSubmit] = useState<boolean>(false);

    const mapDataForForm = (
        detail: IProductInfo,
        form: UseFormReturn<z.infer<typeof updateProductSchema>>
    ) => {
        form.setValue("productId", detail.base.id);

        const { name, description, categoryId, price, quantity, sku, brand } =
            detail.base;

        form.setValue("base.name", name);
        form.setValue("base.description", description);
        form.setValue("base.categoryId", categoryId);
        form.setValue("base.price", price);
        form.setValue("base.quantity", quantity);
        form.setValue("base.sku", sku || "");
        form.setValue("base.brand", brand);

        const details: Array<z.infer<typeof updateProductDetailSchema>> = [];
        detail.details.forEach((d) => {
            const addDetails: z.infer<typeof updateProductDetailSchema> = {
                key: d.key,
                value: d.value,
            };

            if (d.id) {
                addDetails.id = d.id;
            }

            details.push(addDetails);
        });

        form.setValue("details", details);

        const types: Array<z.infer<typeof updateProductTypeSchema>> = [];
        detail.types.forEach((type) => {
            const addTypes: z.infer<typeof updateProductTypeSchema> = {
                productTypeId: type.id,
                quantity: type.quantity,
                price: type.price,
                sku: type.sku || "",
                types: type.productTypesAttribute.map((ta) => {
                    const addTypeAttribue: z.infer<
                        typeof productTypeDetailSchema
                    > = {
                        attrId: ta.attributeId,
                        attrName: ta.attribute.name,
                        value: ta.value,
                        level: ta.level,
                    };
                    return addTypeAttribue;
                }),
            };

            types.push(addTypes);
        });
        form.setValue("types", types);
    };

    const handleSubmit = () => {
        const payload = form.getValues();

        payload.base.price = parseInt(payload.base.price.toString());
        payload.base.quantity = parseInt(payload.base.quantity.toString());

        dispatch(updateProductApi(payload));
        SetSubmit(true);
    };

    const testSubmit = () => {
        console.log(form.getValues("types"));
    };

    useMemo(() => {
        mapDataForForm(detail, form);
    }, [detail]);

    useEffect(() => {
        if (submit && !isUpdating && !isFailure) {
            SetSubmit(false);
            window.location.reload();
        }
    }, [isUpdating, isFailure]);

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-2 relative">
                        <UpdateProductBaseTab
                            form={form}
                            base={detail.base}
                            sessionId={sessionId}
                        />

                        <UpdateProductDetailTab
                            form={form}
                            details={detail.details}
                            sessionId={sessionId}
                        />

                        <UpdateProductTypeTab
                            form={form}
                            types={detail.types}
                            sessionId={sessionId}
                        />

                        <div className="sticky bottom-0 left-full w-fit flex gap-2">
                            <Button
                                type="submit"
                                className="gap-1"
                                disabled={submit}
                                onClick={testSubmit}
                            >
                                {submit && (
                                    <LoaderCircleIcon
                                        size={15}
                                        className="animate-spin"
                                    />
                                )}
                                Sửa sản phẩm
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
