import { returnOrder } from "@/lib/actions/order.action";
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

interface IDialogReturnOrderProps {
    orderId: string;
    trigger: ReactNode;
    onSuccess: () => void;
}

export default function DialogReturnOrder({
    orderId,
    trigger,
    onSuccess,
}: IDialogReturnOrderProps) {
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

        const { response } = await returnOrder(orderId);

        if (response) {
            handleOpen(false);
            onSuccess();

            toast({
                title: "Thành công",
                description: "Đã hoàn hàng!",
            });
        } else {
            toast({
                title: "Thất bại",
                description: "Hoàn hàng thất bại!",
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
                    <DialogTitle>Hoàn hàng</DialogTitle>
                    <DialogDescription>Xác nhận đã hoàn hàng</DialogDescription>
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
