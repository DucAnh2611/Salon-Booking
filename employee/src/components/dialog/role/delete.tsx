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
import { IRole, IRoleDetail } from "@/interface/api/role.interface";
import { deleteRoleApi } from "@/lib/redux/actions/role.action";
import { categorySelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LoaderCircleIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface DeleteRoleDialogProps {
    item: IRoleDetail | IRole;
    trigger: ReactNode;
}

export default function DeleteRoleDialog({
    item,
    trigger,
}: DeleteRoleDialogProps) {
    const { isDeleting, isFailure } = useAppSelector(categorySelector);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [open, SetOpen] = useState<boolean>(false);
    const [reload, SetReload] = useState<boolean>(false);

    const handleDelete = () => {
        SetReload(true);
        dispatch(deleteRoleApi([item.id]));
    };

    useEffect(() => {
        if (!isFailure && !isDeleting && reload) {
            navigate(ROUTER_PATH.ROLE);
        }
    }, [isFailure, isDeleting, reload]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <div className="flex gap-1">
                        Xóa chức vụ<b>{item.title}</b>?
                    </div>
                </DialogHeader>
                <DialogDescription>
                    Xóa chức vụ <b>{item.title}</b> sẽ làm thay đổi các chức vụ
                    con của chức vụ này và các nhân viên được gắn chức vụ.
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
