import { EOrderStatus, EOrderType } from "@/enum/order.enum";
import { IApiUpdateOrderState } from "@/interface/api/order-state.interface";
import { reloadOrderState } from "@/lib/redux/actions/order-detail.action";
import { updateOrderState } from "@/lib/redux/actions/order-state.action";
import { orderStateSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { addOrderStateSchema } from "@/schemas/order-state.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RequireField from "../require-field";
import SelectOrderStatus from "../select/select-order-state";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
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
import { Textarea } from "../ui/textarea";

interface IDialogAddOrderStateProps {
    trigger: ReactNode;
    orderId: string;
    type: EOrderType;
}

export default function DialogAddOrderState({
    trigger,
    orderId,
    type,
}: IDialogAddOrderStateProps) {
    const dispatch = useAppDispatch();
    const { isUpdating, isFailure } = useAppSelector(orderStateSelector);

    const [open, SetOpen] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [selectedState, SetSelectedState] = useState<
        EOrderStatus | undefined
    >(undefined);

    const form = useForm<z.infer<typeof addOrderStateSchema>>({
        defaultValues: {
            orderId: "",
            state: undefined,
            description: "",
        },
        resolver: zodResolver(addOrderStateSchema),
    });

    const handleChangeState = (state: EOrderStatus | undefined) => {
        SetSelectedState(state);
        if (state) {
            form.setValue("state", state);
        }
    };

    const handleSubmit = () => {
        const formData = form.getValues();

        const body: IApiUpdateOrderState = { ...formData };
        SetSubmit(true);

        dispatch(updateOrderState(body));
    };

    const handleOpen = (open: boolean) => {
        if (open) {
            form.reset();
            form.setValue("orderId", orderId);
            SetSelectedState(undefined);
            SetSubmit(false);
        }
        SetOpen(open);
    };

    useEffect(() => {
        if (submit && !isFailure && !isUpdating) {
            dispatch(reloadOrderState());
            SetOpen(false);
        }
    }, [isUpdating, isFailure, submit]);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Thêm trạng thái cho đơn hàng</DialogTitle>
                    <DialogDescription>
                        Cập nhật trạng thái cho đơn hàng và khách hàng có thể
                        cập nhật thông tin về đơn hàng của họ
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div>
                                <FormField
                                    name="state"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Trạng thái
                                                <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <SelectOrderStatus
                                                    onSelect={handleChangeState}
                                                    type={type}
                                                    value={selectedState}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="description"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ghi chú</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Ghi chú"
                                                    {...field}
                                                    className="w-full h-[200px] resize-none"
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="mt-3">
                                <div className="flex w-full justify-end gap-3">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            handleOpen(false);
                                        }}
                                        type="button"
                                    >
                                        Hủy
                                    </Button>
                                    <Button type="submit">Thêm</Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
