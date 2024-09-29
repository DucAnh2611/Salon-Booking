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
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { addProductToCartSchema } from "@/schema/cart.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Landmark,
    Minus,
    Plus,
    ShoppingCart,
    Truck,
    Undo2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
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
    const [onStock, SetOnStock] = useState<number>(0);
    const [selected, SetSelected] = useState<IProductInfoTypes | undefined>();
    const [attributeValues, SetAttributeValues] =
        useState<TProductTypeAttribute>([]);
    const [selectAttributeValue, SetSelectAttributeValue] = useState<
        Record<number, { aId: string; vId: string }>
    >({});

    const form = useForm<z.infer<typeof addProductToCartSchema>>({
        resolver: zodResolver(addProductToCartSchema),
        defaultValues: {
            productId: product.base?.id || "",
            productTypeId: undefined,
            quantity: 1,
        },
    });

    const handleSelectAttributeValue =
        (level: number, aId: string, vId: string) => () => {
            SetSelectAttributeValue((selectAttributeValue) => ({
                ...selectAttributeValue,
                [level]: {
                    aId,
                    vId,
                },
            }));
        };

    const onChangeQuantity = (quan: number) => () => {
        const v = (form.getValues("quantity") || 1) + quan;

        form.setValue("quantity", v || 1);
    };

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

    const getProductPriceRange = () => {
        if (!product.base) return 0;
        if (!product.types.length) return formatMoney(product.base.price);

        let [min, max] = [Infinity, 0];

        const price = `${formatMoney(product.base.price)}`;

        for (const type of product.types) {
            if (type.price > max) {
                max = type.price;
            }
            if (type.price < min) {
                min = type.price;
            }
        }

        if (min === max) return `${formatMoney(min)}`;

        return `${formatMoney(min)} - ${formatMoney(max)}`;
    };

    useEffect(() => {
        if (product.types.length && selected) {
            getTypeOnStock({
                productId: product.base?.id || "",
                typeId: selected ? selected.id : undefined,
            });
        } else if (!product.types.length) {
            getTypeOnStock({
                productId: product.base?.id || "",
                typeId: undefined,
            });
        }

        form.setValue("productId", product.base?.id || "");
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

    useEffect(() => {
        if (
            attributeValues.length &&
            Object.values(selectAttributeValue).length ===
                attributeValues.length &&
            product.types
        ) {
            const listAttrValue = Object.entries(selectAttributeValue);
            let findList = product.types;

            for (const [level, value] of listAttrValue) {
                findList = findList.filter((item) => {
                    const attributeProduct = item.productTypesAttribute.find(
                        (i) =>
                            i.level === parseInt(level) &&
                            i.value.attributeId === value.aId &&
                            i.value.id === value.vId
                    );

                    return !!attributeProduct;
                });
            }
            if (findList.length === 1) {
                SetSelected(findList[0]);
            }
        }
    }, [selectAttributeValue]);

    if (!product.base) return <></>;

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onAddStock)}>
                    <p className="text-2xl font-bold text-primary">
                        {!selected
                            ? getProductPriceRange()
                            : selected && formatMoney(selected.price)}
                    </p>

                    <Separator orientation="horizontal" className="my-2" />

                    <div className="w-full space-y-3">
                        <div className="w-full grid grid-cols-7">
                            <div className="col-span-2 flex h-fit">
                                <p className="text-sm text-muted-foreground">
                                    Danh mục
                                </p>
                            </div>
                            <div className="col-span-5 flex items-start">
                                <p className="text-sm">
                                    {product.base.category.title}
                                </p>
                            </div>
                        </div>
                        {product.detail.map((detail) => (
                            <div
                                className="w-full grid grid-cols-7"
                                key={detail.id}
                            >
                                <div className="col-span-2 flex h-fit">
                                    <p className="text-sm text-muted-foreground">
                                        {detail.key}
                                    </p>
                                </div>
                                <div className="col-span-5 flex items-start">
                                    <p className="text-sm">{detail.value}</p>
                                </div>
                            </div>
                        ))}

                        {attributeValues.map((attributeValue) =>
                            Object.entries(attributeValue).map(
                                ([level, value]) => (
                                    <div
                                        key={value.attribute.id}
                                        className="w-full grid grid-cols-7"
                                    >
                                        <div className="col-span-2 flex items-center">
                                            <p className="text-sm text-muted-foreground">
                                                {value.attribute.name}
                                            </p>
                                        </div>
                                        <div className="flex flex-wrap gap-2 col-span-5">
                                            {value.values.map((v) => (
                                                <Button
                                                    key={
                                                        v.id +
                                                        value.attribute.id
                                                    }
                                                    onClick={handleSelectAttributeValue(
                                                        parseInt(level),
                                                        value.attribute.id,
                                                        v.id
                                                    )}
                                                    variant={"outline"}
                                                    type="button"
                                                    className={cn(
                                                        selectAttributeValue[
                                                            parseInt(level)
                                                        ] &&
                                                            selectAttributeValue[
                                                                parseInt(level)
                                                            ].aId ===
                                                                value.attribute
                                                                    .id &&
                                                            selectAttributeValue[
                                                                parseInt(level)
                                                            ].vId === v.id &&
                                                            "border-primary"
                                                    )}
                                                >
                                                    {v.value}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                )
                            )
                        )}

                        {((!!product.types.length && selected) ||
                            !product.types.length) && (
                            <div>
                                <div className="w-full space-y-1 grid grid-cols-7">
                                    <div className="col-span-1 flex items-center">
                                        <Label
                                            htmlFor="quantity"
                                            className="text-sm text-muted-foreground font-normal"
                                        >
                                            Số lượng
                                        </Label>
                                    </div>
                                    <div className="col-span-6">
                                        <FormField
                                            name="quantity"
                                            control={form.control}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormControl>
                                                        <div className="flex">
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="border-r-none !rounded-r-none"
                                                                type="button"
                                                                onClick={onChangeQuantity(
                                                                    -1
                                                                )}
                                                            >
                                                                <Minus
                                                                    size={15}
                                                                />
                                                            </Button>
                                                            <Input
                                                                {...field}
                                                                id="quantity"
                                                                className="focus-visible:ring-transparent rounded-l-none rounded-r-none w-[50px] px-0 text-center"
                                                            />
                                                            <Button
                                                                size="icon"
                                                                variant="outline"
                                                                className="border-l-none !rounded-l-none"
                                                                type="button"
                                                                onClick={onChangeQuantity(
                                                                    1
                                                                )}
                                                            >
                                                                <Plus
                                                                    size={15}
                                                                />
                                                            </Button>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm italic text-muted-foreground">
                                    Kho: {onStock}
                                </p>
                            </div>
                        )}
                    </div>

                    <Separator orientation="horizontal" className="my-2" />

                    <div className="space-y-3 mt-3">
                        <Button
                            type="submit"
                            variant="default"
                            disabled={!!product.types.length && !selected}
                            className="gap-2 items-center"
                        >
                            <ShoppingCart size={15} /> Thêm vào giỏ hàng
                        </Button>
                        <div className="space-y-1">
                            <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                                <Truck size={20} />
                                <span>
                                    Miễn phí vận chuyển cho toàn bộ đơn hàng.
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm font-medium  text-muted-foreground">
                                <Undo2 size={20} />
                                <span>
                                    Hoàn tiền 100% nếu sản phẩm không đúng mô tả
                                </span>
                            </div>
                            <div className="flex items-center space-x-2 text-sm font-medium  text-muted-foreground">
                                <Landmark size={20} />
                                <span>Thanh toán qua tài khoản ngân hàng.</span>
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    );
}
