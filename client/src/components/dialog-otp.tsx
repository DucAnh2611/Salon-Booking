"use client";

import useDebounce from "@/hook/useDebounce.hook";
import { sendEmailverify, verifyOtp } from "@/lib/actions/client.action";
import { getTimeDifference } from "@/lib/date";
import { LoaderCircle, Mail } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { toast } from "./ui/use-toast";

interface IDialogConfirmOtpProps {
    onSuccess: () => void;
}

export default function DialogConfirmOtp({
    onSuccess,
}: IDialogConfirmOtpProps) {
    const [open, SetOpen] = useState<boolean>(false);
    const [requesting, SetRequesting] = useState<boolean>(false);
    const [loading, SetLoading] = useState<boolean>(false);
    const [verifyExpired, SetVerifyExpired] = useState<Date | null>(null);
    const [timeLeft, SetTimeLeft] = useState<string>("00:00");
    const [isExpired, SetIsExpired] = useState<boolean>(false);
    const [otp, SetOtp] = useState<string>("");
    const { debouncedValue: otpDebounce } = useDebounce(otp);

    const requestVerify = async () => {
        if (verifyExpired && !isExpired) {
            if (!open) {
                SetOpen(true);
            }
            return;
        }

        SetVerifyExpired(null);
        SetIsExpired(false);
        SetTimeLeft("00:00");
        SetRequesting(true);

        const { response } = await sendEmailverify();
        if (response) {
            SetVerifyExpired(response.result.expired);
            SetOtp("");
            if (!open) {
                SetOpen(true);
            }
        } else {
            toast({
                title: "Thất bại",
                description: "Yêu cầu xác minh thất bại, vui lòng thử lại sau.",
                variant: "destructive",
            });
        }

        SetRequesting(false);
    };

    const handleOpen = (open: boolean) => {
        if (open) {
            requestVerify();
        } else SetOpen(open);
    };
    const handleOnChange = (value: string) => [SetOtp(value)];

    const handleResend = () => {
        if (verifyExpired && !isExpired) return;

        requestVerify();
    };

    const onSubmit = async () => {
        SetLoading(true);

        const { response } = await verifyOtp(otpDebounce);

        if (response) {
            handleOpen(false);

            toast({
                title: "Thành công",
                description: "Xác minh thành công!",
            });
            SetOpen(false);
            onSuccess();
        } else {
            toast({
                title: "Thất bại",
                description: "Sai OTP hoặc hết hạn",
                variant: "destructive",
            });
        }

        SetLoading(false);
    };

    useEffect(() => {
        if (verifyExpired) {
            if (new Date(verifyExpired) >= new Date()) {
                const timeCountInterval = setInterval(() => {
                    const { minutes, seconds } = getTimeDifference(
                        new Date(),
                        verifyExpired ? new Date(verifyExpired) : new Date()
                    );

                    SetTimeLeft(
                        `${minutes > 9 ? minutes : `0${minutes}`}:${
                            seconds > 9 ? seconds : `0${seconds}`
                        }`
                    );
                    if (minutes <= 0 && seconds <= 0) {
                        SetIsExpired(true);
                    }
                }, 1000);

                return () => {
                    clearInterval(timeCountInterval);
                };
            } else {
                SetIsExpired(true);
            }
        }
    }, [verifyExpired]);

    useEffect(() => {
        if (otpDebounce.length === 6) {
            onSubmit();
        }
    }, [otpDebounce]);

    return (
        <Dialog open={open} onOpenChange={handleOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2" type="button">
                    {requesting && (
                        <LoaderCircle size={15} className="animate-spin" />
                    )}
                    {"Xác thực Email"}
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-none w-fit">
                <DialogHeader>
                    <DialogTitle>Xác minh Email</DialogTitle>
                    <DialogDescription>
                        Xác minh giúp tăng tính bảo mật tài khoản cá nhân.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="flex gap-3">
                        <InputOTP maxLength={6} onChange={handleOnChange}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1} />
                                <InputOTPSlot index={2} />
                                <InputOTPSlot index={3} />
                                <InputOTPSlot index={4} />
                                <InputOTPSlot index={5} />
                            </InputOTPGroup>
                        </InputOTP>
                        <div className="w-fit flex gap-1">
                            <Button
                                variant="outline"
                                disabled={requesting || !isExpired}
                                className="w-[120px]"
                                onClick={handleResend}
                            >
                                {requesting && (
                                    <LoaderCircle
                                        size={15}
                                        className="animate-spin"
                                    />
                                )}
                                {isExpired ? "Gửi lại mã OTP" : timeLeft}
                            </Button>
                            <Button variant="outline">
                                <Link
                                    href="https://mail.google.com/"
                                    target="_blank"
                                    className="gap-2 items-center flex"
                                >
                                    <Mail size={15} /> Mở gmail
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <div className="w-full">
                        <div className="flex w-full justify-end gap-2 items-center mt-5">
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
                                type="button"
                                disabled={loading}
                                onClick={onSubmit}
                            >
                                Xác nhận
                            </Button>
                        </div>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
