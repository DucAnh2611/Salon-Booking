import { receiveRefund } from "@/lib/actions/order.action";
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
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";

interface IDialogReceiveRefundProps {
    trigger: ReactNode;
    orderId: string;
    requestId: string;
    onSuccess: () => void;
}

export default function DialogReceiveRefund({
    trigger,
    orderId,
    requestId,
    onSuccess,
}: IDialogReceiveRefundProps) {
    const [open, SetOpen] = useState<boolean>(false);
    const [loading, SetLoading] = useState<boolean>(false);

    const handleOpen = (open: boolean) => {
        SetOpen(open);
    };

    const handleSubmit = async () => {
        SetLoading(true);

        const { response } = await receiveRefund(requestId);

        if (response) {
            handleOpen(false);
            onSuccess();
            toast({
                title: "Thành công",
                description: "Đã xác nhận hoàn tiền thành công!",
            });
        } else {
            toast({
                title: "Thất bại",
                description: "Xác nhận hoàn tiền thất bại!",
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
                    <DialogTitle>Xác nhận đã nhận</DialogTitle>
                    <DialogDescription>
                        Tôi xác nhận đã nhận đủ khoản tiền được chuyển.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="w-full">
                        <Separator orientation="horizontal" className="my-2" />
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
                                onClick={handleSubmit}
                            >
                                Đã nhận
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
