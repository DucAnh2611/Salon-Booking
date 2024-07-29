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
import { IEmployee } from "@/interface/api/employee.interface";
import { PencilLineIcon } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface IUpdateEmployeeDialogProps {
    employee: IEmployee;
}

export default function UpdateEmployeeDialog({
    employee,
}: IUpdateEmployeeDialogProps) {
    const navigate = useNavigate();
    const [open, SetOpen] = useState<boolean>(false);

    const handleConfirm = () => {
        navigate(`${ROUTER_PATH.EMPLOYEE}/${employee.id}`);
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
                    <DialogTitle>
                        Chuyển tới trang cập nhật nhân viên
                    </DialogTitle>
                    <DialogDescription>
                        Một số thông tin cần được cân nhắc khi cập nhật do có
                        ảnh hưởng tới thông tin hiển thị của các thông tin khác.
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
