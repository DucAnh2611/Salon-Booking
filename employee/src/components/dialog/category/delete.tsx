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
import { useEffect, useState } from "react";

interface IDeleteCategoryDialogProps {
    item: ICategory;
}

export default function DeleteCategoryDialog({
    item,
}: IDeleteCategoryDialogProps) {
    const { isDeleting, isFailure } = useAppSelector(categorySelector);
    const dispatch = useAppDispatch();
    const [open, SetOpen] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);

    const handleOpen = (open: boolean) => {
        if (open) {
            SetSubmit(false);
        }

        SetOpen(open);
    };

    const handleDelete = () => {
        SetSubmit(true);
        dispatch(deleteCategoryApi([item.id]));
    };

    useEffect(() => {
        if (submit && !isDeleting && !isFailure) {
            handleOpen(false);
        }
    }, [submit, isDeleting, isFailure]);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
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
                    <div className="flex gap-1">Xóa danh mục?</div>
                </DialogHeader>
                <DialogDescription>
                    Xóa danh mục sẽ làm thay đổi các danh mục con của danh mục
                    này.
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
                        Xóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
