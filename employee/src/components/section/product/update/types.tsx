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
    FormMessage,
} from "@/components/ui/form";
import {
    IAttributeValue,
    IProductTypeAttributeUpdate,
    IProductTypeInfo,
    IProductTypeUpdate,
} from "@/interface/api/product.interface";
import { IProductTabUpdateProps } from "@/interface/product-tabs.interface";
import { useMemo, useState } from "react";

interface IUpdateProductTypeTabProps extends IProductTabUpdateProps {
    types: IProductTypeInfo[];
}

export default function UpdateProductTypeTab({
    form,
    sessionId,
    types,
}: IUpdateProductTypeTabProps) {
    const [selectedAttr, SetSelectedAttr] = useState<IAttributeValue>({});
    const [productTypes, SetProductTypes] = useState<IProductTypeUpdate[]>([]);
    const [isChange, SetIsChange] = useState<boolean>(false);

    const defaultList = (selectedAttr: IAttributeValue) => {
        let list: IProductTypeUpdate[] = [];

        if (selectedAttr.first && selectedAttr.first.attribute) {
            if (selectedAttr.sec && selectedAttr.sec.attribute) {
                selectedAttr.first?.value.forEach((fValue) => {
                    selectedAttr.sec?.value.forEach((sValue) => {
                        list.push({
                            price: 0,
                            quantity: 0,
                            types: [
                                {
                                    value: {
                                        ...(fValue.id
                                            ? { attrValueId: fValue.id }
                                            : {}),
                                        ...(fValue.tempId
                                            ? { attrValueTempId: fValue.tempId }
                                            : {}),
                                        level: 1,
                                    },
                                },
                                {
                                    value: {
                                        ...(sValue.id
                                            ? { attrValueId: sValue.id }
                                            : {}),
                                        ...(sValue.tempId
                                            ? { attrValueTempId: sValue.tempId }
                                            : {}),
                                        level: 2,
                                    },
                                },
                            ],
                        });
                    });
                });
            } else {
                selectedAttr.first?.value.forEach((fValue) => {
                    list.push({
                        price: 0,
                        quantity: 0,
                        types: [
                            {
                                value: {
                                    ...(fValue.id
                                        ? { attrValueId: fValue.id }
                                        : {}),
                                    ...(fValue.tempId
                                        ? { attrValueTempId: fValue.tempId }
                                        : {}),
                                    level: 1,
                                },
                            },
                        ],
                    });
                });
            }
        }

        return list;
    };

    const defineNewList = (
        selectedAttr: IAttributeValue
    ): IProductTypeUpdate[] => {
        const newDefaultList = defaultList(selectedAttr);

        const list: IProductTypeUpdate[] = newDefaultList.map((newType) => {
            let matchIndex = -1;

            productTypes.forEach((type, i) => {
                const combineList = [...newType.types, ...type.types];
                const map = new Map();

                combineList.forEach((item) => {
                    const key =
                        item.value.attrValueId || item.value.attrValueTempId;
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

    const handleSelectAttr = (select: IAttributeValue) => {
        const newList = defineNewList(select);

        SetProductTypes(newList);
        SetSelectedAttr(select);
        SetIsChange(true);

        form.clearErrors("types");
        form.setValue("types.selectAttribute", select);
    };

    const handleChangeType = (types: IProductTypeUpdate[]) => {
        SetProductTypes(types);
        SetIsChange(true);
    };

    const convertToUpdate = (
        types: IProductTypeInfo[]
    ): IProductTypeUpdate[] => {
        const productTypes = types.map((type) => {
            const { id, productTypesAttribute, ...update } = type;
            return {
                productTypesId: id,
                ...update,
                types: productTypesAttribute.map((typeAttr) => {
                    return {
                        value: {
                            level: typeAttr.level,
                            attrValueId: typeAttr.attributeValueId,
                        },
                    } as IProductTypeAttributeUpdate;
                }),
            };
        });

        return productTypes;
    };

    const detectSelectAttr = (types: IProductTypeInfo[]) => {
        let selectAttr: IAttributeValue = {};

        if (types.length) {
            types.forEach((type) => {
                const mapLevel: Array<keyof IAttributeValue> = [
                    "first",
                    "first",
                    "sec",
                ];
                type.productTypesAttribute.forEach((ta) => {
                    const typeSelectAttr = mapLevel[ta.level] || mapLevel[1];

                    selectAttr = {
                        ...selectAttr,
                        [typeSelectAttr]: {
                            attribute: ta.value.attribute,
                            value: [
                                ...(
                                    selectAttr[typeSelectAttr]?.value || []
                                ).filter((e) => e.id !== ta.attributeValueId),
                                ta.value,
                            ],
                        },
                    };
                });
            });
        }

        return selectAttr;
    };

    const discardChange = () => {
        SetSelectedAttr(detectSelectAttr(types));
        SetProductTypes(convertToUpdate(types));
        SetIsChange(false);
    };

    const saveChanges = () => {
        form.setValue(
            "types.types",
            productTypes.map(({ sku, ...itemInfo }) => ({
                ...itemInfo,
                ...(sku ? { sku } : {}),
            }))
        );
        SetIsChange(false);
    };

    useMemo(() => {
        SetProductTypes(convertToUpdate(types));
        SetSelectedAttr(detectSelectAttr(types));
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
                            <FormMessage />
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
