import { IProductItemOrder } from "@/interface/api/product.interface";
import { formatMoney } from "@/utils/money";
import ThumbnailMedia from "./thumbnail-media";
import { Separator } from "./ui/separator";

interface IOrderProductItemProps {
    productItem: IProductItemOrder;
}

export default function OrderDetailProductItem({
    productItem,
}: IOrderProductItemProps) {
    return (
        <div className="p-4 box-border w-full border">
            <div className="flex gap-3">
                <div className="w-[100px] aspect-square rounded overflow-hidden">
                    <ThumbnailMedia
                        medias={productItem.productSnapshot.productMedia}
                    />
                </div>
                <div className="flex-1">
                    <p className="font-medium text-lg">
                        {productItem.productSnapshot.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {productItem.productSnapshot.description}
                    </p>
                    {productItem.productTypeSnapshot && (
                        <div className="mt-2">
                            {productItem.productTypeSnapshot.productTypesAttribute.map(
                                (av) => (
                                    <div
                                        key={av.attributeValueId}
                                        className="space-x-1 w-full flex justify-start items-center text-sm"
                                    >
                                        <span className="text-primary">
                                            {av.value.attribute.name}:
                                        </span>
                                        <span>{av.value.value}</span>
                                    </div>
                                )
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div>
                <p className="text-muted-foreground mt-3 text-xs w-full text-right">
                    SL: {productItem.quantity}
                </p>
            </div>
            <Separator className="my-2" orientation="horizontal" />

            {!!productItem.productSnapshot.deletedAt ||
            (productItem.productTypeSnapshot &&
                !!productItem.productTypeSnapshot.deletedAt) ? (
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
                                {productItem.productTypeSnapshot
                                    ? formatMoney(
                                          productItem.productTypeSnapshot.price
                                      )
                                    : formatMoney(
                                          productItem.productSnapshot.price
                                      )}
                            </span>
                        </div>
                        <div className="w-full grid grid-cols-2">
                            <span className="font-medium text-sm text-primary col-span-1">
                                Tổng tiền
                            </span>
                            <span className="font-medium text-sm col-span-1 text-right">
                                {formatMoney(productItem.totalPrice)}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
