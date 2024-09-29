import { IProductItemCart } from "@/interface/product.interface";
import { formatMoney } from "@/lib/money";
import ThumbnailMedia from "./thumbnail-media";
import { Separator } from "./ui/separator";

interface IOrderProductItemProps {
    productItem: IProductItemCart;
}

export default function OrderProductItem({
    productItem,
}: IOrderProductItemProps) {
    return (
        <div className="p-4 box-border w-full ">
            <div className="flex gap-3">
                <div className="w-[100px] aspect-square rounded overflow-hidden">
                    <ThumbnailMedia medias={productItem.product.productMedia} />
                </div>
                <div className="flex-1 ">
                    <p className="font-medium text-lg">
                        {productItem.product.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {productItem.product.description}
                    </p>
                    {productItem.productType && (
                        <div className="mt-2">
                            {productItem.productType.productTypesAttribute.map(
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

            {!!productItem.product.deletedAt ||
            (productItem.productType && !!productItem.productType.deletedAt) ? (
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
                                {productItem.productType
                                    ? formatMoney(productItem.productType.price)
                                    : formatMoney(productItem.product.price)}
                            </span>
                        </div>
                        <div className="w-full grid grid-cols-2">
                            <span className="font-medium text-sm text-primary col-span-1">
                                Tổng tạm tính
                            </span>
                            <span className="font-medium text-sm col-span-1 text-right">
                                {productItem.productType
                                    ? formatMoney(
                                          productItem.productType.price *
                                              productItem.quantity
                                      )
                                    : formatMoney(
                                          productItem.product.price *
                                              productItem.quantity
                                      )}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
