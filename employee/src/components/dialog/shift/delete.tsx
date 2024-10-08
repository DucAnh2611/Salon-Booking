import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IShift } from "@/interface/api/shift.interface";
import { deleteShiftApi } from "@/lib/redux/actions/shift.action";
import { categorySelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface IDeleteShiftDialogProps {
    shift: IShift;
}

export default function DeleteShiftDialog({ shift }: IDeleteShiftDialogProps) {
    const { isDeleting, isFailure } = useAppSelector(categorySelector);
    const dispatch = useAppDispatch();
    const [open, SetOpen] = useState<boolean>(false);

    const handleDelete = () => {
        dispatch(deleteShiftApi(shift.id));
    };

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button className="gap-2 w-auto" variant="destructive">
                    <Trash2Icon size={13} />
                    Xóa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <div className="flex gap-1">Xóa ca làm?</div>
                </DialogHeader>
                <DialogDescription>
                    Xóa ca làm sẽ làm thay đổi các thông tin đơn đặt hàng, các
                    thông tin về nhân viên.
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
                        Xóa ca làm
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
