import { confirmOrder } from "@/lib/actions/order.action";
import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";
import { toast } from "./ui/use-toast";

interface IDialogConfirmOrderProps {
    orderId: string;
    trigger: ReactNode;
    onSuccess: () => void;
}

export default function DialogConfirmOrder({
    orderId,
    trigger,
    onSuccess,
}: IDialogConfirmOrderProps) {
    const [open, SetOpen] = useState<boolean>(false);
    const [loading, SetLoading] = useState<boolean>(false);

    const handleOpen = (open: boolean) => {
        if (open) {
            SetOpen(false);
        }
        SetOpen(open);
    };

    const onSubmit = async () => {
        SetLoading(true);

        const { response } = await confirmOrder(orderId);

        if (response) {
            handleOpen(false);
            onSuccess();

            toast({
                title: "Thành công",
                description: "Đã xác nhận!",
            });
        } else {
            toast({
                title: "Thất bại",
                description: "Xác nhận thất bại!",
                variant: "destructive",
            });
        }

        SetLoading(false);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xác nhận đơn hàng</DialogTitle>
                    <DialogDescription>
                        Xác nhận đơn hàng dịch vụ
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="w-full">
                        <div className="flex w-full justify-end gap-2 items-center">
                            <Button
                                variant="outline"
                                type="button"
                                onClick={() => {
                                    handleOpen(false);
                                }}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                onClick={onSubmit}
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
