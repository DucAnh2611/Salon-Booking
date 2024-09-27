import {
    IAttributeValue,
    IProductInfo,
} from "@/interface/api/product.interface";
import { IProductTabUpdateProps } from "@/interface/product-tabs.interface";
import { updateProductApi } from "@/lib/redux/actions/product.action";
import { productSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import {
    updateProductDetailSchema,
    updateProductSchema,
    updateProductTypeDetailSchema,
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
    onSuccess: () => void;
}

export default function UpdateProductTab({
    form,
    detail,
    onSuccess,
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
        const selectedAttr: IAttributeValue = {};

        detail.types.forEach((type) => {
            const {
                id,
                quantity,
                price,
                productTypesAttribute,
                sku,
                ...typeInf
            } = type;

            const mapLevel: Array<keyof IAttributeValue> = [
                "first",
                "first",
                "sec",
            ];

            const addTypes: z.infer<typeof updateProductTypeSchema> = {
                productTypeId: id,
                quantity: quantity,
                price: price,
                sku: sku || "",
                ...typeInf,
                types: productTypesAttribute.map((ta) => {
                    const addTypeAttribue: z.infer<
                        typeof updateProductTypeDetailSchema
                    > = {
                        value: {
                            attrValueId: ta.value.id,
                            level: ta.level,
                        },
                    };

                    const typeSelectAttr = mapLevel[ta.level] || mapLevel[1];

                    selectedAttr[typeSelectAttr] = {
                        attribute: ta.value.attribute,
                        value: [
                            ...(
                                selectedAttr[typeSelectAttr]?.value || []
                            ).filter((e) => e.id && e.id !== ta.value.id),
                            { id: ta.value.id, value: ta.value.value },
                        ],
                    };

                    return addTypeAttribue;
                }),
            };

            types.push(addTypes);
        });

        form.setValue("types.types", types);
        form.setValue("types.selectAttribute", selectedAttr);
    };

    const handleSubmit = () => {
        const payload = form.getValues();

        payload.base.price = parseInt(payload.base.price.toString());
        payload.base.quantity = parseInt(payload.base.quantity.toString());

        dispatch(updateProductApi(payload));
        SetSubmit(true);
    };

    useMemo(() => {
        mapDataForForm(detail, form);
    }, [detail]);

    useEffect(() => {
        if (submit && !isUpdating && !isFailure) {
            SetSubmit(false);
            onSuccess();
        }
        if (submit && !isUpdating && isFailure) {
            SetSubmit(false);
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
