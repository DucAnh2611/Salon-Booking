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
import {
    IAttributeValue,
    IProductType,
} from "@/interface/api/product.interface";
import { IProductTabCreateProps } from "@/interface/product-tabs.interface";
import { useState } from "react";

export default function CreateProductTypeSection({
    form,
    sessionId,
}: IProductTabCreateProps) {
    const [selectedAttr, SetSelectedAttr] = useState<IAttributeValue>({});
    const [productTypes, SetProductTypes] = useState<IProductType[]>([]);

    const defaultList = (selectedAttr: IAttributeValue) => {
        const list: IProductType[] = [];

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
                                        attrValueTempId: fValue.tempId || "",
                                        level: 1,
                                    },
                                },
                                {
                                    value: {
                                        attrValueTempId: sValue.tempId || "",
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
                                    attrValueTempId: fValue.tempId || "",
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

    const handleSelectAttr = (select: IAttributeValue) => {
        SetSelectedAttr(select);
        SetProductTypes(defaultList(select));

        form.clearErrors("types");
        form.setValue("types.selectAttribute", select);
    };

    const handleChangeProductTypeAttr = (attr: IProductType[]) => {
        SetProductTypes(attr);
        form.setValue(
            "types.types",
            attr.map((a) => ({
                ...a,
                types: a.types.map((at) => ({
                    ...at,
                    value: {
                        ...at.value,
                        attrValueTempId: at.value.attrValueTempId || "",
                    },
                })),
            }))
        );
    };

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
                                        onChange={handleChangeProductTypeAttr}
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
