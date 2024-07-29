import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { deleteMediaApi } from "@/lib/redux/actions/media.action";
import { mediaSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LoaderCircleIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface IDeleteMediaDialogProps {
    id: string;
}

export default function DeleteMediaDialog({ id }: IDeleteMediaDialogProps) {
    const [open, SetOpen] = useState<boolean>(false);
    const { isDeleting, isFailure } = useAppSelector(mediaSelector);
    const dispatch = useAppDispatch();

    const handleDelete = () => {
        dispatch(deleteMediaApi([id]));
    };

    useEffect(() => {
        if (!isFailure && !isDeleting) {
            SetOpen(false);
        }
    }, [isDeleting, isFailure]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button className="flex-1 gap-2" variant="destructive">
                    <TrashIcon size={15} />
                    <p>Xóa</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xóa file phương tiện?</DialogTitle>
                    <DialogDescription>
                        Xóa file phương tiện sẽ làm thay đổi các thông tin khác
                        có sử dụng file phương tiện này.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="w-full flex gap-2">
                        <Button
                            className="flex-1"
                            variant="outline"
                            onClick={() => SetOpen(false)}
                            disabled={isDeleting}
                        >
                            Hủy
                        </Button>
                        <Button
                            className="flex-1 gap-1"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting && (
                                <LoaderCircleIcon
                                    size={15}
                                    className="animate-spin"
                                />
                            )}
                            Xác nhận
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
