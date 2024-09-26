import { receiveOrder } from "@/lib/actions/order.action";
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

interface IDialogReceiveOrderProps {
    orderId: string;
    trigger: ReactNode;
    onSuccess: () => void;
}

export default function DialogReceiveOrder({
    orderId,
    trigger,
    onSuccess,
}: IDialogReceiveOrderProps) {
    const [open, SetOpen] = useState<boolean>(false);
    const [loading, SetLoading] = useState<boolean>(false);

    const handleOpen = (open: boolean) => {
        if (open) {
        }
        SetOpen(open);
    };

    const onSubmit = async () => {
        SetLoading(true);

        const { response } = await receiveOrder(orderId);

        if (response) {
            handleOpen(false);
            onSuccess();

            toast({
                title: "Thành công",
                description: "Đã nhận hàng!",
            });
        } else {
            toast({
                title: "Thất bại",
                description: "Yêu cầu nhận hàng thất bại!",
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
                    <DialogTitle>Đã nhận hàng</DialogTitle>
                    <DialogDescription>Xác nhận đã nhận hàng</DialogDescription>
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
