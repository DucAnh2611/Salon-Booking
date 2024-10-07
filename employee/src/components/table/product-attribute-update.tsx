import {
    IAttributeValue,
    IAttributeValueUpdate,
    IProductTypeUpdate,
} from "@/interface/api/product.interface";
import { ChangeEvent, useMemo, useState } from "react";
import RequireField from "../require-field";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface ITableProductAttributeUpdateProps {
    attributeProduct: IAttributeValue;
    productTypes: IProductTypeUpdate[];
    onChange: (type: IProductTypeUpdate[]) => void;
}

export default function TableProductAttributeUpdate({
    attributeProduct,
    productTypes,
    onChange,
}: ITableProductAttributeUpdateProps) {
    const [types, SetTypes] = useState<IProductTypeUpdate[]>([]);

    const handleOnChange =
        (
            attrIds: Array<{
                value: IAttributeValueUpdate;
                level: number;
            }>,
            key: keyof Omit<IProductTypeUpdate, "types">
        ) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            const index = types.findIndex((t) => {
                const map = new Map();

                attrIds.forEach((attrId) => {
                    map.set(
                        attrId.value.tempId || attrId.value.id,
                        (map.has(attrId.value.tempId || attrId.value.id)
                            ? map.get(attrId.value.tempId || attrId.value.id)
                            : 0) + 1
                    );
                });

                t.types.forEach((t) => {
                    map.set(
                        t.value.attrValueTempId || t.value.attrValueId,
                        (map.has(t.value.attrValueTempId || t.value.attrValueId)
                            ? map.get(
                                  t.value.attrValueTempId || t.value.attrValueId
                              )
                            : 0) + 1
                    );
                });

                return (
                    Array.from(map).filter((item) => item[1] === 2).length ===
                    attrIds.length
                );
            });
            if (index !== -1) {
                const listType = types;
                const typeOfValue = typeof listType[index][key];
                let value: any = e.target.value;

                if (typeOfValue === "number") {
                    value = parseInt(value) || 0;
                }

                listType[index] = {
                    ...types[index],
                    [key]: value,
                };

                onChange([...listType]);
            }
        };

    const getValue = (
        attrIds: Array<{
            value: IAttributeValueUpdate;
            level: number;
        }>,
        key: keyof Omit<IProductTypeUpdate, "types">
    ) => {
        const index = types.findIndex((t) => {
            const map = new Map();

            attrIds.forEach((attrId) => {
                map.set(
                    attrId.value.tempId || attrId.value.id,
                    (map.has(attrId.value.tempId || attrId.value.id)
                        ? map.get(attrId.value.tempId || attrId.value.id)
                        : 0) + 1
                );
            });

            t.types.forEach((t) => {
                map.set(
                    t.value.attrValueTempId || t.value.attrValueId,
                    (map.has(t.value.attrValueTempId || t.value.attrValueId)
                        ? map.get(
                              t.value.attrValueTempId || t.value.attrValueId
                          )
                        : 0) + 1
                );
            });

            return (
                Array.from(map).filter((item) => item[1] === 2).length ===
                attrIds.length
            );
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
            {attributeProduct.first?.attribute && (
                <div>
                    <div className="flex">
                        <div className="border w-[150px] p-2 flex items-center justify-center">
                            <Label className="text-center w-full">
                                {attributeProduct.first?.attribute.name}
                            </Label>
                        </div>
                        {attributeProduct.sec?.attribute && (
                            <div className="border w-[150px] p-2 flex items-center justify-center">
                                <Label className="text-center w-full">
                                    {attributeProduct.sec?.attribute.name}
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
                        {attributeProduct.first?.value.map((fValue) => (
                            <div className="flex w-full" key={fValue.id}>
                                <div className="border flex items-center justify-center w-[150px] box-border px-3">
                                    <p className="text-sm">{fValue.value}</p>
                                </div>

                                {attributeProduct.sec?.attribute ? (
                                    <div className="flex-1">
                                        {attributeProduct.sec?.value.map(
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
                                                                className="rounded-none w-full focus-visible:ring-transparent"
                                                                placeholder="Giá"
                                                                type="number"
                                                                value={parseInt(
                                                                    getValue(
                                                                        [
                                                                            {
                                                                                value: fValue,
                                                                                level: 1,
                                                                            },
                                                                            {
                                                                                value: sValue,
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
                                                                            value: fValue,
                                                                            level: 1,
                                                                        },
                                                                        {
                                                                            value: sValue,
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
                                                            className="rounded-none focus-visible:ring-transparent"
                                                            placeholder="Số lượng"
                                                            type="number"
                                                            value={parseInt(
                                                                getValue(
                                                                    [
                                                                        {
                                                                            value: fValue,
                                                                            level: 1,
                                                                        },
                                                                        {
                                                                            value: sValue,
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
                                                                        value: fValue,
                                                                        level: 1,
                                                                    },
                                                                    {
                                                                        value: sValue,
                                                                        level: 2,
                                                                    },
                                                                ],
                                                                "quantity"
                                                            )}
                                                        />
                                                        <Input
                                                            className="rounded-none focus-visible:ring-transparent"
                                                            placeholder="SKU"
                                                            value={
                                                                getValue(
                                                                    [
                                                                        {
                                                                            value: fValue,
                                                                            level: 1,
                                                                        },
                                                                        {
                                                                            value: sValue,
                                                                            level: 2,
                                                                        },
                                                                    ],
                                                                    "sku"
                                                                ) || ""
                                                            }
                                                            onChange={handleOnChange(
                                                                [
                                                                    {
                                                                        value: fValue,
                                                                        level: 1,
                                                                    },
                                                                    {
                                                                        value: sValue,
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
                                                className="rounded-none w-full focus-visible:ring-transparent"
                                                placeholder="Giá"
                                                type="number"
                                                value={parseInt(
                                                    getValue(
                                                        [
                                                            {
                                                                value: fValue,
                                                                level: 1,
                                                            },
                                                        ],
                                                        "price"
                                                    )?.toString() || "0"
                                                )}
                                                onChange={handleOnChange(
                                                    [
                                                        {
                                                            value: fValue,
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
                                            className="rounded-none focus-visible:ring-transparent"
                                            placeholder="Số lượng"
                                            type="number"
                                            value={parseInt(
                                                getValue(
                                                    [
                                                        {
                                                            value: fValue,
                                                            level: 1,
                                                        },
                                                    ],
                                                    "quantity"
                                                )?.toString() || "0"
                                            )}
                                            onChange={handleOnChange(
                                                [
                                                    {
                                                        value: fValue,
                                                        level: 1,
                                                    },
                                                ],
                                                "quantity"
                                            )}
                                        />
                                        <Input
                                            className="rounded-none focus-visible:ring-transparent"
                                            placeholder="SKU"
                                            value={
                                                getValue(
                                                    [
                                                        {
                                                            value: fValue,
                                                            level: 1,
                                                        },
                                                    ],
                                                    "sku"
                                                ) || ""
                                            }
                                            onChange={handleOnChange(
                                                [
                                                    {
                                                        value: fValue,
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
