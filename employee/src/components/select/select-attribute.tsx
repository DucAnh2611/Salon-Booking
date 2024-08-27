import { IAttribute } from "@/interface/api/attribute.interface";
import {
    IAttributeValue,
    IAttributeValueUpdate,
} from "@/interface/api/product.interface";
import { generateUUID } from "@/utils/uuid.utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ChangeEvent, useState } from "react";
import PopoverSelectAttributeProduct from "../popover/attribute/select-attribute";
import InputProductAttributeValue from "../product-attribute-value";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface ISelectAttributeProduct {
    onSelect: (attrId: IAttributeValue) => void;
    selected: IAttributeValue;
}

export default function SelectAttributeProduct({
    onSelect,
    selected,
}: ISelectAttributeProduct) {
    const [error, SetError] = useState<string>();
    const [newAttrValue, SetNewAttrValue] = useState<{
        type: keyof IAttributeValue;
        value: IAttributeValueUpdate;
    } | null>();

    const resetAttributeProduct = () => {
        onSelect({});
        SetNewAttrValue(null);
        SetError("");
    };

    const clearAttrSecond = () => {
        if (selected.sec && selected.sec.attribute) {
            if (selected.first && selected.first.attribute) {
                onSelect({
                    first: selected.first,
                });
            } else {
                onSelect({});
            }
        }
    };

    const onSelectAttribute =
        (type: keyof IAttributeValue) => (attribute: IAttribute | null) => {
            let newSelect = {
                ...selected,
                [type]: {
                    attribute: attribute,
                    value: [],
                },
            };
            if (type === "sec" && !newSelect.first) {
                SetError("Phải nhập phân loại 1");
                onSelect(selected);
                return;
            }

            if (!attribute) {
                if (type === "first") {
                    newSelect = {};
                } else {
                    newSelect = {
                        first: newSelect.first,
                    };
                }
                onSelect(newSelect);
                return;
            }

            if (
                type === "sec" &&
                newSelect.first &&
                newSelect.first.attribute &&
                attribute &&
                attribute.id === newSelect.first.attribute.id
            ) {
                newSelect = { ...selected };
                SetError("Phải nhập khác phân loại 1");
                onSelect(newSelect);
                return;
            }

            if (
                type === "first" &&
                newSelect.sec &&
                newSelect.sec.attribute &&
                attribute &&
                attribute.id === newSelect.sec.attribute.id
            ) {
                newSelect = { ...selected };
                SetError("Phải nhập khác phân loại 2");
                onSelect(newSelect);
                return;
            }

            onSelect(newSelect);
            SetError("");
            return;
        };

    const clickAddValue = (type: keyof IAttributeValue) => () => {
        SetNewAttrValue({
            type,
            value: {
                tempId: generateUUID(),
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
            selected[newAttrValue.type]
        ) {
            const newSelectedAttr = {
                ...selected,
                [newAttrValue.type]: {
                    ...selected[newAttrValue.type],
                    value: [
                        ...(selected[newAttrValue.type]?.value || []),
                        newAttrValue.value,
                    ],
                },
            };
            if (
                newSelectedAttr.first &&
                newSelectedAttr.sec &&
                newSelectedAttr.first.attribute &&
                newSelectedAttr.sec.attribute &&
                newSelectedAttr.first.attribute.id ===
                    newSelectedAttr.sec.attribute.id
            ) {
                SetError("Các kiểu phải khác nhau");
                onSelect(selected);
            } else {
                onSelect(newSelectedAttr);
                SetError("");
                SetNewAttrValue(null);
            }
        }
    };

    const deleteValue =
        (type: keyof IAttributeValue) => (value: IAttributeValueUpdate) => {
            if (selected[type]) {
                onSelect({
                    ...selected,
                    [type]: {
                        ...selected[type],
                        value: selected[type]?.value.filter((item) =>
                            item.id
                                ? item.id !== value.id
                                : item.tempId !== value.tempId
                        ),
                    },
                });
            }
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
                                selected={selected.first?.attribute || null}
                            />
                            {selected.first?.attribute && (
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
                        {selected.first?.attribute && (
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {selected.first.value.map((value) => (
                                    <div
                                        key={
                                            value.tempId
                                                ? value.tempId
                                                : value.id
                                        }
                                    >
                                        <InputProductAttributeValue
                                            value={value}
                                            onDelete={deleteValue("first")}
                                        />
                                    </div>
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
                                onSelect={onSelectAttribute("sec")}
                                selected={selected.sec?.attribute || null}
                            />
                            {selected.sec?.attribute && (
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

                        {selected.sec?.attribute && (
                            <div className="grid grid-cols-2 gap-3 mt-2">
                                {selected.sec.value.map((value) => (
                                    <div
                                        key={
                                            value.tempId
                                                ? value.tempId
                                                : value.id
                                        }
                                    >
                                        <InputProductAttributeValue
                                            value={value}
                                            onDelete={deleteValue("sec")}
                                        />
                                    </div>
                                ))}
                                {newAttrValue ? (
                                    newAttrValue?.type === "sec" && (
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
                                            onClick={clickAddValue("sec")}
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
