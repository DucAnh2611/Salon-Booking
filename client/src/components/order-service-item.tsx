import { SERVICE_EMPLOYEE_EXP } from "@/constant/service-employee.constant";
import { IServiceItemCartBooking } from "@/interface/service.interface";
import { api_media_url } from "@/lib/apiCall";
import { formatMoney } from "@/lib/money";
import { joinString } from "@/lib/string";
import { format } from "date-fns";
import { ImageOff } from "lucide-react";
import Image from "next/image";
import ThumbnailMedia from "./thumbnail-media";
import { Separator } from "./ui/separator";

interface IOrderServiceItemProps {
    serviceItem: IServiceItemCartBooking;
}

export default function OrderServiceItem({
    serviceItem,
}: IOrderServiceItemProps) {
    return (
        <div className="w-full h-fit box-border p-2">
            <div className="w-full flex gap-5">
                <div className="w-[100px] aspect-square rounded overflow-hidden">
                    <ThumbnailMedia medias={serviceItem.service.media} />
                </div>
                <div className="flex-1">
                    <p className="text-lg font-medium">
                        {serviceItem.service.name}
                    </p>
                    <p className="font-bold text-primary text-base">
                        {formatMoney(serviceItem.service.price)}
                    </p>

                    <div className="grid grid-cols-7 text-sm gap-2 w-full mt-2">
                        <p className="text-primary col-span-1">Thời lượng</p>
                        <p className="col-span-6">
                            {joinString({
                                joinString: " ",
                                strings: [
                                    serviceItem.service.duration.toString(),
                                    "Phút",
                                ],
                            })}
                        </p>
                    </div>
                    <div className="grid grid-cols-7 text-sm gap-2 w-full">
                        <p className="text-primary col-span-1">Ngày đặt</p>
                        <p className="col-span-6">
                            {serviceItem.bookingTime
                                ? format(
                                      serviceItem.bookingTime,
                                      "yyyy/MM/dd HH:mm"
                                  )
                                : "Chưa chọn ngày"}
                        </p>
                    </div>
                    <div></div>
                </div>
            </div>
            <Separator className="my-2" orientation="horizontal" />

            <div>
                {serviceItem.employee ? (
                    <div className="w-full flex gap-3">
                        <div className="w-[100px] aspect-square rounded overflow-hidden bg-muted">
                            {serviceItem.employee.employee.userBase
                                .userAvatar ? (
                                <Image
                                    alt="select_s_e"
                                    src={joinString({
                                        joinString: "",
                                        strings: [
                                            api_media_url,
                                            serviceItem.employee.employee
                                                .userBase.userAvatar?.path,
                                        ],
                                    })}
                                    width={500}
                                    height={300}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full">
                                    <ImageOff size={15} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-base font-medium">
                                {joinString({
                                    joinString: " ",
                                    strings: [
                                        serviceItem.employee.employee.userBase
                                            .firstname,
                                        serviceItem.employee.employee.userBase
                                            .lastname,
                                    ],
                                })}
                            </p>
                            <p className="text-primary text-sm">
                                {joinString({
                                    joinString: " ",
                                    strings: [
                                        "Trình độ: ",
                                        SERVICE_EMPLOYEE_EXP[
                                            serviceItem.employee.experience
                                        ],
                                    ],
                                })}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        Chưa chọn nhân viên
                    </p>
                )}
            </div>

            <Separator className="my-2" orientation="horizontal" />

            {!!serviceItem.service.deletedAt ? (
                <div className="flex justify-end">
                    <p className="text-sm text-destructive">
                        Sản phẩm đã hoặc kiểu loại sản phẩm đã bị xóa
                    </p>
                </div>
            ) : (
                <div className="flex justify-end flex-col items-end">
                    <div className="w-[200px]">
                        <div className="w-full grid grid-cols-2">
                            <span className="font-medium text-sm text-primary col-span-1">
                                Giá
                            </span>
                            <span className="font-medium text-sm col-span-1 text-right">
                                {formatMoney(serviceItem.service.price)}
                            </span>
                        </div>
                        <div className="w-full grid grid-cols-2">
                            <span className="font-medium text-sm text-primary col-span-1">
                                Tổng tạm tính
                            </span>
                            <span className="font-medium text-sm col-span-1 text-right">
                                {formatMoney(serviceItem.service.price)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
