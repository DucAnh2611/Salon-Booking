"use client";

import { EGender } from "@/enum/gender.enum";
import { IFailRequest } from "@/interface/response.interface";
import { IApiSignup } from "@/interface/user.interface";
import { signupApi } from "@/lib/actions/auth.action";
import { calculateYearsAgo } from "@/lib/date";
import { signupSchema } from "@/schema/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import PasswordInput from "./password-input";
import Require from "./require";
import SelectBirthday from "./select-birthday";
import SelectGender from "./select-gender";
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
import { Separator } from "./ui/separator";

const ATLEAST_OLD = 15;

interface ISignupFormProps {
    onSuccess: () => void;
    onFail: (error: IFailRequest) => void;
}

export default function SignupForm({ onSuccess, onFail }: ISignupFormProps) {
    const [gender, SetGender] = useState<EGender | null>(EGender.OTHER);
    const [birthday, SetBirthday] = useState<Date>(
        calculateYearsAgo(ATLEAST_OLD)
    );

    const handleSelectGender = (gender: EGender) => {
        SetGender(gender);
        form.setValue("gender", gender);
    };

    const handleSelectBirthday = (date: Date) => {
        SetBirthday(date);
        form.setValue("birthday", date);
    };

    const handleSubmit = async () => {
        const { birthday, ...formValue } = form.getValues();

        const payload: IApiSignup = {
            birthday: format(birthday, "yyyy/MM/dd"),
            ...formValue,
        };

        const { response, error } = await signupApi(payload);
        if (response) {
            onSuccess();
        } else if (error) {
            onFail(error);
        }
    };

    const form = useForm<z.infer<typeof signupSchema>>({
        defaultValues: {
            firstname: "",
            lastname: "",
            birthday: calculateYearsAgo(ATLEAST_OLD),
            email: "",
            password: "",
            confirmPassword: "",
            phone: "",
            gender: undefined,
        },
        resolver: zodResolver(signupSchema),
    });

    return (
        <div className="min-w-[400px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="flex flex-row">
                        <div className="flex flex-col gap-3 p-3 border border-transparent rounded hover:border-primary">
                            <h1 className="font-semibold">Thông tin cá nhân</h1>
                            <Separator orientation="horizontal" />
                            <div className="grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="lastname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Họ
                                                <Require />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Nguyễn"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="firstname"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Tên
                                                <Require />
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Văn A"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className="w-full grid grid-cols-2 gap-2">
                                <FormField
                                    control={form.control}
                                    name="birthday"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Sinh nhật
                                                <Require />
                                            </FormLabel>
                                            <FormControl>
                                                <SelectBirthday
                                                    onSelect={
                                                        handleSelectBirthday
                                                    }
                                                    selected={birthday}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Giới tính
                                                <Require />
                                            </FormLabel>
                                            <FormControl>
                                                <SelectGender
                                                    onSelect={
                                                        handleSelectGender
                                                    }
                                                    selected={gender}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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
                                            <Input
                                                placeholder="example@gmail.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Số điện thoại
                                            <Require />
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+84 123 456 789"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Separator orientation="vertical" className="h-auto" />
                        <div className="flex flex-col gap-3 p-3 border border-transparent rounded hover:border-primary">
                            <h1 className="font-semibold">
                                Thông tin xác thực
                            </h1>
                            <Separator orientation="horizontal" />
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
                                            <PasswordInput {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Nhập lại mật khẩu
                                            <Require />
                                        </FormLabel>
                                        <FormControl>
                                            <PasswordInput {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div className="w-full mt-5">
                        <Button className="w-full" type="submit">
                            Tạo tài khoản
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
