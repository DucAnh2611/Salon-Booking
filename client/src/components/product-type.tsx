"use client";

import { IAttribute, IAttributeValue } from "@/interface/attribute.interface";
import { IApiAddProductCart } from "@/interface/cart.interface";
import {
    IApiProductOnStock,
    IProductInfo,
    IProductInfoTypes,
} from "@/interface/product.interface";
import { addProductCart } from "@/lib/actions/cart.action";
import { productOnStock } from "@/lib/actions/product.action";
import { addProductToCartSchema } from "@/schema/cart.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { toast } from "./ui/use-toast";

type TProductTypeAttributeValue = {
    attribute: IAttribute;
    values: IAttributeValue[];
};

type TProductTypeAttribute = Array<Record<number, TProductTypeAttributeValue>>;

interface IProductTypeSelectProps {
    product: IProductInfo;
}

export default function ProductTypeSelect({
    product,
}: IProductTypeSelectProps) {
    const search = useSearchParams();
    let typeId = search.get("type");

    const [onStock, SetOnStock] = useState<number>(0);
    const [selected, SetSelected] = useState<IProductInfoTypes | undefined>();
    const [attributeValues, SetAttributeValues] =
        useState<TProductTypeAttribute>([]);

    const form = useForm<z.infer<typeof addProductToCartSchema>>({
        resolver: zodResolver(addProductToCartSchema),
        defaultValues: {
            productId: product.base.id,
            productTypeId: undefined,
            quantity: 1,
        },
    });

    const getTypeOnStock = async (body: IApiProductOnStock) => {
        const onStockType = await productOnStock(body);

        if (onStockType.response?.result) {
            SetOnStock(onStockType.response?.result.quantity);
        }
    };

    const onAddStock = async () => {
        const body: IApiAddProductCart = {
            productId: form.getValues("productId"),
            ...(form.getValues("productTypeId")
                ? { productTypeId: form.getValues("productTypeId") }
                : {}),
            quantity: form.getValues("quantity"),
        };

        const { error } = await addProductCart(body);
        let toastContent: object = {
            title: "Thêm thành công",
            description: `Đã thêm sản phẩm vào giỏ hàng`,
        };

        if (error) {
            toastContent = {
                title: "Thêm không thành công",
                description: error.message,
                variant: "destructive",
            };
        }

        toast(toastContent);
    };

    useEffect(() => {
        let selectedId = typeId;
        const firstType = product.types.at(0);

        if (!selectedId && firstType) {
            if (firstType) selectedId = firstType.id;
        }

        if (selectedId && product.types.length) {
            SetSelected(
                product.types.find((type) => type.id === selectedId) ||
                    firstType
            );
        }
    }, [typeId]);

    useEffect(() => {
        getTypeOnStock({
            productId: product.base.id,
            typeId: selected ? selected.id : undefined,
        });

        form.setValue("productId", product.base.id);
        form.setValue("productTypeId", selected ? selected.id : undefined);
    }, [selected]);

    useEffect(() => {
        SetAttributeValues((atv) => {
            let newAtv = [...atv];

            product.types.forEach((type) => {
                type.productTypesAttribute.forEach((attrValue) => {
                    let filterLevel = newAtv.findIndex((a) =>
                        Object.keys(a).includes(attrValue.level.toString())
                    );

                    if (filterLevel === -1) {
                        newAtv.push({
                            [attrValue.level]: {
                                attribute: attrValue.value.attribute,
                                values: [attrValue.value],
                            },
                        });
                    } else if (
                        !newAtv[filterLevel][attrValue.level].values.find(
                            (value) => value.id === attrValue.value.id
                        )
                    ) {
                        newAtv[filterLevel][attrValue.level].values.push(
                            attrValue.value
                        );
                    }
                });
            });
            return newAtv;
        });
    }, [product.types]);

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onAddStock)}>
                    <div>
                        <div>
                            {product.types.map((type) => (
                                <div key={type.id}>
                                    <p>{type.id}</p>
                                    <Button
                                        type="button"
                                        variant={
                                            selected?.id === type.id
                                                ? "default"
                                                : "outline"
                                        }
                                        asChild={
                                            !(
                                                type.id === selected?.id &&
                                                !onStock &&
                                                !type.quantity
                                            )
                                        }
                                        disabled={
                                            type.id === selected?.id &&
                                            !onStock &&
                                            !type.quantity
                                        }
                                    >
                                        {
                                            <Link
                                                href={`${product.base.id}?type=${type.id}`}
                                            >
                                                {selected?.id === type.id
                                                    ? "selected"
                                                    : "select"}
                                            </Link>
                                        }
                                    </Button>
                                </div>
                            ))}
                            <p>Stock: {onStock}</p>
                        </div>

                        <FormField
                            name="quantity"
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit">Thêm vào giỏ hàng</Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
