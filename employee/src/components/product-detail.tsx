import { IProductDetail } from "@/interface/api/product.interface";
import { PenLineIcon, TrashIcon } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface IProductDetailEditProps {
    detail: IProductDetail;
    handleDelete: (id: string) => void;
    handleChange: (detail: IProductDetail) => void;
}
export default function ProductDetailEdit({
    detail,
    handleDelete,
    handleChange,
}: IProductDetailEditProps) {
    const [isEdit, SetIsEdit] = useState<boolean>();
    const [newDetail, SetNewDetail] = useState<IProductDetail>(detail);

    const handleChangeValue =
        (key: keyof IProductDetail) => (e: ChangeEvent<HTMLInputElement>) => {
            if (!isEdit) {
                SetIsEdit(true);
            }
            SetNewDetail({
                ...newDetail,
                [key]: e.target.value,
            });
        };

    const handleDeleteDetail = () => {
        handleDelete(detail.id);
    };

    const handleUpdate = () => {
        handleChange(newDetail);
        SetIsEdit(false);
    };

    return (
        <div key={detail.id} className="w-full flex gap-1">
            <Input
                placeholder="Tên mục"
                value={newDetail.key}
                onChange={handleChangeValue("key")}
                className="flex-1"
            />
            <Input
                placeholder="Giá trị"
                value={newDetail.value}
                onChange={handleChangeValue("value")}
                className="flex-[3]"
            />
            {isEdit ? (
                <Button
                    type="button"
                    variant="default"
                    className="gap-2"
                    onClick={handleUpdate}
                >
                    <PenLineIcon size={15} /> Sửa
                </Button>
            ) : (
                <Button
                    type="button"
                    variant="destructive"
                    className="gap-2"
                    onClick={handleDeleteDetail}
                >
                    <TrashIcon size={15} /> Xóa
                </Button>
            )}
        </div>
    );
}
