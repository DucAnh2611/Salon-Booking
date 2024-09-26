import { IApiCancelRefund } from "@/interface/order.interface";
import { cancelRefund } from "@/lib/actions/order.action";
import { cancelRefundSchema } from "@/schema/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChangeEvent, ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RequireField from "./required-field";
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

interface IDialogCancelRefundProps {
    trigger: ReactNode;
    orderId: string;
    requestId: string;
    onSuccess: () => void;
}

export default function DialogCancelRefund({
    trigger,
    orderId,
    requestId,
    onSuccess,
}: IDialogCancelRefundProps) {
    const [open, SetOpen] = useState<boolean>(false);
    const [loading, SetLoading] = useState<boolean>(false);
    const [valueChange, SetValueChange] = useState<any>("");

    const form = useForm<z.infer<typeof cancelRefundSchema>>({
        defaultValues: {
            orderId: "",
            requestId: "",
            note: "",
        },
        resolver: zodResolver(cancelRefundSchema),
    });
    const handleChangeReason = (e: ChangeEvent<HTMLTextAreaElement>) => {
        SetValueChange(e.target.value);
    };

    const handleOpen = (open: boolean) => {
        if (open) {
            form.reset();
            form.setValue("orderId", orderId);
            form.setValue("requestId", requestId);
            SetOpen(false);
            SetValueChange("");
        }
        SetOpen(open);
    };

    const handleCancel = async () => {
        SetLoading(true);

        const formData = form.getValues();

        const body: IApiCancelRefund = {
            ...formData,
        };

        const { response } = await cancelRefund(body);

        if (response) {
            handleOpen(false);
            onSuccess();
            toast({
                title: "Thành công",
                description: "Hủy yêu cầu hoàn tiền thành công!",
            });
        } else {
            toast({
                title: "Thất bại",
                description: "Hủy yêu cầu hoàn tiền thất bại!",
                variant: "destructive",
            });
        }
        SetLoading(false);
    };

    useEffect(() => {
        form.setValue("note", valueChange);
    }, [valueChange]);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Hủy yêu cầu hoàn tiền</DialogTitle>
                    <DialogDescription>
                        Khi hủy yêu cầu hoàn tiền, bạn có thể tạo mới một yêu
                        cầu khác
                    </DialogDescription>
                </DialogHeader>
                <div className="w-full">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleCancel)}>
                            <div>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="note"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Lý do
                                                    <RequireField />
                                                </FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <TextareaCharCounter
                                                            maxLength={150}
                                                            onChange={
                                                                handleChangeReason
                                                            }
                                                            value={valueChange}
                                                            placeholder="Lý do"
                                                            className="w-full h-[150px] resize-none mt-2"
                                                        />
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
