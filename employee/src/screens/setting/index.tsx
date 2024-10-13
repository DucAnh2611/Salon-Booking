import ResetSettingDialog from "@/components/dialog/dialog-reset-setting";
import TimeMinuteInput from "@/components/time-input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import { ISettingUpdate } from "@/interface/api/setting.interface";
import { settingGet, settingUpdate } from "@/lib/redux/actions/setting.action";
import { settingSelector } from "@/lib/redux/selector";
import { useAppDispatch, useAppSelector } from "@/lib/redux/store";
import { settingUpdateSchema } from "@/schemas/setting.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type TimeType = "otp" | "rspw" | "odcf";

export default function SettingScreen() {
    const dispatch = useAppDispatch();
    const { isCalling, isFailure, isUpdating, setting } =
        useAppSelector(settingSelector);

    const [submit, SetSubmit] = useState<boolean>(false);
    const [time, SetTime] = useState<ISettingUpdate>({
        otpEmailTime: 0,
        otpEmailUnit: "m",

        orderServiceConfirmTime: 0,
        orderServiceConfirmUnit: "m",

        resetPasswordTime: 0,
        resetPasswordUnit: "m",
    });

    const form = useForm<z.infer<typeof settingUpdateSchema>>({
        defaultValues: {
            otpEmailUnit: "m",
            resetPasswordUnit: "m",
            orderServiceConfirmUnit: "m",
        },
        resolver: zodResolver(settingUpdateSchema),
    });

    const handleChangeTimeMinutes = (type: TimeType) => (minutes: number) => {
        switch (type) {
            case "otp":
                form.setValue("otpEmailTime", minutes);
                SetTime((t) => ({
                    ...t,
                    otpEmailTime: minutes,
                }));
                break;

            case "rspw":
                form.setValue("resetPasswordTime", minutes);
                SetTime((t) => ({
                    ...t,
                    resetPasswordTime: minutes,
                }));
                break;

            case "odcf":
                form.setValue("orderServiceConfirmTime", minutes);
                SetTime((t) => ({
                    ...t,
                    orderServiceConfirmTime: minutes,
                }));
                break;

            default:
                return;
        }
    };

    const handleSubmit = () => {
        if (submit) return;
        SetSubmit(true);
        const formData = form.getValues();

        const body: ISettingUpdate = { ...formData };

        dispatch(settingUpdate(body));
    };

    const getCurrentSetting = () => {
        dispatch(settingGet());
    };

    useEffect(() => {
        getCurrentSetting();
    }, []);

    useEffect(() => {
        if (setting) {
            const regex = /^(\d+)([mhd])$/;

            const otpMatch = setting.otpVerifyEmail.match(regex);
            const rspwMatch = setting.resetPassword.match(regex);
            const odcfMatch = setting.orderServiceConfirm.match(regex);

            if (otpMatch && rspwMatch && odcfMatch) {
                const [_baseOtp, timeOtp, unitOtp] = otpMatch;
                const [_baseRspw, timeRspw, unitRspw] = rspwMatch;
                const [_baseOrcf, timeOrcf, unitOdcf] = odcfMatch;

                SetTime({
                    orderServiceConfirmTime: parseInt(timeOrcf),
                    orderServiceConfirmUnit: unitOdcf,

                    otpEmailTime: parseInt(timeOtp),
                    otpEmailUnit: unitOtp,

                    resetPasswordTime: parseInt(timeRspw),
                    resetPasswordUnit: unitRspw,
                });

                form.setValue("orderServiceConfirmTime", parseInt(timeOrcf));
                form.setValue("orderServiceConfirmUnit", unitOdcf);
                form.setValue("otpEmailTime", parseInt(timeOtp));
                form.setValue("otpEmailUnit", unitOtp);
                form.setValue("resetPasswordTime", parseInt(timeRspw));
                form.setValue("resetPasswordUnit", unitRspw);
            }
        }
    }, [setting, form]);

    useEffect(() => {
        if (submit && !isUpdating && !isFailure) {
            SetSubmit(false);
            toast({
                title: "Thành công",
                description: "Cập nhật thông tin cài đặt thành công",
            });
        }
    }, [submit, isUpdating, isFailure]);

    document.title = "Cài đặt";

    return (
        <div className="w-full flex-1 flex items-center justify-center">
            <Card className="max-w-[600px] !w-[600px] h-fit flex flex-col">
                <CardHeader>
                    <CardTitle>Cài đặt chung</CardTitle>
                    <CardDescription>
                        Cài đặt về một số thông tin của hệ thống.
                    </CardDescription>
                </CardHeader>
                {isCalling ? (
                    <div className="flex gap-2 justify-center py-10">
                        <LoaderCircle size={15} className="animate-spin" />
                        <span className="text-sm">Đang lấy dữ liệu</span>
                    </div>
                ) : (
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="h-fit flex flex-col"
                        >
                            <CardContent className="flex-1 flex flex-col gap-2">
                                <FormField
                                    control={form.control}
                                    name="otpEmailTime"
                                    render={({ field }) => (
                                        <FormItem className="w-full grid grid-cols-5 gap-3 items-start">
                                            <FormLabel className="col-span-2 text-right pt-6 box-border">
                                                Thời gian OTP Email
                                            </FormLabel>
                                            <div className="col-span-3">
                                                <FormControl>
                                                    <TimeMinuteInput
                                                        onChange={handleChangeTimeMinutes(
                                                            "otp"
                                                        )}
                                                        value={
                                                            time.otpEmailTime
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription className="mt-1">
                                                    Thời gian mã OTP hết hạn khi
                                                    xác thực Email.
                                                </FormDescription>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="resetPasswordTime"
                                    render={({ field }) => (
                                        <FormItem className="w-full grid grid-cols-5 gap-3 items-start">
                                            <FormLabel className="col-span-2 text-right pt-6 box-border">
                                                Thời gian đặt lại mật khẩu
                                            </FormLabel>
                                            <div className="col-span-3">
                                                <FormControl>
                                                    <TimeMinuteInput
                                                        onChange={handleChangeTimeMinutes(
                                                            "rspw"
                                                        )}
                                                        value={
                                                            time.resetPasswordTime
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription className="mt-1">
                                                    Thời gian của yêu cầu đặt
                                                    lại mật khẩu, sau thời gian
                                                    này, khách hàng sẽ nhận được
                                                    một email khác nếu vẫn mong
                                                    muốn đặt lại mật khẩu.
                                                </FormDescription>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="orderServiceConfirmTime"
                                    render={({ field }) => (
                                        <FormItem className="w-full grid grid-cols-5 gap-3 items-start">
                                            <FormLabel className="col-span-2 text-right pt-6 box-border">
                                                Thời gian xác nhận đơn dịch vụ
                                            </FormLabel>
                                            <div className="col-span-3">
                                                <FormControl>
                                                    <TimeMinuteInput
                                                        onChange={handleChangeTimeMinutes(
                                                            "odcf"
                                                        )}
                                                        value={
                                                            time.orderServiceConfirmTime
                                                        }
                                                    />
                                                </FormControl>
                                                <FormDescription className="mt-1">
                                                    Thời gian xác nhận đơn dịch
                                                    vụ, sau thời gian này, đơn
                                                    hàng tự động hủy.
                                                </FormDescription>
                                                <FormMessage />
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                            <CardFooter>
                                <div className="w-full flex justify-end gap-2">
                                    <ResetSettingDialog
                                        trigger={
                                            <Button
                                                type="button"
                                                variant="outline"
                                            >
                                                Đặt lại mặc định
                                            </Button>
                                        }
                                    />
                                    <Button
                                        type="submit"
                                        disabled={submit && isUpdating}
                                        className="gap-2"
                                    >
                                        {" "}
                                        {isUpdating && submit && (
                                            <LoaderCircle
                                                size={15}
                                                className="animate-spin"
                                            />
                                        )}{" "}
                                        Lưu
                                    </Button>
                                </div>
                            </CardFooter>
                        </form>
                    </Form>
                )}
            </Card>
        </div>
    );
}
