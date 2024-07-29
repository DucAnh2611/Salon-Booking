import RequireField from "@/components/require-field";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ZOD_MESSAGE } from "@/constants/zod.constant";
import { IEmployee } from "@/interface/api/employee.interface";
import { resetEmployeePwApi } from "@/lib/redux/actions/employee.action";
import { employeeSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LockIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";

interface IUpdateEmployeeDialogProps {
    employee: IEmployee;
}

export default function ResetPasswordEmployeeDialog({
    employee,
}: IUpdateEmployeeDialogProps) {
    const dispatch = useAppDispatch();
    const { isUpdating, isFailure } = useAppSelector(employeeSelector);
    const [open, SetOpen] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [password, SetPassword] = useState<string>("");
    const [err, SetErr] = useState<string>("");

    const reset = () => {
        SetErr("");
        SetPassword("");
    };

    const handleClick = () => {
        reset();
    };

    const handleConfirm = () => {
        if (password.length < 1) {
            SetErr(ZOD_MESSAGE.min(1, "Mật khẩu cấp lại"));
        } else if (password.length > 21) {
            SetErr(ZOD_MESSAGE.max(20, "Mật khẩu cấp lại"));
        } else {
            SetSubmit(true);
            dispatch(resetEmployeePwApi(employee.id, password));
        }
    };

    const handleChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        SetPassword(e.target.value);
    };

    useEffect(() => {
        if (submit && !isFailure && !isUpdating) {
            SetSubmit(false);
            SetOpen(false);
        }
    }, [submit, isFailure, isUpdating]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger className="w-full" asChild>
                <Button
                    className="gap-2 w-full justify-start px-2"
                    variant="ghost"
                    onClick={handleClick}
                >
                    <LockIcon size={13} />
                    Cấp lại mật khẩu
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cấp lại mật khẩu cho nhân viên</DialogTitle>
                    <DialogDescription>
                        Mật khẩu được sử dụng để nhân viên đăng nhập vào trang
                        quản lý
                    </DialogDescription>
                </DialogHeader>

                <Separator orientation="horizontal" />

                <div className="flex flex-col gap-2">
                    <Label htmlFor="new-pass">
                        Mật khẩu mới <RequireField />
                    </Label>
                    <Input
                        id="new-pass"
                        placeholder="Nhập mật khẩu mới"
                        value={password}
                        onChange={handleChangePassword}
                    />
                    {err && <p className="text-destructive text-xs">{err}</p>}
                </div>

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
