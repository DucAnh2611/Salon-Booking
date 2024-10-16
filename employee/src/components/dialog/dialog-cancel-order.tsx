import { REASON_CANCEL_ORDER } from "@/constants/order.constant";
import { IApiCancelKeepFeeOrder } from "@/interface/api/order-state.interface";
import { ICancelRefundReason } from "@/interface/cancel-reason.interface";
import { cancelKeepFee } from "@/lib/redux/actions/order-state.action";
import { orderStateSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { cancelOrderSchema } from "@/schemas/order-state.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RequireField from "../require-field";
import SelectCancelRefundReason from "../select/select-reason";
import TextareaCharCounter from "../textarea-char-count";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Separator } from "../ui/separator";

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
    const { isFailure, isUpdating } = useAppSelector(orderStateSelector);
    const dispatch = useAppDispatch();

    const [open, SetOpen] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [selectedReason, SetSelectedReason] =
        useState<ICancelRefundReason | null>(null);

    const form = useForm<z.infer<typeof cancelOrderSchema>>({
        defaultValues: {
            orderId: "",
            reason: "",
        },
        resolver: zodResolver(cancelOrderSchema),
    });

    const handleSelectReason = (reason: ICancelRefundReason | null) => {
        SetSelectedReason(reason);
        if (
            reason &&
            reason.id !== REASON_CANCEL_ORDER[REASON_CANCEL_ORDER.length - 1].id
        ) {
            form.setValue("reason", reason.value);
        } else {
            form.setValue("reason", "");
        }
        form.clearErrors("reason");
    };

    const handleSubmit = () => {
        SetSubmit(true);
        const formData = form.getValues();

        const body: IApiCancelKeepFeeOrder = {
            ...formData,
        };

        dispatch(cancelKeepFee(body));
    };

    const handleOpen = (open: boolean) => {
        if (open) {
            form.reset();
            form.setValue("orderId", orderId);
            SetSubmit(false);
            SetSelectedReason(null);
        }
        SetOpen(open);
    };

    useEffect(() => {
        if (submit && !isUpdating && !isFailure) {
            handleOpen(false);
            onSuccess();
        }
        if (submit && isFailure && !isUpdating) {
            SetSubmit(false);
        }
    }, [isUpdating, submit, isFailure]);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hủy đơn</DialogTitle>
                    <DialogDescription>
                        Khi hủy đơn giữ phí, nếu khách hàng đã thanh toán, không
                        thể hoàn tiền.
                    </DialogDescription>
                </DialogHeader>
                <Separator orientation="horizontal" />
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="reason"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Lí do hủy đơn
                                                <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <div className="flex flex-col gap-2">
                                                    <SelectCancelRefundReason
                                                        onSelect={
                                                            handleSelectReason
                                                        }
                                                        value={selectedReason}
                                                        reasons={
                                                            REASON_CANCEL_ORDER
                                                        }
                                                    />
                                                    {selectedReason &&
                                                        selectedReason.id ===
                                                            REASON_CANCEL_ORDER[
                                                                REASON_CANCEL_ORDER.length -
                                                                    1
                                                            ].id && (
                                                            <TextareaCharCounter
                                                                maxLength={150}
                                                                placeholder="Chi tiết"
                                                                {...field}
                                                                className="h-[100px] resize-none w-full"
                                                            />
                                                        )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="mt-3">
                                <div className="flex w-full justify-end gap-2">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            handleOpen(false);
                                        }}
                                        type="button"
                                    >
                                        Hủy
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="gap-2 items-center"
                                    >
                                        {isUpdating && (
                                            <LoaderCircle
                                                size={15}
                                                className="animate-spin"
                                            />
                                        )}
                                        Hủy đơn
                                    </Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
