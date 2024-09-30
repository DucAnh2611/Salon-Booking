import useCartProductContact from "@/hook/useCartProductContact.hook";
import useProvince from "@/hook/useProvince.hook";
import { ReactNode, useState } from "react";
import ProvinceGroup from "./province-group";
import { Button } from "./ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./ui/dialog";

interface IDialogSelectProvinceProps {
    trigger: ReactNode;
}

export default function DialogSelectProvince({
    trigger,
}: IDialogSelectProvinceProps) {
    const {
        province: { selected: pSelected },
        district: { selected: dSelected },
        ward: { selected: wSelected },
        street,
    } = useProvince();
    const { setContact, contact } = useCartProductContact();
    const [open, SetOpen] = useState<boolean>(false);

    const handleCancel = () => {
        SetOpen(false);
    };

    const handleConfirm = () => {
        if (pSelected && dSelected && wSelected && street) {
            SetOpen(false);
            setContact({
                ...contact,
                address: {
                    province: pSelected,
                    district: dSelected,
                    ward: wSelected,
                    street: street,
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-none w-fit">
                <div className="w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Chọn địa chỉ</DialogTitle>
                    </DialogHeader>
                    <div className="w-full">
                        <ProvinceGroup />
                    </div>
                    <DialogFooter className="mt-5">
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={handleCancel}>
                                Hủy
                            </Button>
                            <Button
                                onClick={handleConfirm}
                                disabled={
                                    !(
                                        pSelected &&
                                        dSelected &&
                                        wSelected &&
                                        street
                                    )
                                }
                            >
                                Xác nhận địa chỉ
                            </Button>
                        </div>
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
