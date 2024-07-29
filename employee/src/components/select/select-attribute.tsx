import {
    IAttribute,
    IAttributeProduct,
    IAttributeProductValue,
} from "@/interface/api/attribute.interface";
import { generateUUID } from "@/utils/uuid.utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ChangeEvent, useState } from "react";
import PopoverSelectAttributeProduct from "../popover/attribute/select-attribute";
import InputProductAttributeValue from "../product-attribute-value";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ISelectAttributeProduct {
    onSelect: (attrId: IAttributeProduct) => void;
    selected: IAttributeProduct;
}

export default function SelectAttributeProduct({
    onSelect,
    selected,
}: ISelectAttributeProduct) {
    const [error, SetError] = useState<string>();
    const [newAttrValue, SetNewAttrValue] = useState<{
        type: keyof IAttributeProduct;
        value: IAttributeProductValue;
    } | null>();

    const resetAttributeProduct = () => {
        onSelect({
            first: {
                attribute: null,
                values: [],
            },
            second: {
                attribute: null,
                values: [],
            },
        });
        SetNewAttrValue(null);
        SetError("");
    };

    const clearAttrSecond = () => {
        if (selected.second.attribute) {
            onSelect({
                ...selected,
                second: {
                    attribute: null,
                    values: [],
                },
            });
        }
    };

    const onSelectAttribute =
        (type: keyof IAttributeProduct) => (attribute: IAttribute | null) => {
            onSelect({
                ...selected,
                [type]: {
                    attribute,
                    values: [],
                },
            });
            SetError("");
        };

    const clickAddValue = (type: keyof IAttributeProduct) => () => {
        SetNewAttrValue({
            type,
            value: {
                id: generateUUID(),
                value: "",
            },
        });
    };

    const handleChangeNew = (e: ChangeEvent<HTMLInputElement>) => {
        if (newAttrValue) {
            SetNewAttrValue({
                ...newAttrValue,
                value: {
                    ...newAttrValue.value,
                    value: e.target.value,
                },
            });
        }
    };

    const cancelAddValue = () => {
        SetNewAttrValue(null);
    };

    const confirmAttributeValue = () => {
        if (
            newAttrValue &&
            newAttrValue.value.value &&
            !selected[newAttrValue.type].values.some(
                (v) => v.value === newAttrValue.value.value
            )
        ) {
            const newSelectedAttr = {
                ...selected,
                [newAttrValue.type]: {
                    ...selected[newAttrValue.type],
                    values: [
                        ...selected[newAttrValue.type].values,
                        newAttrValue.value,
                    ],
                },
            };
            if (
                newSelectedAttr.first.attribute &&
                newSelectedAttr.second.attribute &&
                newSelectedAttr.first.attribute.id ===
                    newSelectedAttr.second.attribute.id
            ) {
                SetError("Các kiểu phải khác nhau");
            } else {
                onSelect(newSelectedAttr);
                SetError("");
            }
            SetNewAttrValue(null);
        }
    };

    const deleteValue =
        (type: keyof IAttributeProduct) => (value: IAttributeProductValue) => {
            onSelect({
                ...selected,
                [type]: {
                    ...selected[type],
                    values: selected[type].values.filter(
                        (item) => item.id !== value.id
                    ),
                },
            });
        };

    return (
        <div>
            <div className="flex w-full flex-col gap-5">
                <div className="w-full h-fit border rounded-md box-border p-4 grid grid-cols-2 gap-6">
                    <div>
                        <div className="flex gap-2">
                            <Label className="text-sm w-[150px] my-auto">
                                Phân loại 1
                            </Label>
                            <PopoverSelectAttributeProduct
                                onSelect={onSelectAttribute("first")}
                                selected={selected.first.attribute}
                            />
                            {selected.first.attribute && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-destructive border-destructive"
                                    onClick={resetAttributeProduct}
                                >
                                    Xóa phân loại 1
                                </Button>
                            )}
                        </div>
                        {selected.first.attribute && (
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {selected.first.values.map((value) => (
                                    <InputProductAttributeValue
                                        value={value}
                                        onDelete={deleteValue("first")}
                                    />
                                ))}
                                {newAttrValue ? (
                                    newAttrValue?.type === "first" && (
                                        <div className="flex gap-1">
                                            <Input
                                                placeholder="Mẫu mã"
                                                onChange={handleChangeNew}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="text-destructive border-destructive"
                                                onClick={cancelAddValue}
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="default"
                                                onClick={confirmAttributeValue}
                                            >
                                                Thêm
                                            </Button>
                                        </div>
                                    )
                                ) : (
                                    <div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={clickAddValue("first")}
                                        >
                                            Thêm mẫu mã
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="flex gap-2">
                            <Label className="text-sm w-[150px] my-auto">
                                Phân loại 2
                            </Label>
                            <PopoverSelectAttributeProduct
                                onSelect={onSelectAttribute("second")}
                                selected={selected.second.attribute}
                            />
                            {selected.second.attribute && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="text-destructive border-destructive"
                                    onClick={clearAttrSecond}
                                >
                                    Xóa phân loại 2
                                </Button>
                            )}
                        </div>

                        {selected.second.attribute && (
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {selected.second.values.map((value) => (
                                    <InputProductAttributeValue
                                        value={value}
                                        onDelete={deleteValue("second")}
                                    />
                                ))}
                                {newAttrValue ? (
                                    newAttrValue?.type === "second" && (
                                        <div className="flex gap-1">
                                            <Input
                                                placeholder="Mẫu mã"
                                                onChange={handleChangeNew}
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className="text-destructive border-destructive"
                                                onClick={cancelAddValue}
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                type="button"
                                                variant="default"
                                                onClick={confirmAttributeValue}
                                            >
                                                Thêm
                                            </Button>
                                        </div>
                                    )
                                ) : (
                                    <div>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={clickAddValue("second")}
                                        >
                                            Thêm mẫu mã
                                        </Button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {error && (
                    <div className="flex-1 ">
                        <p className="text-destructive text-xs">{error}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
