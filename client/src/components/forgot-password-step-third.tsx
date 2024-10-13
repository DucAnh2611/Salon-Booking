"use client";

import { IApiResetPassword } from "@/interface/client.interface";
import {
    checkSignatureResetPassword,
    resetPassword,
} from "@/lib/actions/client.action";
import { getTimeDifference } from "@/lib/date";
import { resetPasswordSchema } from "@/schema/client.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, isValid } from "date-fns";
import { CircleX, LoaderCircle, Undo2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordInput from "./password-input";
import RequireField from "./required-field";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { toast } from "./ui/use-toast";

export default function ForgotPasswordStep3() {
    const router = useRouter();

    const [checking, SetChecking] = useState<boolean>(true);
    const [valid, SetValid] = useState<boolean>(false);
    const [success, SetSuccess] = useState<boolean>(false);
    const [submit, SetSubmit] = useState<boolean>(false);
    const [email, SetEmail] = useState<string>("");
    const [token, SetToken] = useState<string>("");
    const [redirectRemain, SetRedirectRemain] = useState<number>(3);
    const [timeLeft, SetTimeLeft] = useState<string>("00:00");
    const [verifyExpired, SetVerifyExpired] = useState<Date | null>(null);
    const [isExpired, SetIsExpired] = useState<boolean>(false);

    const search = useSearchParams();

    const form = useForm<z.infer<typeof resetPasswordSchema>>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token: "",
            email: "",
            confirmPassword: "",
            newPassword: "",
        },
    });

    const handleSubmit = async () => {
        if (success || submit || !isValid || isExpired) return;
        SetSubmit(true);
        SetSuccess(false);
        const formData = form.getValues();

        const body: IApiResetPassword = { ...formData };

        const { response } = await resetPassword(body);

        if (response) {
            toast({
                title: "Thành công",
                description: "Đặt lại mật khẩu thành công!",
                duration: 2000,
            });
            SetSuccess(true);
        } else {
            toast({
                title: "Thất bại",
                description: "Đặt lại mật khẩu thất bại.",
                duration: 2000,
            });
        }
    };

    useEffect(() => {
        SetEmail(search.get("email") || "");
        SetToken(search.get("token") || "");
    }, [search]);

    useEffect(() => {
        const checkSignature = async (email: string, token: string) => {
            SetChecking(true);
            SetTimeLeft("00:00");
            SetVerifyExpired(null);

            const { response } = await checkSignatureResetPassword(
                email,
                token
            );
            if (response) {
                SetValid(true);
                SetVerifyExpired(response.result.expired);
            } else {
                SetValid(false);
            }

            SetChecking(false);
        };
        if (!!email && !!token) {
            checkSignature(email, token);
        } else {
            SetChecking(false);
            SetValid(false);
        }

        if (email) {
            form.setValue("email", email);
        }
        if (token) {
            form.setValue("token", token);
        }
    }, [email, token]);

    useEffect(() => {
        if (success && redirectRemain > 0) {
            const interval = setInterval(() => {
                const remain = redirectRemain;
                SetRedirectRemain(remain - 1);
                if (remain - 1 === 0) {
                    router.push("/login");
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [success, redirectRemain]);

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

    return (
        <div>
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Đặt lại mật khẩu</CardTitle>
                    <CardDescription>
                        Điền vào biểu mẫu để đặt lại mật khẩu
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {!valid && !checking && (
                        <div className="flex flex-col w-full h-full items-center justify-center gap-2">
                            <CircleX
                                size={20}
                                className="h-[50px] w-[50px] text-destructive"
                            />
                            <p className="text-destructive">
                                Thông tin không hợp lệ hoặc yêu cầu đã hết hạn
                            </p>
                        </div>
                    )}
                    {checking && (
                        <div className="flex flex-col w-full h-full items-center justify-center gap-2">
                            <LoaderCircle className="h-[50px] w-[50px] animate-spin" />
                            <p>Đang xác thực</p>
                        </div>
                    )}
                    {!checking && valid && (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(handleSubmit)}>
                                <FormField
                                    name="newPassword"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Mật khẩu mới
                                                <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder="Mật khẩu mới"
                                                    {...field}
                                                    disabled={isExpired}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    name="confirmPassword"
                                    control={form.control}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Xác nhận mật khẩu
                                                <RequireField />
                                            </FormLabel>
                                            <FormControl>
                                                <PasswordInput
                                                    placeholder="Xác nhận mật khẩu"
                                                    {...field}
                                                    disabled={isExpired}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="w-full mt-3">
                                    {isExpired ? (
                                        <>
                                            <Button
                                                type="button"
                                                className="w-full"
                                                variant="destructive"
                                                disabled={isExpired}
                                            >
                                                Yêu cầu hết hạn
                                            </Button>
                                            <p className="text-xs w-full text-center mt-2">
                                                Yêu cầu hết hạn lúc
                                                <b className="text-destructive ml-1">
                                                    {format(
                                                        verifyExpired ||
                                                            new Date(),
                                                        "yyyy/MM/dd HH:mm:ss"
                                                    )}
                                                </b>
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <Button
                                                type="submit"
                                                className="w-full gap-2"
                                                disabled={success || submit}
                                            >
                                                {submit && !success && (
                                                    <LoaderCircle
                                                        size={15}
                                                        className="animate-spin"
                                                    />
                                                )}
                                                Đổi mật khẩu
                                            </Button>
                                            <p className="text-xs w-full text-center mt-2">
                                                Yêu cầu hết hạn trong
                                                <b className="text-primary ml-1">
                                                    {timeLeft}
                                                </b>
                                            </p>
                                        </>
                                    )}
                                </div>
                            </form>
                        </Form>
                    )}
                    {success && submit && (
                        <p className="w-full text-center text-xs">
                            Đặt lại mật khẩu thành công. Tự động chuyển tới
                            trang đăng nhập trong
                            <b className="mx-1 text-primary">
                                {redirectRemain}
                            </b>
                            giây
                        </p>
                    )}
                </CardContent>
            </Card>
            <div className="flex w-full justify-end mt-3">
                <Button asChild variant={"outline"} className="gap-2">
                    <Link href={"/forgot?step=1"}>
                        <Undo2 size={15} />
                        Chọn lại tài khoản
                    </Link>
                </Button>
            </div>
        </div>
    );
}
