import { CANCEL_ORDER_REASON } from "@/constant/cancel.constant";
import { ICancelOrderReason } from "@/interface/cancel.interface";
import { IApiCancelOrder } from "@/interface/order.interface";
import { cancelOrder } from "@/lib/actions/order.action";
import { cancelOrderSchema } from "@/schema/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RequireField from "./required-field";
import SelectCancelOrderReason from "./select-cancel-order";
import TextareaCharCounter from "./textarea-char-count";
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
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";

interface IDialogCancelOrderProps {
    trigger: ReactNode;
    orderId: string;
    onSuccess: () => void;
}

export default function DialogCancelOrder({
    trigger,
    orderId,
    onSuccess,
}: IDialogCancelOrderProps) {
    const [open, SetOpen] = useState<boolean>(false);
    const [loading, SetLoading] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [selectReason, SetSelectReason] = useState<ICancelOrderReason | null>(
        null
    );
    const [valueChange, SetValueChange] = useState<any>("");

    const form = useForm<z.infer<typeof cancelOrderSchema>>({
        defaultValues: {
            orderId: "",
            reason: "",
        },
        resolver: zodResolver(cancelOrderSchema),
    });

    const handleSelectReason = (value: ICancelOrderReason | null) => {
        SetSelectReason(value);
        if (
            value &&
            value.id !== CANCEL_ORDER_REASON[CANCEL_ORDER_REASON.length - 1].id
        ) {
            SetValueChange(value.value);
        } else {
            SetValueChange("");
        }
    };

    const handleChangeReason = (e: ChangeEvent<HTMLTextAreaElement>) => {
        SetValueChange(e.target.value);
        form.setValue("reason", e.target.value);
    };

    const handleOpen = (open: boolean) => {
        if (open) {
            form.reset();
            form.setValue("orderId", orderId);
            SetSelectReason(null);
            SetOpen(false);
            SetValueChange("");
        }
        SetOpen(open);
    };

    const handleCancel = async () => {
        SetSubmit(true);
        SetLoading(true);

        const formData = form.getValues();

        const body: IApiCancelOrder = {
            ...formData,
        };

        const { response } = await cancelOrder(body);

        if (response) {
            handleOpen(false);
            onSuccess();
            toast({
                title: "Thành công",
                description: "Hủy đơn hàng thành công!",
            });
        } else {
            toast({
                title: "Thất bại",
                description: "Hủy đơn hàng thất bại!",
                variant: "destructive",
            });
        }
        SetLoading(false);
    };

    useEffect(() => {
        form.setValue("reason", valueChange);
    }, [valueChange]);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hủy đơn hàng</DialogTitle>
                    <DialogDescription>
                        Khi xác nhận hủy đơn hàng, bạn có thể yêu cầu hoàn lại
                        các khoản đã thanh toán.
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCancel)}>
                            <div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="reason"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Lý do
                                                    <RequireField />
                                                </FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <SelectCancelOrderReason
                                                            onSelect={
                                                                handleSelectReason
                                                            }
                                                            value={selectReason}
                                                        />
                                                        {selectReason &&
                                                            selectReason.id ==
                                                                CANCEL_ORDER_REASON[
                                                                    CANCEL_ORDER_REASON.length -
                                                                        1
                                                                ].id && (
                                                                <TextareaCharCounter
                                                                    maxLength={
                                                                        150
                                                                    }
                                                                    onChange={
                                                                        handleChangeReason
                                                                    }
                                                                    value={
                                                                        valueChange
                                                                    }
                                                                    placeholder="Lý do"
                                                                    className="w-full h-[150px] resize-none mt-2"
                                                                />
                                                            )}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <DialogFooter>
                                    <div className="w-full">
                                        <Separator
                                            orientation="horizontal"
                                            className="my-2"
                                        />
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
                                                variant="destructive"
                                                disabled={loading}
                                            >
                                                Hủy đơn
                                            </Button>
                                        </div>
                                    </div>
                                </DialogFooter>
                            </div>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
