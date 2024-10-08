import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ROUTER_PATH } from "@/constants/router.constant";
import { IEmployee } from "@/interface/api/employee.interface";
import { deleteEmployeeApi } from "@/lib/redux/actions/employee.action";
import { employeeSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface DeleteEmployeeDialogProps {
    item: IEmployee;
}

export default function DeleteEmployeeDialog({
    item,
}: DeleteEmployeeDialogProps) {
    const { isDeleting, isFailure } = useAppSelector(employeeSelector);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [open, SetOpen] = useState<boolean>(false);
    const [reload, SetReload] = useState<boolean>(false);

    const handleDelete = () => {
        SetReload(true);
        dispatch(deleteEmployeeApi([item.id]));
    };

    useEffect(() => {
        if (!isFailure && !isDeleting && reload) {
            navigate(ROUTER_PATH.EMPLOYEE);
        }
    }, [isFailure, isDeleting, reload]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button
                    className="gap-2 items-center w-full justify-start px-2 text-destructive"
                    variant="ghost"
                >
                    <Trash2Icon size={15} /> Xóa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <div className="flex gap-1">Xóa nhân viên?</div>
                </DialogHeader>
                <DialogDescription>
                    Xóa nhân viên sẽ làm thay đổi một số thông tin hiển thị liên
                    quan tới nhân viên này.
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
