import { REASON_CANCEL_REFUND } from "@/constants/order.constant";
import { IApiDeclineRefund } from "@/interface/api/refund.interface";
import { ICancelRefundReason } from "@/interface/cancel-reason.interface";
import { declineOrderRefund } from "@/lib/redux/actions/order-refund.action";
import { orderRefundSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { declineRefundRequestSchema } from "@/schemas/order-refund.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectCancelRefundReason from "../select/select-reason";
import TextareaCharCounter from "../textarea-char-count";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
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

interface IDialogDeclineRefundProps {
    trigger: ReactNode;
    requestId: string;
    onSuccess: () => void;
}

export default function DialogDeclineRefund({
    trigger,
    requestId,
    onSuccess,
}: IDialogDeclineRefundProps) {
    const { isDeclining, isFailure } = useAppSelector(orderRefundSelector);
    const dispatch = useAppDispatch();

    const [open, SetOpen] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [selectedReason, SetSelectedReason] =
        useState<ICancelRefundReason | null>(null);

    const form = useForm<z.infer<typeof declineRefundRequestSchema>>({
        defaultValues: {
            requestId: "",
            note: "",
        },
        resolver: zodResolver(declineRefundRequestSchema),
    });

    const handleSelectReason = (reason: ICancelRefundReason | null) => {
        SetSelectedReason(reason);
        if (
            reason &&
            reason.id !==
                REASON_CANCEL_REFUND[REASON_CANCEL_REFUND.length - 1].id
        ) {
            form.setValue("note", reason.value);
        } else {
            form.setValue("note", "");
        }
    };

    const handleSubmit = () => {
        SetSubmit(true);
        const formData = form.getValues();

        const body: IApiDeclineRefund = {
            ...formData,
        };

        dispatch(declineOrderRefund(body));
    };

    const handleOpen = (open: boolean) => {
        if (open) {
            form.reset();
            form.setValue("requestId", requestId);
            SetSubmit(false);
            SetSelectedReason(null);
        }
        SetOpen(open);
    };

    useEffect(() => {
        if (submit && !isDeclining && !isFailure) {
            handleOpen(false);
            onSuccess();
        }
        if (submit && isFailure && !isDeclining) {
            SetSubmit(false);
        }
    }, [isDeclining, submit, isFailure]);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Từ chối hoàn tiền</DialogTitle>
                </DialogHeader>
                <Separator orientation="horizontal" />
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div>
                                <FormField
                                    control={form.control}
                                    name="note"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Lí do từ chối</FormLabel>
                                            <FormControl>
                                                <div className="flex flex-col gap-2">
                                                    <SelectCancelRefundReason
                                                        onSelect={
                                                            handleSelectReason
                                                        }
                                                        value={selectedReason}
                                                    />
                                                    {selectedReason &&
                                                        selectedReason.id ===
                                                            REASON_CANCEL_REFUND[
                                                                REASON_CANCEL_REFUND.length -
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
                                        disabled={isDeclining}
                                        className="gap-2 items-center"
                                    >
                                        {isDeclining && (
                                            <LoaderCircle
                                                size={15}
                                                className="animate-spin"
                                            />
                                        )}
                                        Từ chối
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
