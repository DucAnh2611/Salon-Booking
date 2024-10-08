import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "@/components/ui/dialog";
import { IOrganization } from "@/interface/api/organization.interface";
import { organizationDelete } from "@/lib/redux/actions/organization.action";
import { categorySelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { LoaderCircleIcon, Trash2Icon } from "lucide-react";
import { useState } from "react";

interface IDeletOrganizationDialogProps {
    item: IOrganization;
}

export default function DeleteOrganizationDialog({
    item,
}: IDeletOrganizationDialogProps) {
    const { isDeleting, isFailure } = useAppSelector(categorySelector);
    const dispatch = useAppDispatch();
    const [open, SetOpen] = useState<boolean>(false);

    const handleDelete = () => {
        dispatch(organizationDelete(item.id));
    };

    return (
        <Dialog open={open} onOpenChange={SetOpen}>
            <DialogTrigger asChild>
                <Button
                    className="gap-2 w-full justify-start text-destructive px-2"
                    variant="ghost"
                >
                    <Trash2Icon size={13} />
                    Xóa
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>Xóa thông tin doanh nghiệp?</DialogHeader>
                <DialogDescription>
                    Xóa sản phẩm sẽ làm thay đổi các thông tin hiển thị trên
                    trang chủ mua sẵm và hóa đơn.
                </DialogDescription>

                <DialogFooter>
                    <Button
                        variant="outline"
                        disabled={isDeleting}
                        onClick={(e) => {
                            e.preventDefault();
                            SetOpen(false);
                        }}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="submit"
                        variant="destructive"
                        disabled={isDeleting}
                        className="gap-1"
                        onClick={handleDelete}
                    >
                        {isDeleting && (
                            <LoaderCircleIcon
                                size={15}
                                className="animate-spin"
                            />
                        )}
                        Xóa
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
