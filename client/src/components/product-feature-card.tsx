import { IProductItemFeature } from "@/interface/product.interface";
import { formatMoney } from "@/lib/money";
import { joinString } from "@/lib/string";
import { TruckIcon } from "lucide-react";
import Link from "next/link";
import ThumbnailMedia from "./thumbnail-media";
import { Button } from "./ui/button";

interface IProductFeatureCardProps {
    product: IProductItemFeature;
}

export default function ProductFeatureCard({
    product,
}: IProductFeatureCardProps) {
    const getProductPriceRange = () => {
        if (!product) return 0;
        if (!product.types.length) return product.price;

        let [min, max] = [Infinity, 0];

        const price = `${formatMoney(product.price)}`;

        for (const type of product.types) {
            if (type.price > max) {
                max = type.price;
            }
            if (type.price < min) {
                min = type.price;
            }
        }

        if (min === max) return `${formatMoney(min)}`;

        return `${formatMoney(min)} - ${formatMoney(max)}`;
    };

    return (
        <Link
            href={joinString({
                joinString: "/",
                strings: ["/p", product.id],
            })}
        >
            <div className="w-full h-fit flex flex-col rounded-md border border-neutral-200 dark:border-neutral-700 box-border overflow-hidden  hover:bg-muted group cursor-pointer gap-2 p-4">
                <div className="w-full h-[200px] overflow-hidden rounded">
                    <div className="w-full h-full group-hover:scale-105 duration-100 ">
                        <ThumbnailMedia medias={product.productMedia} />
                    </div>
                </div>
                <div className="box-border flex-1">
                    <div className="w-full relative">
                        <p className="whitespace-normal break-words line-clamp-2 text-base w-full h-[50px] text-wrap">
                            {product.name}
                        </p>
                    </div>
                    <div className="w-full relative">
                        <p className=" whitespace-normal line-clamp-1 text-primary text-lg font-medium w-full text-nowrap text-ellipsis">
                            {getProductPriceRange()}
                        </p>
                    </div>
                    <div className="w-full relative mt-1 flex">
                        <div className="flex gap-1 items-center whitespace-normal line-clamp-1 text-xs w-full text-green-500 text-nowrap text-ellipsis italic">
                            <span>
                                <TruckIcon size={13} />
                            </span>
                            <span>Miễn phí vận chuyển</span>
                        </div>
                    </div>
                    <div className="w-full relative">
                        <p className=" whitespace-normal line-clamp-1 text-xs w-full text-nowrap text-ellipsis italic text-muted-foreground">
                            {`(${product.buyingCounts || 0}) lượt mua`}
                        </p>
                    </div>
                    <div className="w-full mt-2">
                        <Button
                            className="w-full"
                            size="sm"
                            variant="default"
                            asChild
                        >
                            <Link
                                href={joinString({
                                    joinString: "/",
                                    strings: ["/p", product.id],
                                })}
                            >
                                Xem chi tiết
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </Link>
    );
}
