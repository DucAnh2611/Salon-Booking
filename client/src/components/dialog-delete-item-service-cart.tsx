import useCartService from "@/hook/useCartService.hook";
import { IServiceItemCart } from "@/interface/service.interface";
import { deleteServiceCart } from "@/lib/actions/cart.action";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { ReactNode, useState } from "react";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "./ui/dialog";
import { toast } from "./ui/use-toast";

interface IDialogDeleteItemServiceCartProps {
    item: IServiceItemCart;
    trigger: ReactNode;
}

export default function DialogDeleteItemServiceCart({
    trigger,
    item,
}: IDialogDeleteItemServiceCartProps) {
    const { selectItems, cart, setCart, setSelectItems } = useCartService();
    const [open, SetOpen] = useState<boolean>(false);

    const handleDelete = async () => {
        const { error } = await deleteServiceCart(item.id);

        if (!error) {
            setSelectItems(selectItems.filter((i) => i.id !== item.id));
            if (cart)
                setCart({
                    ...cart,
                    services: cart.services.filter((i) => i.id !== item.id),
                });
            toast({
                title: "Xóa thành công",
                description: "Đã xóa dịch vụ khỏi giỏ hàng",
            });
            SetOpen(false);
        } else {
            toast({
                title: "Xóa thất bại",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Xóa dịch vụ {item.service.name}</DialogTitle>
                    <DialogDescription>
                        Sau khi xóa, dịch vụ sẽ được loại bỏ ra khỏi giỏ hàng
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <div className="flex gap-2 w-full justify-end">
                        <Button
                            variant="outline"
                            onClick={() => {
                                SetOpen(false);
                            }}
                        >
                            Hủy
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Xóa
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
