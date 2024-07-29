import SingleDatePicker from "@/components/date-picker/single";
import SelectGenderDowndown from "@/components/dropdown/select-gender";
import RequireField from "@/components/require-field";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import UpdateHistory from "@/components/update-history";
import { EGender } from "@/enum/gender.enum";
import { IEmployeeDetail } from "@/interface/api/employee.interface";
import { employeeUpdateFormSchema } from "@/schemas/employee.schema";
import { api_media_url } from "@/utils/apiCall";
import { XIcon } from "lucide-react";
import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

interface IBaseEmployeeUpdateSectionProps {
    form: UseFormReturn<
        z.infer<typeof employeeUpdateFormSchema>,
        any,
        undefined
    >;
    userAvatar: string | null;
    employee: IEmployeeDetail;
}

export default function BaseEmployeeUpdateSection({
    form,
    userAvatar,
    employee,
}: IBaseEmployeeUpdateSectionProps) {
    const [previewUrl, SetPreviewUrl] = useState<string>(
        userAvatar ? `${api_media_url}${userAvatar}` : ""
    );

    const handleImage = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;

        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                if (event?.target?.result)
                    SetPreviewUrl(event.target.result.toString());
            };
            reader.readAsDataURL(selectedFile);

            form.setValue("image", selectedFile);
            e.target.value = "";
        }
    };

    const clearImage = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        form.setValue("image", undefined);
        form.setValue("avatar", undefined);
        SetPreviewUrl("");
    };

    const handleBirthday = (date: Date | undefined) => {
        form.setValue("birthday", date);
    };

    const handleGender = (gender: EGender) => {
        form.setValue("gender", gender);
    };

    useEffect(() => {
        if (!form.getValues("image")) {
            SetPreviewUrl(userAvatar ? `${api_media_url}${userAvatar}` : "");
        }
    }, [form]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                    Một số thông tin cơ bản về nhân viên.
                </CardDescription>
            </CardHeader>
            <CardContent className="w-full">
                <div className="flex flex-col gap-4">
                    <div className="w-full flex gap-5">
                        <div className="w-[200px] h-auto">
                            <FormLabel htmlFor="employee-avatar">
                                Ảnh đại diện
                                <RequireField />
                            </FormLabel>
                            <Input
                                id="employee-avatar"
                                type="file"
                                accept="image/*"
                                onChange={handleImage}
                                className="hidden"
                            />
                            <div className="w-full aspect-square overflow-hidden rounded-lg relative border box-border">
                                {previewUrl ? (
                                    <div className="w-full h-full group/group1">
                                        <div className="absolute top-0 left-0 w-full h-full hidden gap-2 bg-black bg-opacity-50 group-hover/group1:block">
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                type="button"
                                                className="w-5 h-5 p-0 rounded-full absolute right-1 top-1"
                                                onClick={clearImage}
                                            >
                                                <XIcon size={15} />
                                            </Button>
                                        </div>
                                        <img
                                            src={previewUrl}
                                            alt="preview"
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                ) : (
                                    <Label
                                        htmlFor="employee-avatar"
                                        className="flex w-full h-full items-center justify-center cursor-pointer hover:bg-black hover:bg-opacity-20"
                                    >
                                        <p className="font-normal text-xs">
                                            Chọn ảnh
                                        </p>
                                    </Label>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 h-fit grid grid-cols-2 gap-1">
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>
                                            Tên đệm
                                            <RequireField />
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tên đệm"
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
                                    <FormItem className="flex-1">
                                        <FormLabel>
                                            Tên gọi
                                            <RequireField />
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Tên gọi"
                                                {...field}
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
                                    <FormItem className="flex-1">
                                        <FormLabel>
                                            Giới tính
                                            <RequireField />
                                        </FormLabel>
                                        <FormControl>
                                            <SelectGenderDowndown
                                                onChange={handleGender}
                                                gender={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="birthday"
                                render={({ field }) => (
                                    <FormItem className="flex-1">
                                        <FormLabel>Sinh nhật</FormLabel>
                                        <FormControl>
                                            <SingleDatePicker
                                                selectedDate={field.value}
                                                onSelect={handleBirthday}
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
                                    <FormItem className="flex-1">
                                        <FormLabel>
                                            Số điện thoại
                                            <RequireField />
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Số điện thoại"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>
                    <div>
                        <UpdateHistory
                            createdAt={employee.createdAt}
                            updatedAt={employee.updatedAt}
                            userCreate={employee.userCreate}
                            userUpdate={employee.userUpdate}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
