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
import { ROUTER_PATH } from "@/constants/router.constant";
import { IRole } from "@/interface/api/role.interface";
import { PencilLineIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface IUpdateRoleDialogProps {
    role: IRole;
}

export default function UpdateRoleDialog({ role }: IUpdateRoleDialogProps) {
    const navigate = useNavigate();
    const [open, SetOpen] = useState<boolean>(false);

    const handleConfirm = () => {
        navigate(`${ROUTER_PATH.ROLE}/${role.id}`);
    };

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger className="w-full" asChild>
                <Button
                    className="gap-2 w-full justify-start px-2"
                    variant="ghost"
                >
                    <PencilLineIcon size={13} />
                    Sửa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chuyển tới trang cập nhật chức vụ</DialogTitle>
                    <DialogDescription>
                        Chức vụ được gắn với các quyền hạn giúp truy cập vào các
                        nguồn tài nguyên của trang.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={(e) => {
                            SetOpen(false);
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        className="gap-1"
                        onClick={handleConfirm}
                    >
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
