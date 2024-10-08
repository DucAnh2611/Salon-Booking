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
    IProductDetailUpdate,
} from "@/interface/api/product.interface";
import { IProductTabUpdateProps } from "@/interface/product-tabs.interface";
import { generateUUID } from "@/utils/uuid.utils";
import { Label } from "@radix-ui/react-dropdown-menu";
import { ChangeEvent, useMemo, useState } from "react";

interface IUpdateProductDetailTabProps extends IProductTabUpdateProps {
    details: IProductDetailUpdate[];
}

export default function UpdateProductDetailTab({
    details,
    form,
    sessionId,
}: IUpdateProductDetailTabProps) {
    const [productDetail, SetProductDetail] =
        useState<IProductDetail[]>(details);

    const [newProductDetails, SetNewProductDetails] = useState<
        IProductDetail[]
    >([]);

    const [newDetail, SetNewDetail] = useState<IProductDetailCreate>({
        key: "",
        value: "",
    });
    const [openAddNew, SetOpenAddNew] = useState<boolean>(false);
    const [isChange, SetIsChange] = useState<boolean>(false);

    const discardChange = () => {
        SetProductDetail(details);
        SetNewProductDetails([]);
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
            SetNewProductDetails((productDetail) => [
                ...productDetail,
                { ...newDetail, id: generateUUID() },
            ]);
            resetNewDetail();
            SetOpenAddNew(false);
            SetIsChange(true);
        }
    };

    const handleDelete = (type: "new" | "prev") => (id: string) => {
        if (type === "new") {
            SetNewProductDetails(newProductDetails.filter((d) => d.id !== id));
        } else if (type === "prev") {
            SetProductDetail(productDetail.filter((d) => d.id !== id));
        }
        SetIsChange(true);
    };

    const handleUpdate = (type: "new" | "prev") => (item: IProductDetail) => {
        if (type === "new") {
            SetNewProductDetails((details) =>
                details.map((detail) => {
                    if (detail.id === item.id) {
                        return item;
                    }
                    return detail;
                })
            );
        } else if (type === "prev") {
            SetProductDetail((details) =>
                details.map((detail) => {
                    if (detail.id === item.id) {
                        return item;
                    }
                    return detail;
                })
            );
        }
        SetIsChange(true);
    };

    const saveChanges = () => {
        const formDetails = [
            ...productDetail.map(({ id, key, value }) => ({
                id,
                key,
                value,
            })),
            ...newProductDetails.map(({ id, key, value }) => ({
                key,
                value,
            })),
        ];

        form.setValue("details", formDetails);
        SetIsChange(false);
    };

    useMemo(() => {
        SetProductDetail(details);
        SetNewDetail({
            key: "",
            value: "",
        });
    }, [details]);

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
                                                    handleChange={handleUpdate(
                                                        "prev"
                                                    )}
                                                    handleDelete={handleDelete(
                                                        "prev"
                                                    )}
                                                />
                                            ))}
                                            {newProductDetails.map((detail) => (
                                                <ProductDetailEdit
                                                    key={detail.id}
                                                    detail={detail}
                                                    handleChange={handleUpdate(
                                                        "new"
                                                    )}
                                                    handleDelete={handleDelete(
                                                        "new"
                                                    )}
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
