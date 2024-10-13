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
import { settingGet, settingReset } from "@/lib/redux/actions/setting.action";
import { settingSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LoaderCircleIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { toast } from "../ui/use-toast";

interface IResetSettingDialogProps {
    trigger: ReactNode;
}

export default function ResetSettingDialog({
    trigger,
}: IResetSettingDialogProps) {
    const { isReseting, isFailure } = useAppSelector(settingSelector);
    const dispatch = useAppDispatch();

    const [open, SetOpen] = useState<boolean>(false);
    const [reload, SetReload] = useState<boolean>(false);

    const submit = () => {
        SetReload(true);
        dispatch(settingReset());
    };

    useEffect(() => {
        if (!isFailure && !isReseting && reload) {
            SetOpen(false);
            SetReload(false);

            dispatch(settingGet());

            toast({
                title: "Thành công",
                description: "Đặt lại thành công",
            });
        }
    }, [isFailure, isReseting, reload]);

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Đặt lại?</DialogTitle>
                </DialogHeader>
                <DialogDescription>
                    Khi đặt lại các giá trị mới sẽ được sử dụng từ lúc đặt lại
                    thành công, các giá trị cũ vẫn sẽ được áp dụng tại những
                    phần đã sử dụng.
                </DialogDescription>

                <DialogFooter>
                    <Button
                        variant="outline"
                        disabled={isReseting}
                        onClick={(e) => {
                            e.preventDefault();
                            SetOpen(false);
                            SetReload(false);
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        disabled={isReseting}
                        className="gap-1"
                        onClick={submit}
                    >
                        {isReseting && (
                            <LoaderCircleIcon
                                size={15}
                                className="animate-spin"
                            />
                        )}
                        Xác nhận
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
