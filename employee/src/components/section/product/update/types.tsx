import SelectAttributeProduct from "@/components/select/select-attribute";
import TableProductAttributeUpdate from "@/components/table/product-attribute-update";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import {
    IAttributeProduct,
    IAttributeProductValue,
} from "@/interface/api/attribute.interface";
import {
    IProductTypeAttribute,
    IProductTypeInfo,
    IProductTypeUpdate,
} from "@/interface/api/product.interface";
import { IProductTabUpdateProps } from "@/interface/product-tabs.interface";
import { generateUUID } from "@/utils/uuid.utils";
import { useMemo, useState } from "react";

interface IUpdateProductTypeTabProps extends IProductTabUpdateProps {
    types: IProductTypeInfo[];
}

export default function UpdateProductTypeTab({
    form,
    sessionId,
    types,
}: IUpdateProductTypeTabProps) {
    const [selectedAttr, SetSelectedAttr] = useState<IAttributeProduct>({
        first: {
            attribute: null,
            values: [],
        },
        second: {
            attribute: null,
            values: [],
        },
    });
    const [productTypes, SetProductTypes] = useState<IProductTypeUpdate[]>([]);
    const [isChange, SetIsChange] = useState<boolean>(false);

    const defaultList = (selectedAttr: IAttributeProduct) => {
        let list: IProductTypeUpdate[] = [];

        if (selectedAttr.first.attribute) {
            const fAttr = selectedAttr.first.attribute;
            if (selectedAttr.second.attribute) {
                const sAttr = selectedAttr.second.attribute;

                selectedAttr.first.values.forEach((fdValue) => {
                    selectedAttr.second.values.forEach((sdValue) => {
                        list = [
                            ...list,
                            {
                                price: 0,
                                quantity: 0,
                                sku: "",
                                types: [
                                    {
                                        attrId: fAttr.id,
                                        attrName: fAttr.name,
                                        level: 1,
                                        value: fdValue.value,
                                    },

                                    {
                                        attrId: sAttr.id,
                                        attrName: fAttr.name,
                                        level: 2,
                                        value: sdValue.value,
                                    },
                                ],
                            },
                        ];
                    });
                });
            } else {
                for (const fdValue of selectedAttr.first.values) {
                    list = [
                        ...list,
                        {
                            price: 0,
                            quantity: 0,
                            sku: "",
                            types: [
                                {
                                    attrId: fAttr.id,
                                    attrName: fAttr.name,
                                    level: 1,
                                    value: fdValue.value,
                                },
                            ],
                        },
                    ];
                }
            }
        }

        return list;
    };

    const defineNewList = (
        selectedAttr: IAttributeProduct
    ): IProductTypeUpdate[] => {
        const newDefaultList = defaultList(selectedAttr);

        const list: IProductTypeUpdate[] = newDefaultList.map((newType) => {
            let matchIndex = -1;

            productTypes.forEach((type, i) => {
                const combineList = [...newType.types, ...type.types];
                const map = new Map();

                combineList.forEach((item) => {
                    const key = item.attrId + item.value + item.level;
                    if (map.has(key)) {
                        map.set(key, map.get(key) + 1);
                    } else {
                        map.set(key, 1);
                    }
                });

                if (map.size === newType.types.length) {
                    matchIndex = i;
                }
            });

            if (matchIndex !== -1) {
                return productTypes[matchIndex];
            }
            return newType;
        });

        return list;
    };

    const handleSelectAttr = (select: IAttributeProduct) => {
        const newList = defineNewList(select);

        SetProductTypes(newList);
        SetSelectedAttr(select);
        SetIsChange(true);

        form.clearErrors("types");
    };

    const handleChangeType = (types: IProductTypeUpdate[]) => {
        SetProductTypes(types);
        SetIsChange(true);
    };

    const convertToUpdate = (
        types: IProductTypeInfo[]
    ): IProductTypeUpdate[] => {
        return types.map((type) => {
            const { id, productTypesAttribute, ...update } = type;
            return {
                productTypesId: type.id,
                ...update,
                types: productTypesAttribute.map((typeAttr) => {
                    return {
                        attrId: typeAttr.attributeId,
                        attrName: typeAttr.attribute.name,
                        value: typeAttr.value,
                        level: typeAttr.level,
                    } as IProductTypeAttribute;
                }),
            };
        });
    };

    const detectSelectAttr = (types: IProductTypeInfo[]) => {
        const selectAttr: IAttributeProduct = {
            first: {
                attribute: null,
                values: [],
            },
            second: {
                attribute: null,
                values: [],
            },
        };

        if (types.length) {
            const firstValue: IAttributeProductValue[] = [];
            const secValue: IAttributeProductValue[] = [];

            types.forEach((type) => {
                type.productTypesAttribute.forEach((attr) => {
                    selectAttr[
                        attr.level === 1 ? "first" : "second"
                    ].attribute = attr.attribute;

                    if (
                        attr.level === 1 &&
                        !firstValue.some((v) => attr.value === v.value)
                    ) {
                        firstValue.push({
                            id: generateUUID(),
                            value: attr.value,
                        });
                    }
                    if (
                        attr.level === 2 &&
                        !secValue.some((v) => attr.value === v.value)
                    ) {
                        secValue.push({
                            id: generateUUID(),
                            value: attr.value,
                        });
                    }
                });
            });

            selectAttr.first.values = firstValue;
            selectAttr.second.values = secValue;
        }

        SetProductTypes(convertToUpdate(types));
        SetSelectedAttr(selectAttr);
    };

    const discardChange = () => {
        detectSelectAttr(types);
        SetIsChange(false);
    };

    const saveChanges = () => {
        form.setValue("types", productTypes);
        SetIsChange(false);
    };

    useMemo(() => {
        detectSelectAttr(types);
    }, [types]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Các kiểu loại, mẫu mã của sản phẩm</CardTitle>
                <CardDescription>
                    Nếu không có, có thể bỏ qua bước này. Các thông tin về mã
                    SKU nếu có của kiểu mã không được trùng với sản phẩm nào
                    trong kho sản phẩm.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="types"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-left">
                                Phân loại
                            </FormLabel>
                            <FormControl>
                                <div>
                                    <SelectAttributeProduct
                                        onSelect={handleSelectAttr}
                                        selected={selectedAttr}
                                    />
                                    <TableProductAttributeUpdate
                                        onChange={handleChangeType}
                                        productTypes={productTypes}
                                        attributeProduct={selectedAttr}
                                    />

                                    {isChange && (
                                        <div className="w-full flex justify-end mt-2 gap-2">
                                            <Button
                                                variant="outline"
                                                className="border-destructive text-destructive"
                                                onClick={discardChange}
                                            >
                                                Bỏ thay đổi
                                            </Button>
                                            <Button
                                                variant="secondary"
                                                onClick={saveChanges}
                                            >
                                                Lưu thay đổi
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
