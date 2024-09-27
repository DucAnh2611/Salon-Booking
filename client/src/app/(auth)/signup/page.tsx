"use client";

import SignupForm from "@/components/signup-card";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ToastAction } from "@/components/ui/toast";
import { toast } from "@/components/ui/use-toast";
import withoutAuth from "@/hoc/withoutAuth";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function SignupPage() {
    const router = useRouter();
    const search = useSearchParams();

    const redirect = search.get("redirect");

    const onSuccessSignup = () => {
        toast({
            title: "Đăng ký thành công",
            description: "Đăng ký thành công, chuyển qua trang đăng nhập?",
            action: (
                <ToastAction altText="Đăng nhập" asChild>
                    <Link
                        href={
                            "/login" + !!redirect ? `?redirect=${redirect}` : ""
                        }
                    ></Link>
                    Đăng nhập
                </ToastAction>
            ),
        });
    };

    return (
        <Card className="w-fit border-none">
            <CardHeader className="justify-center w-full flex items-center">
                <CardTitle className="text-3xl font-bold">
                    Tạo tài khoản
                </CardTitle>
                <CardDescription>
                    Nhập email, mật khẩu và các thông tin cá nhân để tạo tài
                    khoản
                </CardDescription>
            </CardHeader>
            <CardContent>
                <SignupForm onSuccess={onSuccessSignup} />
                <Separator orientation="horizontal" className="my-2 mt-4" />
                <div className="flex justify-center items-center gap-1">
                    <span className="w-fit text-sm text-muted-foreground">
                        Đã có tài khoản?
                    </span>

                    <Link
                        href={"/login?redirect=" + redirect}
                        className="w-fit text-sm text-primary hover:underline"
                    >
                        Đăng nhập
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
export default withoutAuth(SignupPage);
