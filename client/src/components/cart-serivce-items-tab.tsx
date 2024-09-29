import useCartService from "@/hook/useCartService.hook";
import { IServiceItemCart } from "@/interface/service.interface";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Trash } from "lucide-react";
import CartServiceItem from "./cart-service-item";
import DialogDeleteItemServiceCart from "./dialog-delete-item-service-cart";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

export default function CartServiceItemTab() {
    const { selectItems, cart, setSelectItems } = useCartService();

    if (!cart) return <p>Giở hàng trống</p>;

    const handleSelectItems =
        (item: IServiceItemCart) => (check: CheckedState) => {
            setSelectItems(
                !check
                    ? selectItems.filter((i) => i.id !== item.id)
                    : [
                          ...selectItems,
                          {
                              ...item,
                              employee: null,
                              shift: null,
                              bookingTime: null,
                          },
                      ]
            );
        };

    const selectAll = (check: CheckedState) => {
        if (!cart.services.length) return;
        setSelectItems(check ? cart.services : []);
    };

    const isItemSelect = (i: IServiceItemCart) => {
        let isSelectedAll = false;
        for (const item of selectItems) {
            if (item.id === i.id) {
                isSelectedAll = true;
                break;
            }
        }
        return isSelectedAll;
    };

    const isSelectAll = () => {
        if (
            selectItems.length !== cart.services.length ||
            !cart.services.length
        )
            return false;

        let isSelectedAll = true;
        for (const item of selectItems) {
            if (!cart.services.find((i) => i.id === item.id)) {
                isSelectedAll = false;
                break;
            }
        }

        return isSelectedAll;
    };

    return (
        <div className="w-full h-fit relative">
            <div className="flex gap-2 w-full box-border py-4">
                <Checkbox
                    id="select-all-cart-product"
                    checked={isSelectAll()}
                    onCheckedChange={selectAll}
                />
                <Label htmlFor="select-all-cart-product">Chọn tất cả</Label>
            </div>
            <div className="flex flex-col w-full h-fit gap-2">
                {cart.services.map((serviceItem) => (
                    <div key={serviceItem.id} className="border">
                        <div className="flex justify-between w-full border-b p-2 box-border">
                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    id={serviceItem.id}
                                    checked={isItemSelect(serviceItem)}
                                    onCheckedChange={handleSelectItems(
                                        serviceItem
                                    )}
                                />
                                <Label htmlFor={serviceItem.id}>
                                    {serviceItem.service.name}
                                </Label>
                            </div>
                            <div>
                                <DialogDeleteItemServiceCart
                                    trigger={
                                        <Button
                                            className="gap-2 "
                                            variant="destructive"
                                        >
                                            <Trash size={15} /> Xóa
                                        </Button>
                                    }
                                    item={serviceItem}
                                />
                            </div>
                        </div>
                        <div>
                            <CartServiceItem serviceItem={serviceItem} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
