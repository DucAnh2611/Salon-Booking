"use client";

import { IFailRequest } from "@/interface/response.interface";
import { ILocalStorage } from "@/interface/str.interface";
import { loginApi } from "@/lib/actions/auth.action";
import { localStorageSet } from "@/lib/localStr";
import { loginSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Require from "./require";
import { Button } from "./ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface ILoginFormProps {
    onSuccess: () => void;
    onFail: (error: IFailRequest) => void;
}

export default function LoginForm({ onSuccess, onFail }: ILoginFormProps) {
    const [show, SetShow] = useState<boolean>(false);

    const toggleShowPassword = () => {
        SetShow((s) => !s);
    };

    const handleSubmit = async () => {
        const { response, error } = await loginApi(form.getValues());
        if (response) {
            localStorageSet<ILocalStorage>({
                accessToken: response.result.accessToken,
            });
            onSuccess();
        }
        if (error) {
            onFail(error);
        }
    };

    const form = useForm<z.infer<typeof loginSchema>>({
        defaultValues: {
            email: "",
            password: "",
        },
        resolver: zodResolver(loginSchema),
    });

    return (
        <div className="w-[400px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-col gap-2">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Email
                                        <Require />
                                    </FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="Email" />
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
                                    <FormLabel>
                                        Mật khẩu
                                        <Require />
                                    </FormLabel>
                                    <FormControl>
                                        <div className="w-full relative flex gap-1">
                                            <Input
                                                {...field}
                                                type={
                                                    show ? "text" : "password"
                                                }
                                                placeholder="Mật khẩu"
                                                className="flex-1"
                                            />
                                            <TooltipProvider>
                                                <Tooltip delayDuration={0}>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={
                                                                toggleShowPassword
                                                            }
                                                        >
                                                            {show ? (
                                                                <EyeOffIcon
                                                                    size={15}
                                                                />
                                                            ) : (
                                                                <EyeIcon
                                                                    size={15}
                                                                />
                                                            )}
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        {show ? "Ẩn" : "Hiện"}
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="w-full mt-5">
                        <Button className="w-full" type="submit">
                            Đăng nhập
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
