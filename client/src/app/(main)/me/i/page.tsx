"use client";

import DialogConfirmOtp from "@/components/dialog-otp";
import SelectBirthday from "@/components/select-birthday";
import SelectGender from "@/components/select-gender";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { EGender } from "@/enum/gender.enum";
import { IClientInfo } from "@/interface/client.interface";
import { getInfo, updateClientInfo } from "@/lib/actions/client.action";
import { api_media_url } from "@/lib/apiCall";
import { calculateYearsAgo } from "@/lib/date";
import { joinString } from "@/lib/string";
import { cn } from "@/lib/utils";
import { clientUpdateSchema } from "@/schema/client.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ImageOff, Loader, LoaderCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const ATLEAST_OLD = 15;

export default function Page() {
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [previewImage, SetPreviewImage] = useState<string | null>(null);
    const [previewFile, SetPreviewFile] = useState<File | null>(null);
    const [gender, SetGender] = useState<EGender | null>(EGender.OTHER);
    const [birthday, SetBirthday] = useState<Date>(
        calculateYearsAgo(ATLEAST_OLD)
    );
    const [isLoading, SetIsLoading] = useState<boolean>(true);
    const [isSubmiting, SetIsSubmiting] = useState<boolean>(false);
    const [userInfo, SetUserInfo] = useState<IClientInfo | null>(null);

    const form = useForm<z.infer<typeof clientUpdateSchema>>({
        defaultValues: {
            birthday: new Date(),
            email: "",
            firstname: "",
            gender: EGender.OTHER,
            lastname: "",
            phone: "",
        },
        resolver: zodResolver(clientUpdateSchema),
    });

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const MAX_FILE_SIZE = 1 * 1024 * 1024;
        const file = event.target.files?.[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                SetPreviewImage(null);
                SetPreviewFile(null);
                toast({
                    title: "Thất bại",
                    description: "Ảnh có kích thước vượt quá 1mb",
                    variant: "destructive",
                    duration: 1500,
                });
                return;
            }

            const reader = new FileReader();

            reader.onloadend = () => {
                SetPreviewImage(reader.result as string);
                SetPreviewFile(file);
            };

            reader.readAsDataURL(file);
            event.target.value = "";
        }
    };

    const handleSelectGender = (gender: EGender) => {
        SetGender(gender);
        form.setValue("gender", gender);
    };

    const handleSelectBirthday = (date: Date) => {
        SetBirthday(date);
        form.setValue("birthday", date);
    };

    const getUserInfo = async () => {
        SetIsLoading(true);
        SetUserInfo(null);
        const { response } = await getInfo();
        if (response) {
            SetUserInfo(response.result);
            if (response.result.userBase.userAvatar) {
                setImageUrl(response.result.userBase.userAvatar.path);
            }
        } else {
            toast({
                title: "Thất bại",
                description:
                    "Lấy thông tin người dùng thất bại, vui lòng thử lại sau.",
                variant: "destructive",
            });
        }

        SetIsLoading(false);
    };

    const onSuccess = () => {
        getUserInfo();
    };

    const handleSubmit = async () => {
        SetIsSubmiting(true);
        const formData = form.getValues();

        const body: FormData = new FormData();

        body.append("firstname", formData.firstname);
        body.append("lastname", formData.lastname);
        body.append("email", formData.email);
        body.append("phone", formData.phone);
        body.append("gender", formData.gender);
        body.append("birthday", formData.birthday.toString());

        if (previewFile) {
            body.append("image", previewFile);
        }

        const { response } = await updateClientInfo(body);

        if (response) {
            toast({
                title: "Thành công",
                description: "Cập nhật thông tin thành công",
                duration: 1500,
            });
            onSuccess();
        } else {
            toast({
                title: "Thành công",
                description: "Cập nhật thông tin thành công",
                variant: "destructive",
                duration: 1500,
            });
        }
        SetIsSubmiting(false);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    useMemo(() => {
        if (userInfo) {
            form.setValue("gender", userInfo.userBase.gender);
            form.setValue("birthday", new Date(userInfo.userBase.birthday));
            form.setValue("firstname", userInfo.userBase.firstname);
            form.setValue("lastname", userInfo.userBase.lastname);
            form.setValue("phone", userInfo.userBase.phone);
            form.setValue("email", userInfo.email);

            SetGender(userInfo.userBase.gender);
            SetBirthday(new Date(userInfo.userBase.birthday));
        }
    }, [userInfo]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="h-fit w-full">
                    {isLoading && (
                        <div className="w-full h-full min-h-[400px] absolute top-0 left-0 z-[2]">
                            <div className="w-full h-full bg-foreground absolute top-0 left-0 z-[0] opacity-15" />
                            <div className="w-full h-full flex items-center justify-center relative z-[1]">
                                <Loader size={20} className="animate-spin" />
                            </div>
                        </div>
                    )}
                    <div className="">
                        <h1 className="font-medium text-lg">
                            Thông tin cá nhân
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Quản lý thông tin hồ sơ tài khoản
                        </p>
                    </div>
                    <Separator orientation="horizontal" className="my-5" />
                    <div className="flex gap-12 h-fit">
                        <div className="flex-1 flex-col flex gap-5">
                            <FormField
                                name="lastname"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="w-full grid grid-cols-3 items-center gap-5">
                                            <FormLabel className="col-span-1 text-right text-muted-foreground text-sm">
                                                Họ
                                            </FormLabel>
                                            <FormControl>
                                                <div className="col-span-2">
                                                    <Input
                                                        placeholder="Họ"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="firstname"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="w-full grid grid-cols-3 items-center gap-5">
                                            <FormLabel className="col-span-1 text-right text-muted-foreground text-sm">
                                                Tên
                                            </FormLabel>
                                            <FormControl>
                                                <div className="col-span-2">
                                                    <Input
                                                        placeholder="Tên"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="email"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="w-full grid grid-cols-3 items-center gap-5">
                                            <FormLabel className="col-span-1 text-right text-muted-foreground text-sm">
                                                Tên
                                            </FormLabel>
                                            <FormControl>
                                                <div className="col-span-2 flex gap-3">
                                                    <Input
                                                        placeholder="Email"
                                                        {...field}
                                                        className="flex-1"
                                                    />
                                                    {userInfo &&
                                                    !userInfo.emailVerified ? (
                                                        <DialogConfirmOtp
                                                            onSuccess={
                                                                onSuccess
                                                            }
                                                        />
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            variant={"outline"}
                                                            className=" group gap-2 border-green-500 text-green-500 bg-green-500 bg-opacity-5 hover:text-green-500 hover:bg-green-500 hover:bg-opacity-15"
                                                        >
                                                            <Check size={15} />
                                                            <span className="">
                                                                Đã xác thực
                                                            </span>
                                                        </Button>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="phone"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="w-full grid grid-cols-3 items-center gap-5">
                                            <FormLabel className="col-span-1 text-right text-muted-foreground text-sm">
                                                Số điện thoại
                                            </FormLabel>
                                            <FormControl>
                                                <div className="col-span-2">
                                                    <Input
                                                        placeholder="Số điện thoại"
                                                        {...field}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="gender"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="w-full grid grid-cols-3 items-center gap-5">
                                            <FormLabel className="col-span-1 text-right text-muted-foreground text-sm">
                                                Giới tính
                                            </FormLabel>
                                            <FormControl>
                                                <div className="col-span-2">
                                                    <div className="w-fit">
                                                        <SelectGender
                                                            onSelect={
                                                                handleSelectGender
                                                            }
                                                            selected={gender}
                                                        />
                                                    </div>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                name="birthday"
                                control={form.control}
                                render={({ field }) => (
                                    <FormItem>
                                        <div className="w-full grid grid-cols-3 items-center gap-5">
                                            <FormLabel className="col-span-1 text-right text-muted-foreground text-sm">
                                                Ngày sinh
                                            </FormLabel>
                                            <FormControl>
                                                <div className="col-span-2">
                                                    <SelectBirthday
                                                        onSelect={
                                                            handleSelectBirthday
                                                        }
                                                        selected={birthday}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </div>
                                    </FormItem>
                                )}
                            />
                            <div className="w-full grid grid-cols-3 items-center gap-5">
                                <div className="col-span-1"></div>
                                <div className="col-span-2">
                                    <Button
                                        className="w-[100px] gap-1"
                                        type="submit"
                                        disabled={isSubmiting}
                                    >
                                        <LoaderCircle
                                            className={cn(
                                                "animate-spin",
                                                isSubmiting ? "block" : "hidden"
                                            )}
                                            size={15}
                                        />
                                        Lưu
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <Separator orientation="vertical" className="h-auto" />
                        <div className="w-[300px] flex flex-col items-center justify-center gap-3">
                            <div className="w-[120px] h-[120px] rounded-full border-2 p-1 box-border overflow-hidden">
                                {previewImage || imageUrl ? (
                                    <>
                                        {previewImage && (
                                            <div className="w-full h-full bg-muted flex items-center justify-center overflow-hidden rounded-full relative group">
                                                <Image
                                                    alt="preview"
                                                    src={previewImage}
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-full object-cover "
                                                />
                                                <div className="absolute top-0 left-0 w-full h-full ">
                                                    {" "}
                                                </div>
                                            </div>
                                        )}
                                        {imageUrl && (
                                            <div className="w-full h-full bg-muted flex items-center justify-center overflow-hidden rounded-full relative">
                                                <Image
                                                    alt="preview"
                                                    src={joinString({
                                                        joinString: "",
                                                        strings: [
                                                            api_media_url,
                                                            imageUrl,
                                                        ],
                                                    })}
                                                    width={300}
                                                    height={300}
                                                    className="w-full h-full object-cover "
                                                />
                                                <div className="absolute top-0 left-0 w-full h-full ">
                                                    {" "}
                                                </div>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full bg-muted flex items-center justify-center overflow-hidden rounded-full">
                                        <ImageOff size={15} />
                                    </div>
                                )}
                            </div>
                            <p className="text-center text-muted-foreground text-sm">
                                Chọn ảnh đại diện.
                                <br /> Lưu ý ảnh không quá 1MB
                            </p>
                            <Label
                                className="border rounded text-sm font-medium p-4 py-2 cursor-pointer hover:bg-muted"
                                htmlFor="new_img"
                            >
                                Chọn ảnh
                            </Label>
                            <input
                                id="new_img"
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </Form>
    );
}
