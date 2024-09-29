import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
    IApiUpdateLockClient,
    IClientList,
} from "@/interface/api/client.interface";
import { cn } from "@/lib";
import {
    reloadClient,
    updateLockClient,
} from "@/lib/redux/actions/client.action";
import { orderStateSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { clientUpdateStateSchema } from "@/schemas/client.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Check, XIcon } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "../../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "../../ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../../ui/form";

interface IDialogUpdateLockClientProps {
    trigger: ReactNode;
    client: IClientList;
}

export default function DialogUpdateLockClient({
    trigger,
    client,
}: IDialogUpdateLockClientProps) {
    const dispatch = useAppDispatch();
    const { isUpdating, isFailure } = useAppSelector(orderStateSelector);

    const [open, SetOpen] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [lockAccount, SetLockAccount] = useState<boolean>(false);
    const [lockOrder, SetLockOrder] = useState<boolean>(false);

    const form = useForm<z.infer<typeof clientUpdateStateSchema>>({
        defaultValues: {
            clientId: "",
            lockAccount: false,
            lockOrder: false,
        },
        resolver: zodResolver(clientUpdateStateSchema),
    });

    const handleOpen = (open: boolean) => {
        if (open) {
            SetLockAccount(client.lockAccount);
            SetLockOrder(client.lockOrder);
            SetSubmit(false);

            form.setValue("clientId", client.id);
            form.setValue("lockAccount", client.lockAccount);
            form.setValue("lockOrder", client.lockOrder);
        }
        SetOpen(open);
    };

    const handleToggle =
        (key: keyof Pick<typeof client, "lockAccount" | "lockOrder">) => () => {
            switch (key) {
                case "lockAccount":
                    SetLockAccount((v) => {
                        form.setValue("lockAccount", !v);
                        return !v;
                    });
                    break;
                case "lockOrder":
                    SetLockOrder((v) => {
                        form.setValue("lockOrder", !v);
                        return !v;
                    });
                    break;
                default:
                    return;
            }
        };

    const handleSubmit = () => {
        const formData = form.getValues();

        const body: IApiUpdateLockClient = { ...formData, clientId: client.id };
        SetSubmit(true);

        dispatch(updateLockClient(body));
    };

    useEffect(() => {
        if (submit && !isFailure && !isUpdating) {
            dispatch(reloadClient());
            SetOpen(false);
        }
    }, [isUpdating, isFailure, submit]);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cập nhật trạng thái người dùng</DialogTitle>
                    <DialogDescription>
                        Cập nhật trạng thái giúp quản lý người dùng.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit)}>
                            <div>
                                <FormField
                                    name="lockAccount"
                                    control={form.control}
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Tài khoản</FormLabel>
                                            <FormControl>
                                                <div className="flex gap-1 justify-between items-center">
                                                    <Label
                                                        htmlFor=""
                                                        className="flex-1"
                                                    >
                                                        Trạng thái tài khoản
                                                    </Label>
                                                    <Toggle
                                                        variant="outline"
                                                        size="sm"
                                                        className={cn(
                                                            "gap-1 items-center",
                                                            !lockAccount
                                                                ? "border-green-500 text-green-500"
                                                                : "border-red-500 text-red-500"
                                                        )}
                                                        onClick={handleToggle(
                                                            "lockAccount"
                                                        )}
                                                        type="button"
                                                    >
                                                        {lockAccount ? (
                                                            <>
                                                                <XIcon
                                                                    size={15}
                                                                />{" "}
                                                                <span>
                                                                    Khóa
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Check
                                                                    size={15}
                                                                />{" "}
                                                                <span>
                                                                    Hoạt động
                                                                </span>
                                                            </>
                                                        )}
                                                    </Toggle>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Separator
                                    className="my-4"
                                    orientation="horizontal"
                                />
                                <FormField
                                    name="lockOrder"
                                    control={form.control}
                                    render={() => (
                                        <FormItem>
                                            <FormLabel>Đơn hàng</FormLabel>
                                            <FormControl>
                                                <div className="flex gap-1 justify-between items-center">
                                                    <Label
                                                        htmlFor=""
                                                        className="flex-1"
                                                    >
                                                        Trạng thái đặt đơn
                                                    </Label>
                                                    <Toggle
                                                        variant="outline"
                                                        size="sm"
                                                        className={cn(
                                                            "gap-1 items-center",
                                                            !lockOrder
                                                                ? "border-green-500 text-green-500"
                                                                : "border-red-500 text-red-500"
                                                        )}
                                                        onClick={handleToggle(
                                                            "lockOrder"
                                                        )}
                                                        type="button"
                                                    >
                                                        {lockOrder ? (
                                                            <>
                                                                <XIcon
                                                                    size={15}
                                                                />{" "}
                                                                <span>
                                                                    Khóa
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Check
                                                                    size={15}
                                                                />{" "}
                                                                <span>
                                                                    Hoạt động
                                                                </span>
                                                            </>
                                                        )}
                                                    </Toggle>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <DialogFooter className="mt-5">
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
                                    <Button type="submit">Xác nhận</Button>
                                </div>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
