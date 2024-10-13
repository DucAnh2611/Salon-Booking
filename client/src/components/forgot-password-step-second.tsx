"use client";

import { checkSignatureResetPassword } from "@/lib/actions/client.action";
import { joinString } from "@/lib/string";
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "./ui/card";
import { Separator } from "./ui/separator";

export default function ForgotPasswordStep2() {
    const router = useRouter();

    const [checking, SetChecking] = useState<boolean>(true);
    const [valid, SetValid] = useState<boolean>(false);
    const [email, SetEmail] = useState<string>("");
    const [token, SetToken] = useState<string>("");
    const [redirectRemain, SetRedirectRemain] = useState<number>(5);

    const search = useSearchParams();

    useEffect(() => {
        SetEmail(search.get("email") || "");
        SetToken(search.get("token") || "");
    }, [search]);

    useEffect(() => {
        const checkSignature = async (email: string, token: string) => {
            SetChecking(true);

            const { response } = await checkSignatureResetPassword(
                email,
                token
            );
            if (response) {
                const expiredDate = response.result.expired;
                if (new Date(expiredDate).getTime() <= new Date().getTime()) {
                    SetValid(false);
                } else {
                    SetValid(true);
                }
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
    }, [email, token]);

    useEffect(() => {
        if (valid && !checking && email && token && redirectRemain > 0) {
            const interval = setInterval(() => {
                const remain = redirectRemain;
                SetRedirectRemain(remain - 1);
                if (remain - 1 === 0) {
                    router.push(
                        joinString({
                            joinString: "/",
                            strings: [
                                `forgot?step=${3}&email=${email}&token=${token}`,
                            ],
                        })
                    );
                }
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
    }, [valid, checking, token, email, redirectRemain]);

    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle>Xác thực tài khoản</CardTitle>
                <CardDescription>
                    Đang xác thực tài khoản của bạn.
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
                            Thông tin thiếu hoặc thông tin không hợp lệ
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
                    <div className="flex flex-col w-full h-full items-center justify-center gap-2">
                        <CircleCheck className="h-[50px] w-[50px] text-green-500" />
                        <p className="text-green-500">Thành công</p>

                        <Separator orientation="horizontal" className="w-1/2" />

                        <p className="text-xs">
                            Tự dộng chuyển hướng sau {redirectRemain} giây
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
