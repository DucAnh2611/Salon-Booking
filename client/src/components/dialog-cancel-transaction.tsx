import { IApiCancelTransaction } from "@/interface/transaction.interface";
import { cancelTransaction } from "@/lib/actions/transaction.action";
import { cancelTransactioncSchema } from "@/schema/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ReactNode, useState } from "react";
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

interface IDialogCancelTransactionProps {
    trigger: ReactNode;
    orderId: string;
    transactionId: string;
    onSuccess: () => void;
}

export default function DialogCancelTransaction({
    trigger,
    orderId,
    transactionId,
    onSuccess,
}: IDialogCancelTransactionProps) {
    const [open, SetOpen] = useState<boolean>(false);
    const [loading, SetLoading] = useState<boolean>(false);

    const form = useForm<z.infer<typeof cancelTransactioncSchema>>({
        defaultValues: {
            transactionId: "",
            note: "",
        },
        resolver: zodResolver(cancelTransactioncSchema),
    });

    const handleOpen = (open: boolean) => {
        if (open) {
            form.reset();
            form.setValue("transactionId", transactionId);
            SetOpen(false);
        }
        SetOpen(open);
    };

    const handleCancel = async () => {
        SetLoading(true);

        const formData = form.getValues();

        const body: IApiCancelTransaction = {
            ...formData,
        };

        const { response } = await cancelTransaction(orderId, body);

        if (response) {
            handleOpen(false);
            onSuccess();
            toast({
                title: "Thành công",
                description: "Hủy giao dịch thành công!",
            });
        } else {
            toast({
                title: "Thất bại",
                description: "Hủy giao dịch thất bại!",
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
                    <DialogTitle>Hủy giao dịch</DialogTitle>
                    <DialogDescription>
                        Xác nhận hủy giao dịch sẽ hoàn trả lại một phần các
                        khoản đã thanh toán.
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
                                                    <TextareaCharCounter
                                                        maxLength={150}
                                                        placeholder="Lý do"
                                                        className="w-full h-[150px] resize-none mt-2"
                                                        {...field}
                                                    />
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
                                                Hủy giao dịch
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
