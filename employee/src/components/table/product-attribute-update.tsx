import {
    IAttribute,
    IAttributeProduct,
} from "@/interface/api/attribute.interface";
import {
    IProductType,
    IProductTypeUpdate,
} from "@/interface/api/product.interface";
import { ChangeEvent, useMemo, useState } from "react";
import RequireField from "../require-field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ITableProductAttributeUpdateProps {
    attributeProduct: IAttributeProduct;
    productTypes: IProductTypeUpdate[];
    onChange: (type: IProductTypeUpdate[]) => void;
}

export default function TableProductAttributeUpdate({
    attributeProduct,
    productTypes,
    onChange,
}: ITableProductAttributeUpdateProps) {
    const [types, SetTypes] = useState<IProductTypeUpdate[]>(productTypes);

    const handleOnChange =
        (
            attrIds: Array<{
                attr: IAttribute | null;
                value: string;
                level: number;
            }>,
            key: keyof Omit<IProductType, "types">
        ) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            const index = types.findIndex((t) => {
                if (attrIds.length === 1) {
                    if (
                        t.types[0].level === attrIds[0].level &&
                        attrIds[0].attr &&
                        t.types[0].attrId === attrIds[0].attr.id &&
                        t.types[0].value === attrIds[0].value &&
                        t.types.length === 1
                    ) {
                        return true;
                    }
                } else if (attrIds.length === 2) {
                    if (
                        t.types[0].level === attrIds[0].level &&
                        attrIds[0].attr &&
                        t.types[0].attrId === attrIds[0].attr.id &&
                        t.types[0].value === attrIds[0].value &&
                        t.types[1].level === attrIds[1].level &&
                        attrIds[1].attr &&
                        t.types[1].attrId === attrIds[1].attr.id &&
                        t.types[1].value === attrIds[1].value &&
                        t.types.length === 2
                    ) {
                        return true;
                    }
                }

                return false;
            });

            if (index !== -1) {
                const listType = types;
                const typeOfValue = typeof listType[index][key];
                let value: any = e.target.value;

                if (typeOfValue === "number") {
                    value = parseInt(value) || 0;
                } else if (typeOfValue === "string") {
                    value = value || "";
                }

                listType[index] = {
                    ...types[index],
                    [key]: value,
                };

                onChange(listType);
            }
        };

    const getValue = (
        attrIds: Array<{
            attr: IAttribute | null;
            value: string;
            level: number;
        }>,
        key: keyof Omit<IProductType, "types">
    ) => {
        const index = types.findIndex((t) => {
            if (attrIds.length === 1) {
                if (
                    t.types.length === 1 &&
                    t.types[0].level === attrIds[0].level &&
                    attrIds[0].attr &&
                    t.types[0].attrId === attrIds[0].attr.id &&
                    t.types[0].value === attrIds[0].value
                ) {
                    return true;
                }
            } else if (attrIds.length === 2) {
                if (
                    t.types.length === 2 &&
                    t.types[0].level === attrIds[0].level &&
                    attrIds[0].attr &&
                    t.types[0].attrId === attrIds[0].attr.id &&
                    t.types[0].value === attrIds[0].value &&
                    t.types[1].level === attrIds[1].level &&
                    attrIds[1].attr &&
                    t.types[1].attrId === attrIds[1].attr.id &&
                    t.types[1].value === attrIds[1].value
                ) {
                    return true;
                }
            }

            return false;
        });

        if (index !== -1) {
            return types[index][key];
        }
        return "";
    };

    useMemo(() => {
        SetTypes(productTypes);
    }, [productTypes]);

    return (
        <div className="w-full mt-5">
            {attributeProduct.first.attribute && (
                <div>
                    <div className="flex">
                        <div className="border w-[150px] p-2 flex items-center justify-center">
                            <Label className="text-center w-full">
                                {attributeProduct.first.attribute.name}
                            </Label>
                        </div>
                        {attributeProduct.second.attribute && (
                            <div className="border w-[150px] p-2 flex items-center justify-center">
                                <Label className="text-center w-full">
                                    {attributeProduct.second.attribute.name}
                                </Label>
                            </div>
                        )}
                        <div className="border flex-1 box-border p-2">
                            <Label>
                                Giá
                                <RequireField />
                            </Label>
                        </div>
                        <div className="border flex-1 box-border p-2">
                            <Label>
                                Số lượng
                                <RequireField />
                            </Label>
                        </div>
                        <div className="border flex-1 box-border p-2">
                            <Label>SKU</Label>
                        </div>
                    </div>
                    <div>
                        {attributeProduct.first.values.map((fValue) => (
                            <div className="flex w-full" key={fValue.id}>
                                <div className="border flex items-center justify-center w-[150px] box-border px-3">
                                    <p className="text-sm">{fValue.value}</p>
                                </div>

                                {attributeProduct.second.attribute ? (
                                    <div className="flex-1">
                                        {attributeProduct.second.values.map(
                                            (sValue) => (
                                                <div
                                                    className="flex"
                                                    key={sValue.id}
                                                >
                                                    <div className="border flex items-center justify-center w-[150px] box-border px-3">
                                                        <p className="text-sm">
                                                            {sValue.value}
                                                        </p>
                                                    </div>

                                                    <div className="grid grid-cols-3 flex-1">
                                                        <div className="flex w-full">
                                                            <Input
                                                                className="rounded-none w-full"
                                                                placeholder="Giá"
                                                                type="number"
                                                                defaultValue={parseInt(
                                                                    getValue(
                                                                        [
                                                                            {
                                                                                attr: attributeProduct
                                                                                    .first
                                                                                    .attribute,
                                                                                value: fValue.value,
                                                                                level: 1,
                                                                            },
                                                                            {
                                                                                attr: attributeProduct
                                                                                    .second
                                                                                    .attribute,
                                                                                value: sValue.value,
                                                                                level: 2,
                                                                            },
                                                                        ],
                                                                        "price"
                                                                    )?.toString() ||
                                                                        "0"
                                                                )}
                                                                onChange={handleOnChange(
                                                                    [
                                                                        {
                                                                            attr: attributeProduct
                                                                                .first
                                                                                .attribute,
                                                                            value: fValue.value,
                                                                            level: 1,
                                                                        },
                                                                        {
                                                                            attr: attributeProduct
                                                                                .second
                                                                                .attribute,
                                                                            value: sValue.value,
                                                                            level: 2,
                                                                        },
                                                                    ],
                                                                    "price"
                                                                )}
                                                            />
                                                            <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                                <p>vnđ</p>
                                                            </div>
                                                        </div>
                                                        <Input
                                                            className="rounded-none"
                                                            placeholder="Số lượng"
                                                            type="number"
                                                            defaultValue={parseInt(
                                                                getValue(
                                                                    [
                                                                        {
                                                                            attr: attributeProduct
                                                                                .first
                                                                                .attribute,
                                                                            value: fValue.value,
                                                                            level: 1,
                                                                        },
                                                                        {
                                                                            attr: attributeProduct
                                                                                .second
                                                                                .attribute,
                                                                            value: sValue.value,
                                                                            level: 2,
                                                                        },
                                                                    ],
                                                                    "quantity"
                                                                )?.toString() ||
                                                                    "0"
                                                            )}
                                                            onChange={handleOnChange(
                                                                [
                                                                    {
                                                                        attr: attributeProduct
                                                                            .first
                                                                            .attribute,
                                                                        value: fValue.value,
                                                                        level: 1,
                                                                    },
                                                                    {
                                                                        attr: attributeProduct
                                                                            .second
                                                                            .attribute,
                                                                        value: sValue.value,
                                                                        level: 2,
                                                                    },
                                                                ],
                                                                "quantity"
                                                            )}
                                                        />
                                                        <Input
                                                            className="rounded-none"
                                                            placeholder="SKU"
                                                            defaultValue={getValue(
                                                                [
                                                                    {
                                                                        attr: attributeProduct
                                                                            .first
                                                                            .attribute,
                                                                        value: fValue.value,
                                                                        level: 1,
                                                                    },
                                                                    {
                                                                        attr: attributeProduct
                                                                            .second
                                                                            .attribute,
                                                                        value: sValue.value,
                                                                        level: 2,
                                                                    },
                                                                ],
                                                                "sku"
                                                            )}
                                                            onChange={handleOnChange(
                                                                [
                                                                    {
                                                                        attr: attributeProduct
                                                                            .first
                                                                            .attribute,
                                                                        value: fValue.value,
                                                                        level: 1,
                                                                    },
                                                                    {
                                                                        attr: attributeProduct
                                                                            .second
                                                                            .attribute,
                                                                        value: sValue.value,
                                                                        level: 2,
                                                                    },
                                                                ],
                                                                "sku"
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 flex-1">
                                        <div className="flex w-full">
                                            <Input
                                                className="rounded-none w-full"
                                                placeholder="Giá"
                                                type="number"
                                                defaultValue={parseInt(
                                                    getValue(
                                                        [
                                                            {
                                                                attr: attributeProduct
                                                                    .first
                                                                    .attribute,
                                                                value: fValue.value,
                                                                level: 1,
                                                            },
                                                        ],
                                                        "price"
                                                    )?.toString() || "0"
                                                )}
                                                onChange={handleOnChange(
                                                    [
                                                        {
                                                            attr: attributeProduct
                                                                .first
                                                                .attribute,
                                                            value: fValue.value,
                                                            level: 1,
                                                        },
                                                    ],
                                                    "price"
                                                )}
                                            />
                                            <div className="flex border box-border px-2 text-muted-foreground text-sm items-center gap-1 hover:bg-muted text-center rounded">
                                                <p>vnđ</p>
                                            </div>
                                        </div>
                                        <Input
                                            className="rounded-none"
                                            placeholder="Số lượng"
                                            type="number"
                                            defaultValue={parseInt(
                                                getValue(
                                                    [
                                                        {
                                                            attr: attributeProduct
                                                                .first
                                                                .attribute,
                                                            value: fValue.value,
                                                            level: 1,
                                                        },
                                                    ],
                                                    "quantity"
                                                )?.toString() || "0"
                                            )}
                                            onChange={handleOnChange(
                                                [
                                                    {
                                                        attr: attributeProduct
                                                            .first.attribute,
                                                        value: fValue.value,
                                                        level: 1,
                                                    },
                                                ],
                                                "quantity"
                                            )}
                                        />
                                        <Input
                                            className="rounded-none"
                                            placeholder="SKU"
                                            defaultValue={getValue(
                                                [
                                                    {
                                                        attr: attributeProduct
                                                            .first.attribute,
                                                        value: fValue.value,
                                                        level: 1,
                                                    },
                                                ],
                                                "sku"
                                            )}
                                            onChange={handleOnChange(
                                                [
                                                    {
                                                        attr: attributeProduct
                                                            .first.attribute,
                                                        value: fValue.value,
                                                        level: 1,
                                                    },
                                                ],
                                                "sku"
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
