import { SERVICE_EMPLOYEE_EXP_TEXT } from "@/constants/service.constant";
import { IServiceItemOrder } from "@/interface/api/service.interface";
import { api_media_url } from "@/utils/apiCall";
import { formatMoney } from "@/utils/money";
import { joinString } from "@/utils/string";
import { format } from "date-fns";
import { ImageOff } from "lucide-react";
import ThumbnailMedia from "./thumbnail-media";
import { Separator } from "./ui/separator";

interface IOrderDetailServiceItemProps {
    serviceItem: IServiceItemOrder;
}

export default function OrderDetailServiceItem({
    serviceItem,
}: IOrderDetailServiceItemProps) {
    return (
        <div className="w-full h-fit box-border p-2 border">
            <div className="w-full flex gap-5">
                <div className="w-[100px] aspect-square rounded overflow-hidden">
                    <ThumbnailMedia
                        medias={serviceItem.serviceSnapshot.media}
                    />
                </div>
                <div className="flex-1">
                    <p className="text-lg font-medium">
                        {serviceItem.serviceSnapshot.name}
                    </p>
                    <p className="font-bold text-primary text-base">
                        {formatMoney(serviceItem.serviceSnapshot.price)}
                    </p>

                    <div className="grid grid-cols-7 text-sm gap-2 w-full mt-2">
                        <p className="text-primary col-span-1">Thời lượng</p>
                        <p className="col-span-6">
                            {joinString({
                                joinString: " ",
                                strings: [
                                    serviceItem.serviceSnapshot.duration.toString(),
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
                {serviceItem.employeeSnapShot ? (
                    <div className="w-full flex gap-3">
                        <div className="w-[100px] aspect-square rounded overflow-hidden bg-muted">
                            {serviceItem.employeeSnapShot.employee.userBase
                                .userAvatar ? (
                                <img
                                    alt="select_s_e"
                                    src={joinString({
                                        joinString: "",
                                        strings: [
                                            api_media_url,
                                            serviceItem.employeeSnapShot
                                                .employee.userBase.userAvatar
                                                ?.path,
                                        ],
                                    })}
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
                                        serviceItem.employeeSnapShot.employee
                                            .userBase.lastname,
                                        serviceItem.employeeSnapShot.employee
                                            .userBase.firstname,
                                    ],
                                })}
                            </p>
                            <p className="text-primary text-sm">
                                {joinString({
                                    joinString: " ",
                                    strings: [
                                        "Trình độ: ",
                                        SERVICE_EMPLOYEE_EXP_TEXT[
                                            serviceItem.employeeSnapShot
                                                .experience
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
            <div className="flex justify-end flex-col items-end">
                <div className="w-[200px]">
                    <div className="w-full grid grid-cols-2">
                        <span className="font-medium text-sm text-primary col-span-1">
                            Tổng
                        </span>
                        <span className="font-medium text-sm col-span-1 text-right">
                            {formatMoney(serviceItem.serviceSnapshot.price)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
