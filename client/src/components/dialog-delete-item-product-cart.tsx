import useCartProduct from "@/hook/useCartProduct.hook";
import { IProductItemCart } from "@/interface/product.interface";
import { deleteProductCart } from "@/lib/actions/cart.action";
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

interface IDialogDeleteItemProductCartProps {
    item: IProductItemCart;
    trigger: ReactNode;
}

export default function DialogDeleteItemProductCart({
    trigger,
    item,
}: IDialogDeleteItemProductCartProps) {
    const { selectItems, cart, setCart, setSelectItems, getCount } =
        useCartProduct();
    const [open, SetOpen] = useState<boolean>(false);

    const handleDelete = async () => {
        const { error } = await deleteProductCart(item.id);

        if (!error) {
            setSelectItems(selectItems.filter((i) => i.id !== item.id));
            if (cart)
                setCart({
                    ...cart,
                    products: cart.products.filter((i) => i.id !== item.id),
                });
            toast({
                title: "Xóa thành công",
                description: "Đã xóa sản phẩm khỏi giỏ hàng",
            });
            SetOpen(false);
            getCount();
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
                    <DialogTitle>Xóa sản phẩm {item.product.name}</DialogTitle>
                    <DialogDescription>
                        Sau khi xóa, sản phẩm sẽ được loại bỏ ra khỏi giỏ hàng
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
