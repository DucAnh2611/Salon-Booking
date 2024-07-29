import ProductDetailEdit from "@/components/product-detail";
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
import { Input } from "@/components/ui/input";
import {
    IProductDetail,
    IProductDetailCreate,
} from "@/interface/api/product.interface";
import { IProductTabCreateProps } from "@/interface/product-tabs.interface";
import { generateUUID } from "@/utils/uuid.utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ChangeEvent, useState } from "react";

export default function CreateProductDetailSection({
    form,
    sessionId,
}: IProductTabCreateProps) {
    const [productDetail, SetProductDetail] = useState<IProductDetail[]>(
        form.getValues("details").map((d) => ({ id: generateUUID(), ...d }))
    );
    const [newDetail, SetNewDetail] = useState<IProductDetailCreate>({
        key: "",
        value: "",
    });
    const [openAddNew, SetOpenAddNew] = useState<boolean>(false);
    const [isChange, SetIsChange] = useState<boolean>(false);

    const discardChange = () => {
        SetProductDetail(
            form.getValues("details").map((d) => ({ id: generateUUID(), ...d }))
        );
        resetNewDetail();
    };

    const resetNewDetail = () => {
        SetNewDetail({
            key: "",
            value: "",
        });
        SetIsChange(false);
    };

    const handleToggleAddNew = () => {
        SetOpenAddNew(!openAddNew);
        if (!openAddNew) {
            resetNewDetail();
        }
    };

    const handleChangeNewDetail =
        (type: keyof IProductDetailCreate) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            SetNewDetail({
                ...newDetail,
                [type]: e.target.value,
            });
        };

    const handleConfirmAdd = () => {
        if (newDetail.key !== "" && newDetail.value !== "") {
            SetProductDetail((productDetail) => [
                ...productDetail,
                { ...newDetail, id: generateUUID() },
            ]);
            resetNewDetail();
            SetOpenAddNew(false);
            SetIsChange(true);
        }
    };

    const handleDelete = (id: string) => {
        SetProductDetail(productDetail.filter((d) => d.id !== id));
        SetIsChange(true);
    };

    const handleUpdate = (item: IProductDetail) => {
        SetProductDetail((details) =>
            details.map((detail) => {
                if (detail.id === item.id) {
                    return item;
                }
                return detail;
            })
        );
        SetIsChange(true);
    };

    const saveChanges = () => {
        form.setValue(
            "details",
            productDetail.map(({ id, key, value }) => ({
                key,
                value,
            }))
        );
        SetIsChange(false);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin chi tiết của sản phẩm</CardTitle>
                <CardDescription>
                    Một số thông tin chi tiết để hiển thị: chất liệu , hãng
                    hiệu...
                </CardDescription>
            </CardHeader>
            <CardContent>
                <FormField
                    control={form.control}
                    name="details"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Mô tả</FormLabel>
                            <FormControl>
                                <div className="grid grid-flow-row grid-cols-2 w-full">
                                    <div className="w-full flex flex-col gap-5">
                                        <div className="w-full flex flex-col gap-2">
                                            {productDetail.map((detail) => (
                                                <ProductDetailEdit
                                                    key={detail.id}
                                                    detail={detail}
                                                    handleChange={handleUpdate}
                                                    handleDelete={handleDelete}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex flex-col">
                                            {openAddNew ? (
                                                <>
                                                    <Label>Thêm mới</Label>
                                                    <div className="w-full flex gap-1">
                                                        <Input
                                                            placeholder="Tên mục"
                                                            value={
                                                                newDetail.key
                                                            }
                                                            onChange={handleChangeNewDetail(
                                                                "key"
                                                            )}
                                                            className="flex-1"
                                                        />
                                                        <Input
                                                            placeholder="Giá trị"
                                                            value={
                                                                newDetail.value
                                                            }
                                                            onChange={handleChangeNewDetail(
                                                                "value"
                                                            )}
                                                            className="flex-[3]"
                                                        />
                                                    </div>

                                                    <div className="flex gap-2 mt-2">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            onClick={
                                                                handleToggleAddNew
                                                            }
                                                        >
                                                            Hủy
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            onClick={
                                                                handleConfirmAdd
                                                            }
                                                        >
                                                            Xác nhận
                                                        </Button>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={
                                                            handleToggleAddNew
                                                        }
                                                    >
                                                        Thêm mới
                                                    </Button>
                                                    {isChange && (
                                                        <>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="border-destructive text-destructive"
                                                                onClick={
                                                                    discardChange
                                                                }
                                                            >
                                                                Bỏ thay đổi
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                onClick={
                                                                    saveChanges
                                                                }
                                                            >
                                                                Lưu thay đổi
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
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
