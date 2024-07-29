import SelectAttributeProduct from "@/components/select/select-attribute";
import TableProductAttribute from "@/components/table/product-attribute";
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
import { IAttributeProduct } from "@/interface/api/attribute.interface";
import { IProductType } from "@/interface/api/product.interface";
import { IProductTabCreateProps } from "@/interface/product-tabs.interface";
import { generateUUID } from "@/utils/uuid.utils";
import { useEffect, useState } from "react";

export default function CreateProductTypeSection({
    form,
    sessionId,
}: IProductTabCreateProps) {
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

    const [productTypes, SetProductTypes] = useState<IProductType[]>(
        form.getValues("types") || []
    );

    const getSelectedAttrForm = (types: IProductType[]) => {
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

        const typeIndex: Array<keyof IAttributeProduct> = ["first", "second"];

        types.forEach((pType) => {
            pType.types.forEach((attrType) => {
                const level = typeIndex[attrType.level - 1];
                if (!selectAttr[level].attribute) {
                    selectAttr[level].attribute = {
                        id: attrType.attrId,
                        name: attrType.attrName,
                    };
                }
                selectAttr[level].values.push({
                    id: generateUUID(),
                    value: attrType.value,
                });
            });
        });

        SetSelectedAttr(selectAttr);
    };

    const defaultList = (selectedAttr: IAttributeProduct) => {
        const list: IProductType[] = [];
        if (selectedAttr.first.attribute) {
            const fAttr = selectedAttr.first.attribute;
            if (selectedAttr.second.attribute) {
                const sAttr = selectedAttr.second.attribute;

                selectedAttr.first.values.forEach((fValue) => {
                    selectedAttr.second.values.forEach((sValue) => {
                        list.push({
                            price: 0,
                            quantity: 0,
                            types: [
                                {
                                    attrId: fAttr.id,
                                    attrName: fAttr.name,
                                    level: 1,
                                    value: fValue.value,
                                },

                                {
                                    attrId: sAttr.id,
                                    attrName: fAttr.name,
                                    level: 2,
                                    value: sValue.value,
                                },
                            ],
                        });
                    });
                });
            } else {
                selectedAttr.first.values.forEach((fValue) => {
                    list.push({
                        price: 0,
                        quantity: 0,
                        types: [
                            {
                                attrId: fAttr.id,
                                attrName: fAttr.name,
                                level: 1,
                                value: fValue.value,
                            },
                        ],
                    });
                });
            }
        }
        return list;
    };

    const handleSelectAttr = (select: IAttributeProduct) => {
        SetSelectedAttr(select);
        SetProductTypes(defaultList(select));

        form.clearErrors("types");
    };

    const handleChangeAttr = (attr: IProductType[]) => {
        SetProductTypes(attr);
        form.setValue("types", attr);
    };

    useEffect(() => {
        getSelectedAttrForm(form.getValues("types"));
    }, [form]);

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
                                    <TableProductAttribute
                                        onChange={handleChangeAttr}
                                        productTypes={productTypes}
                                        attributeProduct={selectedAttr}
                                    />
                                </div>
                            </FormControl>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
