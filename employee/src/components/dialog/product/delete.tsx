import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IProduct } from "@/interface/api/product.interface";
import { deleteProductApi } from "@/lib/redux/actions/product.action";
import { categorySelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface IDeleteProductDialogProps {
    product: IProduct;
}

export default function DeleteProductDialog({
    product,
}: IDeleteProductDialogProps) {
    const { isDeleting, isFailure } = useAppSelector(categorySelector);
    const dispatch = useAppDispatch();
    const [open, SetOpen] = useState<boolean>(false);

    const handleDelete = () => {
        dispatch(deleteProductApi([product.id]));
    };

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button
                    className="gap-2 w-full justify-start text-destructive px-2"
                    variant="ghost"
                >
                    <Trash2Icon size={13} />
                    Xóa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <div className="flex gap-1">
                        Xóa sản phẩm <b>{product.name}</b>?
                    </div>
                </DialogHeader>
                <DialogDescription>
                    Xóa sản phẩm <b>{product.name}</b> sẽ làm thay đổi các sản
                    phẩm, kiểu mã của sản phẩm này.
                </DialogDescription>

                <DialogFooter>
                    <Button
                        variant="outline"
                        disabled={isDeleting}
                        onClick={(e) => {
                            e.preventDefault();
                            SetOpen(false);
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="destructive"
                        disabled={isDeleting}
                        className="gap-1"
                        onClick={handleDelete}
                    >
                        {isDeleting && (
                            <LoaderCircleIcon
                                size={15}
                                className="animate-spin"
                            />
                        )}
                        Xóa <b>{product.name}</b>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
