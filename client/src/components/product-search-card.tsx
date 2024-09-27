import { IProductItemSearch } from "@/interface/product.interface";
import { formatMoney } from "@/lib/money";
import { joinString } from "@/lib/string";
import { TruckIcon } from "lucide-react";
import Link from "next/link";
import ThumbnailMedia from "./thumbnail-media";
import { Card } from "./ui/card";

interface IProductSearchCard {
    product: IProductItemSearch;
}

export default function ProductSearchCard({ product }: IProductSearchCard) {
    const getProductPriceRange = () => {
        if (!product) return 0;
        if (!product.types.length) return formatMoney(product.price);

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
            <Card className="w-full h-full box-border p-3 cursor-pointer group hover:bg-muted">
                <div className="w-full h-full flex flex-col gap-2">
                    <div className="w-full flex-1 overflow-hidden  border rounded">
                        <div className="group-hover:scale-110 duration-100 w-full h-full">
                            <ThumbnailMedia medias={product.productMedia} />
                        </div>
                    </div>
                    <div>
                        <div className="w-full relative">
                            <p className="whitespace-normal text-ellipsis line-clamp-2 text-sm w-full h-[40px] overflow-hidden">
                                {product.name}
                            </p>
                        </div>
                        <div className="w-full relative">
                            <p className=" whitespace-normal line-clamp-1 text-primary text-base font-medium w-full text-nowrap text-ellipsis">
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
                    </div>
                </div>
            </Card>
        </Link>
    );
}
