import { API_URLS } from "@/constants/api.constant";
import { ESocketEvent, ESocketMessage } from "@/enum/socket.enum";
import useSocket from "@/hooks/useSocket";
import { IQuickQr } from "@/interface/api/bank.interface";
import { IMediaTempUpload } from "@/interface/api/media.interface";
import { IWebhookRefundResult } from "@/interface/api/order-refund.interface";
import { IApiApproveRefund } from "@/interface/api/refund.interface";
import {
    approveOrderRefund,
    getOrderRefund,
} from "@/lib/redux/actions/order-refund.action";
import { orderRefundSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { approvedRefundRequestSchema } from "@/schemas/order-refund.schema";
import { api_media_url, apiCall } from "@/utils/apiCall";
import { joinString } from "@/utils/string";
import { generateUUID } from "@/utils/uuid.utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import RequireField from "../require-field";
import SelectMedia from "../select/select-media";
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
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { toast } from "../ui/use-toast";

const TIME_RECHECK = 10;

interface IDialogApprovedRefundProps {
    trigger: ReactNode;
    requestId: string;
    onSuccess: () => void;
}

export default function DialogApprovedRefund({
    trigger,
    requestId,
    onSuccess,
}: IDialogApprovedRefundProps) {
    const { isApproving, isFailure, detail } =
        useAppSelector(orderRefundSelector);
    const dispath = useAppDispatch();

    const [sessionId, SetSessionId] = useState<string>(generateUUID());
    const [open, SetOpen] = useState<boolean>(false);
    const [mediaUrls, SetMediaUrls] = useState<IMediaTempUpload[]>([]);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [qr, SetQr] = useState<IQuickQr | null>(null);
    const [recheckRemain, SetRecheckRemain] = useState<number>(TIME_RECHECK);
    const { socket, isConnected } = useSocket();

    const form = useForm<z.infer<typeof approvedRefundRequestSchema>>({
        defaultValues: {
            requestId: "",
            mediaUrl: "",
            note: "",
            bankTransactionCode: "",
        },
        resolver: zodResolver(approvedRefundRequestSchema),
    });

    const getRequestQr = async (requestId: string) => {
        const api = API_URLS.REFUND.GET_PAYMENT_QR(requestId);
        const { response } = await apiCall<IQuickQr>({ ...api });

        if (response) {
            SetQr(response.result);
            if (response.result.referenceCode) {
                form.setValue(
                    "bankTransactionCode",
                    response.result.referenceCode
                );
            }
        } else {
            SetQr(null);
            toast({
                title: "Thất bại",
                description: "Lấy mã QR thất bại",
                variant: "destructive",
                duration: 2000,
            });
        }
    };

    const getRequestRefund = (requestId: string) => {
        dispath(getOrderRefund(requestId));
    };

    const checkRequest = async (requestId: string) => {
        const api = API_URLS.REFUND.CHECK(requestId);
        const { response } = await apiCall<IWebhookRefundResult>({ ...api });

        if (response) {
            if (response.result) {
                form.setValue(
                    "bankTransactionCode",
                    response.result.referenceCode
                );
            }
        }
        SetRecheckRemain(TIME_RECHECK);
    };

    const handleSubmit = () => {
        if (submit || !qr || isApproving || !qr.qrLink) return;
        SetSubmit(true);
        const formData = form.getValues();

        const body: IApiApproveRefund = {
            ...formData,
        };

        dispath(approveOrderRefund(body));
    };

    const onSelectProductMedia = (urls: IMediaTempUpload[]) => {
        SetMediaUrls(urls);
        form.clearErrors("mediaUrl");
    };

    const handleDelete = (item: IMediaTempUpload) => () => {
        const newList = mediaUrls.filter((i) => i.url !== item.url);
        SetMediaUrls(newList);
    };

    const handleOpen = (open: boolean) => {
        if (open) {
            form.reset();
            form.setValue("requestId", requestId);

            getRequestQr(requestId);
            getRequestRefund(requestId);

            SetRecheckRemain(TIME_RECHECK);
            SetQr(null);
            SetSubmit(false);
            SetSessionId(generateUUID());
            SetMediaUrls([]);
        } else {
            if (socket && detail && isConnected) {
                socket.emit(ESocketMessage.LEAVE_REFUND_REQUEST, {
                    code: detail.code,
                });
            }
        }
        SetOpen(open);
    };

    useEffect(() => {
        form.setValue("mediaUrl", mediaUrls.length ? mediaUrls[0].url : "");
    }, [mediaUrls]);

    useEffect(() => {
        if (submit && !isApproving && !isFailure) {
            handleOpen(false);
            onSuccess();
        }
        if (submit && isFailure && !isApproving) {
            SetSubmit(false);
        }
    }, [isApproving, submit, isFailure]);

    useEffect(() => {
        if (!socket || !isConnected) return;
        if (socket && detail) {
            socket.emit(ESocketMessage.LISTEN_REFUND_REQUEST, {
                code: detail.code,
            });

            socket.on(
                ESocketEvent.SUCCESS_REFUND_REQUEST,
                (data: { code: string; referenceCode: string }) => {
                    if (data.code === detail.code) {
                        form.setValue(
                            "bankTransactionCode",
                            data.referenceCode
                        );
                    }
                }
            );

            return () => {
                socket.off(ESocketEvent.SUCCESS_REFUND_REQUEST);
            };
        }
    }, [qr, socket, isConnected]);

    useEffect(() => {
        if (qr) {
            const interval = setInterval(() => {
                const r = recheckRemain;
                SetRecheckRemain(r - 1);

                if (r === 1) {
                    checkRequest(requestId);
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [qr, recheckRemain]);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-none w-[700px]">
                <DialogHeader>
                    <DialogTitle>Xác nhận hoàn tiền</DialogTitle>
                    <DialogDescription>
                        Sau khi quét mã QR, nhân viên không được thay đổi các
                        thông tin chuyển khoản (Nội dung chuyển khoản, số tiền)
                    </DialogDescription>
                </DialogHeader>
                <Separator orientation="horizontal" />
                <div className="flex gap-3">
                    <div className="w-fit flex flex-col gap-2">
                        <div className="max-w-[300px]">
                            {detail && (
                                <div className="w-auto flex gap-2 items-center">
                                    <Label>Mã yêu cầu</Label>
                                    <p className="text-primary font-bold text-sm">
                                        {detail.code}
                                    </p>
                                </div>
                            )}
                            {qr ? (
                                <>
                                    <img
                                        src={qr.qrLink}
                                        alt="qr"
                                        className="h-auto w-auto"
                                    />
                                </>
                            ) : (
                                <div className="w-[300px] h-[300px] flex items-center justify-center bg-yellow-500 bg-opacity-15 text-yellow-500 border-yellow-500">
                                    <LoaderCircle
                                        size={20}
                                        className="animate-spin"
                                    />
                                </div>
                            )}
                            <div className="w-auto">
                                <p className="text-xs">
                                    Tự động kiểm tra sau
                                    <b className="mx-1 text-primary">
                                        {recheckRemain}
                                    </b>
                                    giây.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1">
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                <div>
                                    <FormField
                                        control={form.control}
                                        name="mediaUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Ảnh xác thực
                                                </FormLabel>
                                                <FormControl>
                                                    <SelectMedia
                                                        onSelect={
                                                            onSelectProductMedia
                                                        }
                                                        sessionId={sessionId}
                                                        mutiple={false}
                                                        accept="image/*"
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Ảnh chụp màn hình giao dịch,
                                                    hóa đơn, ...
                                                </FormDescription>
                                                {!!mediaUrls.length && (
                                                    <div className="grid grid-cols-3 w-full h-fit gap-2">
                                                        {mediaUrls.map(
                                                            (url) => (
                                                                <div className="w-full h-fit relative">
                                                                    <div className="absolute top-0 right-1 z-[1]">
                                                                        <Button
                                                                            size="icon"
                                                                            className="w-fit h-fit p-1 text-destructive rounded-full bg-red-500 bg-opacity-90 hover:bg-red-500 hover:bg-opacity-50 text-white"
                                                                            onClick={handleDelete(
                                                                                url
                                                                            )}
                                                                        >
                                                                            <X
                                                                                size={
                                                                                    10
                                                                                }
                                                                            />
                                                                        </Button>
                                                                    </div>
                                                                    <img
                                                                        alt="temp_refund"
                                                                        src={joinString(
                                                                            {
                                                                                joinString:
                                                                                    "/",
                                                                                strings:
                                                                                    [
                                                                                        api_media_url,
                                                                                        url.url,
                                                                                    ],
                                                                            }
                                                                        )}
                                                                        className="w-full h-auto max-h-[300px] rounded-md object-contain relative z-[0]"
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                )}
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="bankTransactionCode"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Mã chuyển tiền ngân hàng
                                                    <RequireField />
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Mã chuyển tiền ngân hàng"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="note"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Ghi chú</FormLabel>
                                                <FormControl>
                                                    <TextareaCharCounter
                                                        maxLength={150}
                                                        placeholder="Ghi chú"
                                                        {...field}
                                                        className="h-[100px] resize-none w-full"
                                                    />
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
                                            disabled={
                                                isApproving || !qr || !detail
                                            }
                                            className="gap-2 items-center"
                                        >
                                            {isApproving && (
                                                <LoaderCircle
                                                    size={15}
                                                    className="animate-spin"
                                                />
                                            )}
                                            Xác nhận
                                        </Button>
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
