"use client";

import useOrderTracking from "@/hook/useOrderTracking.hook";
import { IBank } from "@/interface/bank.interface";
import { IOrderDetail } from "@/interface/order.interface";
import { IRefundCreate } from "@/interface/refund.interface";
import { ITransactionOrder } from "@/interface/transaction.interface";
import { createRefundRequest } from "@/lib/actions/refund.action";
import { formatMoney } from "@/lib/money";
import { createRefundRequestSchema } from "@/schema/refund.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckedState } from "@radix-ui/react-checkbox";
import { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RequireField from "./required-field";
import SelectBanks from "./select-banks";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
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
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { toast } from "./ui/use-toast";

interface IDialogCreateRefundProps {
    trigger: ReactNode;
    order: IOrderDetail;
    transaction: ITransactionOrder;
    amount: number;
    onSuccess: () => void;
}

export default function DialogCreateRefund({
    trigger,
    order,
    amount,
    transaction,
    onSuccess,
}: IDialogCreateRefundProps) {
    const { reload } = useOrderTracking();
    const [open, SetOpen] = useState<boolean>(false);
    const [confirm, SetConfirm] = useState<boolean>(false);
    const [selected, SetSelected] = useState<IBank | null>(null);

    const form = useForm<z.infer<typeof createRefundRequestSchema>>({
        defaultValues: {
            amount: 0,
            bankAccount: "",
            bankBin: "",
            bankName: "",
            desc: "",
        },
        resolver: zodResolver(createRefundRequestSchema),
    });

    const handleConfirm = (confirm: CheckedState) => {
        SetConfirm(Boolean(confirm));
    };

    const onSelectBank = (bank: IBank | null) => {
        SetSelected(bank);

        form.setValue("bankBin", bank ? bank.bin : "");
        form.setValue("bankName", "");
        form.setValue("bankAccount", "");
    };

    const test = () => {
        console.log(form.getValues());
    };

    const onSubmit = async () => {
        if (!confirm) return;
        const { amount, bankAccount, bankBin, bankName, desc } =
            form.getValues();

        const body: IRefundCreate = {
            accountBankBin: bankBin.toString(),
            accountName: bankName,
            accountNumber: bankAccount,
            amount: amount,
            note: desc || `HOAN TIEN DON HANG ${order.code}`,
            orderId: order.id,
            transactionId: transaction.id,
        };

        const { response, error } = await createRefundRequest(body);

        if (response) {
            reload("refund");
            onSuccess();
            handleOpen(false);
        } else {
            toast({
                title: "Thất bại",
                description: error?.message,
                variant: "destructive",
            });
        }
    };

    const handleOpen = (open: boolean) => {
        if (!open) {
            SetSelected(null);
            form.reset();
        } else {
            form.setValue("desc", `HOAN TIEN DON HANG ${order.code}`);
            form.setValue("amount", amount);
            SetConfirm(false);
        }
        SetOpen(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>

            <DialogContent className="max-w-none w-fit">
                <div className="w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Tạo yêu cầu hoàn tiền</DialogTitle>
                        <DialogDescription>
                            Yêu cầu hoàn tiền sẽ được tạo cho hóa đơn
                            <b className="text-primary mx-2">{order.code}</b>
                            giao dịch số
                            <b className="text-primary uppercase mx-2">
                                {transaction.paymentId}
                            </b>
                        </DialogDescription>
                    </DialogHeader>
                    <div>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="bankBin"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Chọn ngân hàng
                                                    <RequireField />
                                                </FormLabel>
                                                <FormControl>
                                                    <div>
                                                        <SelectBanks
                                                            onSelect={
                                                                onSelectBank
                                                            }
                                                            value={selected}
                                                        />
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {selected && (
                                        <>
                                            <FormField
                                                control={form.control}
                                                name="bankAccount"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Số tài khoản
                                                            <RequireField />
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Số tài khoản"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="bankName"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Tên tài khoản
                                                            <RequireField />
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Tên tài khoản"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="desc"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>
                                                            Mô tả
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Mô tả"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </>
                                    )}
                                </div>
                                <DialogFooter className="mt-5">
                                    <div>
                                        <div className="w-full flex gap-3">
                                            <Checkbox
                                                id="confirm"
                                                checked={confirm}
                                                onCheckedChange={handleConfirm}
                                            />
                                            <Label htmlFor="confirm">
                                                Bằng việc gửi yêu cầu, tôi{" "}
                                                <b className="text-primary">
                                                    xác nhận
                                                </b>{" "}
                                                thông tin ngân hàng của mình là
                                                chính xác.
                                            </Label>
                                        </div>
                                        <Separator
                                            orientation="horizontal"
                                            className="my-2"
                                        />
                                        <div className="flex w-full justify-end gap-2 items-center">
                                            <div className="flex-1">
                                                <span className="font-medium mr-3">
                                                    Số tiền hoàn
                                                </span>
                                                <span>
                                                    {formatMoney(amount)}
                                                </span>
                                            </div>
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
                                                disabled={!confirm}
                                                onClick={test}
                                            >
                                                Gửi yêu cầu
                                            </Button>
                                        </div>
                                    </div>
                                </DialogFooter>
                            </form>
                        </Form>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
