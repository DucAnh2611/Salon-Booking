import { ROUTER_PATH } from "@/constants/router.constant";
import { IStatisticDashboard } from "@/interface/api/dashboard.interface";
import { formatMoney } from "@/utils/money";
import { joinString } from "@/utils/string";
import MediaLoader from "./media-load";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";

interface IProductDashboardProps {
    statistic: IStatisticDashboard;
}

export default function ProductDashboard({
    statistic,
}: IProductDashboardProps) {
    const products = statistic.product.mostProductSold.map((product) => ({
        ...product,
        productSnapshot: product.productSnapshot[0],
        productTypeSnapshot: product.productTypeSnapshot
            ? product.productTypeSnapshot[0]
            : null,
    }));

    return (
        <Card>
            <CardHeader>
                <CardTitle>Top 10 sản phẩm bán nhiều nhất</CardTitle>
            </CardHeader>
            <Separator orientation="horizontal" />
            <CardContent className="h-fit max-h-[500px] overflow-y-auto">
                {!!statistic.product.mostProductSold.length ? (
                    <div className="flex flex-col py-2 gap-2">
                        {products.map((productOrder) => (
                            <div key={productOrder.productId}>
                                <a
                                    href={joinString({
                                        joinString: "/",
                                        strings: [
                                            ROUTER_PATH.PRODUCT,
                                            productOrder.productId,
                                        ],
                                    })}
                                    className="flex gap-5 w-full hover:bg-muted p-2 duration-150 cursor-pointer"
                                >
                                    <div className="flex gap-5 w-fit">
                                        <div className="h-[80px] w-[80px] rounded-md overflow-hidden">
                                            <MediaLoader
                                                media={
                                                    productOrder.productSnapshot.productMedia.filter(
                                                        (i) => i.isThumbnail
                                                    )[0].media || null
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="flex-1 h-fit">
                                        <p className="text-base line-clamp-2 w-full whitespace-normal break-words">
                                            {productOrder.productSnapshot.name}
                                        </p>
                                        <p className="text-lg font-bold text-primary line-clamp-1 w-full whitespace-normal break-words text-left">
                                            {formatMoney(
                                                productOrder.productTypeSnapshot
                                                    ? productOrder
                                                          .productTypeSnapshot
                                                          .price
                                                    : productOrder
                                                          .productSnapshot.price
                                            )}
                                        </p>
                                        {productOrder.productTypeSnapshot &&
                                            productOrder.productTypeSnapshot.productTypesAttribute.map(
                                                (attr) => (
                                                    <div
                                                        key={
                                                            attr.attributeValueId
                                                        }
                                                        className="w-full grid grid-cols-5 text-xs"
                                                    >
                                                        <span className="col-span-2 text-primary">
                                                            {
                                                                attr.value
                                                                    .attribute
                                                                    .name
                                                            }
                                                        </span>
                                                        <span className="col-span-3">
                                                            {attr.value.value}
                                                        </span>
                                                    </div>
                                                )
                                            )}
                                    </div>
                                    <Separator
                                        orientation="vertical"
                                        className="h-auto"
                                    />
                                    <div className="h-auto flex items-center justify-end">
                                        <p className="text-xs text-muted-foreground whitespace-nowrap">
                                            {joinString({
                                                joinString: " ",
                                                strings: [
                                                    "SL:",
                                                    productOrder.count.toString(),
                                                ],
                                            })}
                                        </p>
                                    </div>
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="">
                        <p className="w-full text-center text-sm text-muted-foreground py-10">
                            Không có sản phẩm nào phù hợp
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
