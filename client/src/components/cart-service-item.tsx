import { IServiceItemCart } from "@/interface/service.interface";
import { formatMoney } from "@/lib/money";
import ThumbnailMedia from "./thumbnail-media";
import { Separator } from "./ui/separator";

interface ICartServiceItemProps {
    serviceItem: IServiceItemCart;
}

export default function CartServiceItem({
    serviceItem,
}: ICartServiceItemProps) {
    return (
        <div className="p-4 box-border w-full ">
            <div className="flex gap-3">
                <div className="w-[100px] aspect-square rounded overflow-hidden">
                    <ThumbnailMedia medias={serviceItem.service.media} />
                </div>
                <div className="flex-1 flex flex-col h-auto justify-between">
                    <div>
                        <p className="font-medium text-lg">
                            {serviceItem.service.name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {serviceItem.service.description}
                        </p>
                    </div>
                    <div>
                        <p className="text-muted-foreground mt-3 text-xs w-full text-right">
                            SL: 1
                        </p>
                    </div>
                </div>
            </div>
            <Separator orientation="horizontal" className="my-2" />
            {!!serviceItem.service.deletedAt ? (
                <div className="flex justify-end">
                    <p className="text-sm text-destructive">
                        Dịch vụ không khả dụng hoặc đã bị xóa
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
