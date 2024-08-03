import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IService } from "@/interface/api/service.interface";
import { deleteServiceApi } from "@/lib/redux/actions/service.action";
import { categorySelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface IDeleteServiceDialogProps {
    service: IService;
}

export default function DeleteServiceDialog({
    service,
}: IDeleteServiceDialogProps) {
    const { isDeleting, isFailure } = useAppSelector(categorySelector);
    const dispatch = useAppDispatch();
    const [open, SetOpen] = useState<boolean>(false);

    const handleDelete = () => {
        dispatch(deleteServiceApi([service.id]));
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
                        Xóa dịch vụ <b>{service.name}</b>?
                    </div>
                </DialogHeader>
                <DialogDescription>
                    Xóa dịch vụ <b>{service.name}</b> sẽ làm thay đổi các sản
                    phẩm, kiểu mã của dịch vụ này.
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
                        Xóa <b>{service.name}</b>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
