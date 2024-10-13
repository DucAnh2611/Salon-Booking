"use client";

import useDebounce from "@/hook/useDebounce.hook";
import { IClient } from "@/interface/client.interface";
import {
    existEmail,
    sendSignatureResetPassword,
} from "@/lib/actions/client.action";
import { joinString } from "@/lib/string";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";
import MediaLoader from "./media-load";
import RequireField from "./required-field";
import { Button } from "./ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Skeleton } from "./ui/skeleton";
import { toast } from "./ui/use-toast";

export default function ForgotPasswordStep1() {
    const router = useRouter();

    const [loading, SetLoading] = useState<boolean>(false);
    const [sending, SetSending] = useState<boolean>(false);
    const [allowSend, SetAllowSend] = useState<boolean>(true);

    const [email, SetEmail] = useState<string>("");

    const [foundEmail, SetFoundEmail] = useState<IClient | null>(null);
    const { debouncedValue: dEmail, isDebouncing: isDebouncingEmail } =
        useDebounce<string>(email);

    const notMe = () => {
        SetFoundEmail(null);
        SetEmail("");
    };

    const handleChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        const v = e.target.value;
        SetEmail(v);
        SetAllowSend(true);
    };

    const handleSubmit = async () => {
        if (!foundEmail || !allowSend) return;
        SetSending(true);
        SetAllowSend(true);

        const { response } = await sendSignatureResetPassword(email);

        if (response) {
            toast({
                title: "Thành công",
                description: "Đã gửi yêu cầu, vui lòng kiểm tra gmail của bạn.",
            });
            router.push(
                joinString({
                    joinString: "/",
                    strings: [
                        `forgot?step=${2}&email=${dEmail}&token=${
                            response.result.token
                        }`,
                    ],
                })
            );
        } else {
            toast({
                title: "Thất bại",
                description: "Gặp lỗi trong quá trình gửi yêu cầu",
                variant: "destructive",
                duration: 2000,
            });
        }

        SetSending(false);
        SetAllowSend(false);
    };

    const handleCheckEmail = async (email: string) => {
        if (!email) return;
        SetLoading(true);

        const { response } = await existEmail(email);

        if (response) {
            SetFoundEmail(response.result);
        } else {
            SetFoundEmail(null);
        }
        SetLoading(false);
    };

    useEffect(() => {
        handleCheckEmail(dEmail);
    }, [dEmail]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quên mật khẩu?</CardTitle>
                <CardDescription>
                    Nhập email của bạn ở trường bên dưới để tiền hành đặt lại
                    mật khẩu.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-3">
                    <div>
                        <Label>
                            Email
                            <RequireField />
                        </Label>
                        <Input
                            placeholder="Email"
                            value={email}
                            onChange={handleChangeEmail}
                            className="focus-visible:ring-transparent"
                        />
                    </div>
                    {foundEmail &&
                        !!dEmail &&
                        !loading &&
                        !isDebouncingEmail && (
                            <div className="space-y-2 rounded-sm border p-2">
                                <p className="text-sm font-medium">
                                    Có phải bạn?
                                </p>
                                <div className="flex gap-5">
                                    <div className="size-12 rounded-full overflow-hidden">
                                        <MediaLoader
                                            media={
                                                foundEmail.userBase.userAvatar
                                            }
                                        />
                                    </div>
                                    <div className="text-sm flex-1 overflow-hidden ">
                                        <p className="text-primary font-bold text-base whitespace-nowrap line-clamp-1">
                                            {joinString({
                                                joinString: " ",
                                                strings: [
                                                    foundEmail.userBase
                                                        .lastname,
                                                    foundEmail.userBase
                                                        .firstname,
                                                ],
                                            })}
                                        </p>
                                        <p className="whitespace-nowrap line-clamp-1 mt-1">
                                            {foundEmail.email}
                                        </p>
                                        <p className="whitespace-nowrap line-clamp-1 text-sm">
                                            {foundEmail.userBase.phone}
                                        </p>
                                    </div>
                                </div>
                                <div className="w-full flex gap-2">
                                    <Button
                                        variant="secondary"
                                        size={"sm"}
                                        className="flex-1"
                                        onClick={notMe}
                                        disabled={sending}
                                    >
                                        Không
                                    </Button>
                                    <Button
                                        size={"sm"}
                                        className="flex-1 gap-2"
                                        onClick={handleSubmit}
                                        disabled={sending || !allowSend}
                                    >
                                        {sending ? (
                                            <>
                                                <LoaderCircle
                                                    size={15}
                                                    className="animate-spin"
                                                />
                                                <p className="text-sm">
                                                    Đang gửi
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-sm">
                                                Chính là tôi
                                            </p>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        )}
                    {!foundEmail &&
                        !!dEmail &&
                        !loading &&
                        !isDebouncingEmail && (
                            <div className="space-y-2 rounded-sm border p-2">
                                <p className="text-sm">
                                    Không có kểt quả cho email
                                    <b className="ml-1">{dEmail}</b>
                                </p>
                            </div>
                        )}
                    {(!!isDebouncingEmail || !!loading) && dEmail && (
                        <div className="space-y-2 rounded-sm border p-2">
                            <div className="flex gap-5">
                                <Skeleton className="size-12 rounded-full" />
                                <div className="text-sm flex-1 overflow-hidden ">
                                    <Skeleton className="w-[70%] h-6" />
                                    <Skeleton className="w-[50%] h-4 mt-1" />
                                    <Skeleton className="w-[30%] h-4 mt-1" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
