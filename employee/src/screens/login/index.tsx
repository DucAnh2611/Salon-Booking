import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ROUTER_PATH } from "@/constants/router.constant";
import { authTokenAction, LoginApi } from "@/lib/redux/actions/auth.action";
import { authSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { loginFormSchema } from "@/schemas/login.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

function LoginScreen() {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { authentication } = useAppSelector(authSelector);
    const [showPw, SetShowPw] = useState<boolean>(false);

    const toggleShowPassword = (e: MouseEvent<HTMLButtonElement>) => {
        SetShowPw((show) => !show);
    };

    const form = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            username: "",
            password: "",
        },
    });

    const handleLogin = (values: z.infer<typeof loginFormSchema>) => {
        const { username, password } = values;

        dispatch(LoginApi({ username, password }));
    };

    useEffect(() => {
        if (!authentication) {
            dispatch(authTokenAction());
        } else {
            navigate(ROUTER_PATH.HOME);
        }
    }, [authentication]);

    return (
        <div className="grid place-items-center w-full h-full bg-muted">
            <Card className="w-1/5">
                <CardHeader>
                    <CardTitle>Đăng nhập</CardTitle>
                    <CardDescription>
                        Trang quản lý thông tin cho nhân viên.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleLogin)}
                            className="flex flex-col gap-2"
                        >
                            <FormField
                                control={form.control}
                                name="username"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tên tài khoản</FormLabel>
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu</FormLabel>
                                        <FormControl>
                                            <div className="relative w-full h-fit">
                                                <Input
                                                    placeholder="Mật khẩu"
                                                    type={
                                                        showPw
                                                            ? "text"
                                                            : "password"
                                                    }
                                                    {...field}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 p-4 h-5 w-5 flex items-center justify-center"
                                                    onClick={toggleShowPassword}
                                                    size="icon"
                                                >
                                                    <TooltipProvider>
                                                        <Tooltip
                                                            delayDuration={0}
                                                        >
                                                            <TooltipTrigger>
                                                                {showPw ? (
                                                                    <EyeOffIcon
                                                                        size={
                                                                            15
                                                                        }
                                                                    />
                                                                ) : (
                                                                    <EyeIcon
                                                                        size={
                                                                            15
                                                                        }
                                                                    />
                                                                )}
                                                            </TooltipTrigger>
                                                            <TooltipContent>
                                                                <p>
                                                                    {showPw
                                                                        ? "Ẩn"
                                                                        : "Hiện"}
                                                                </p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full mt-5">
                                Đăng nhập
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}

export default LoginScreen;
