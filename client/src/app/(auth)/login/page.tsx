"use client";

import LoginForm from "@/components/login-card";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import withoutAuth from "@/hoc/withoutAuth";
import useUser from "@/hook/useUser.hook";
import { IFailRequest } from "@/interface/response.interface";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginPage() {
    const router = useRouter();
    const { handleLogin } = useUser();
    const search = useSearchParams();

    const redirect = search.get("redirect");

    const onSuccessLogin = () => {
        handleLogin();
        const delay = setTimeout(() => {
            router.push(!!redirect ? `?redirect=${redirect}` : "/");
        }, 2000);

        return () => {
            clearTimeout(delay);
        };
    };

    const onFailLogin = (error: IFailRequest) => {
        toast({
            title: error.code,
            description: error.message,
            variant: "destructive",
            duration: 1500,
        });
    };
    document.title = "Đăng nhập";

    return (
        <Card className="w-fit border-none">
            <CardHeader className="justify-center w-full flex items-center">
                <CardTitle className="text-3xl font-bold">Đăng nhập</CardTitle>
                <CardDescription>
                    Nhập email và mật khẩu để đăng nhập
                </CardDescription>
            </CardHeader>
            <CardContent>
                <LoginForm onSuccess={onSuccessLogin} onFail={onFailLogin} />
                <Separator orientation="horizontal" className="my-2 mt-4" />
                <div className="flex justify-center items-center gap-1">
                    <span className="w-fit text-sm text-muted-foreground">
                        Chưa có tài khoản?
                    </span>

                    <Link
                        href={"/signup?redirect=" + redirect}
                        className="w-fit text-sm text-primary hover:underline"
                    >
                        Đăng ký
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default withoutAuth(LoginPage);
