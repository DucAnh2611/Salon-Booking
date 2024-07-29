import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ICategory } from "@/interface/api/category.interface";
import { deleteCategoryApi } from "@/lib/redux/actions/category.action";
import { categorySelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface IDeleteCategoryDialogProps {
    item: ICategory;
}

export default function DeleteCategoryDialog({
    item,
}: IDeleteCategoryDialogProps) {
    const { isDeleting, isFailure } = useAppSelector(categorySelector);
    const dispatch = useAppDispatch();
    const [open, SetOpen] = useState<boolean>(false);

    const handleDelete = () => {
        dispatch(deleteCategoryApi([item.id]));
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
                        Xóa danh mục <b>{item.title}</b>?
                    </div>
                </DialogHeader>
                <DialogDescription>
                    Xóa danh mục <b>{item.title}</b> sẽ làm thay đổi các danh
                    mục con của danh mục này.
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
                        Xóa <b>{item.title}</b>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
