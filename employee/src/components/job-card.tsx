import { ORDER_STATUS } from "@/constants/order.constant";
import { IJob } from "@/interface/api/job.interface";
import { cn } from "@/lib";
import { formatMoney } from "@/utils/money";
import { joinString } from "@/utils/string";
import { format } from "date-fns";
import MediaLoader from "./media-load";
import { Card } from "./ui/card";
import { Separator } from "./ui/separator";

export interface IJobCardProps {
    job: IJob;
}
export default function JobCard({ job }: IJobCardProps) {
    return (
        <Card className="my-2 hover:border-primary">
            <div>
                <div className="space-y-2 p-2">
                    <div className="flex justify-between">
                        <span className="text-primary font-medium text-sm">
                            {format(job.bookingTime, "yyyy/MM/dd HH:mm")}
                        </span>
                        <span
                            className={cn(
                                "text-primary font-medium text-sm",
                                !job.orderPaid
                                    ? "text-red-500"
                                    : "text-green-500"
                            )}
                        >
                            {job.orderPaid
                                ? "Đã thanh toán"
                                : "Chưa thanh toán"}
                        </span>
                    </div>
                    <div className="flex text-sm gap-2 w-full">
                        <span>Trạng thái đơn hàng</span>
                        <span className="flex-1 text-right text-primary font-medium">
                            {ORDER_STATUS[job.orderStatus]}
                        </span>
                    </div>
                </div>
                <Separator orientation="horizontal" />
                <div className="space-y-2 p-2 flex gap-2">
                    <div className="w-[100px] h-[100px] rounded-md overflow-hidden">
                        <MediaLoader
                            media={
                                job.serviceSnapshot.media.find(
                                    (i) => i.isThumbnail
                                )?.media || null
                            }
                        />
                    </div>
                    <Separator
                        orientation="vertical"
                        className="h-auto !mt-0"
                    />
                    <div className="flex-1 h-auto flex flex-col justify-between gap-2 !m-0 w-full overflow-hidden">
                        <div className="flex-1">
                            <p className="font-medium text-base w-full line-clamp-2 whitespace-normal break-words text-ellipsis overflow-hidden">
                                {job.serviceSnapshot.name}
                            </p>

                            <div className="grid grid-cols-5 text-sm gap-3 mt-1">
                                <p className="col-span-2 ">Mã đơn</p>
                                <p className="col-span-3 font-medium">
                                    {job.orderCode}
                                </p>
                            </div>

                            <div className="grid grid-cols-5 text-sm gap-3 mt-1">
                                <p className="col-span-2 ">Thời lượng</p>
                                <p className="col-span-3 font-medium">
                                    {joinString({
                                        joinString: " ",
                                        strings: [
                                            job.serviceSnapshot.duration.toString(),
                                            "phút",
                                        ],
                                    })}
                                </p>
                            </div>

                            <div className="grid grid-cols-5 text-sm gap-3">
                                <p className="col-span-2 ">Giá</p>
                                <p className="col-span-3 font-medium">
                                    {formatMoney(job.serviceSnapshot.price)}
                                </p>
                            </div>
                        </div>

                        <Separator orientation="horizontal" />

                        <div className="flex-1">
                            <div className="grid grid-cols-5 text-sm gap-3 mt-1">
                                <p className="col-span-2 ">Tên khách hàng</p>
                                <p className="col-span-3 font-medium">
                                    {job.clientName}
                                </p>
                            </div>

                            <div className="grid grid-cols-5 text-sm gap-3">
                                <p className="col-span-2 ">Sđt khách hàng</p>
                                <p className="col-span-3  font-medium">
                                    {job.clientPhone}
                                </p>
                            </div>
                        </div>

                        <Separator orientation="horizontal" />

                        <div>
                            <div className="grid grid-cols-5 text-sm gap-3">
                                <p className="col-span-2">Tổng đơn</p>
                                <p className="col-span-3 font-medium text-right text-primary">
                                    {formatMoney(job.total)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
