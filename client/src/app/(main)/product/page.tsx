"use client";

import ProductSearchCard from "@/components/product-search-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hook/useDebounce.hook";
import useSearchProduct from "@/hook/useSearchProduct.hook";
import {
    IApiSearchProduct,
    IProductItemSearch,
} from "@/interface/product.interface";
import { findProduct } from "@/lib/actions/product.action";
import { joinString } from "@/lib/string";
import { ChevronLeft, ChevronRight, LoaderIcon, Search } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";

export default function ProductPage() {
    const { filter, setFilter } = useSearchProduct();

    const [key, SetKey] = useState<string>(filter.key);
    const [products, SetProducts] = useState<IProductItemSearch[]>([]);
    const [count, SetCount] = useState<number>(0);
    const [isLoading, SetIsLoading] = useState<boolean>(false);

    const { debouncedValue: filterDebounce, isDebouncing } =
        useDebounce(filter);

    const handleChangeKey = (e: ChangeEvent<HTMLInputElement>) => {
        SetKey(e.target.value);
        setFilter("key", e.target.value);
    };

    const onSearch = () => {
        setFilter("key", key);
    };

    useEffect(() => {
        const getProduct = async (body: IApiSearchProduct) => {
            SetIsLoading(true);
            const { response } = await findProduct(body);

            if (response) {
                SetProducts(response.result.items);
                SetCount(response.result.count);
            } else {
                SetProducts([]);
                SetCount(0);
            }
            SetIsLoading(false);
        };

        getProduct(filter);
    }, [filterDebounce]);

    return (
        <div className="w-full flex flex-col gap-3">
            <div className="w-full flex gap-5 justify-between">
                <div className="flex gap-2 flex-1 ">
                    <Input
                        className="focus-visible:ring-transparent"
                        placeholder="Từ khóa"
                        onChange={handleChangeKey}
                    />
                    <Button onClick={onSearch} className="gap-1">
                        <Search size={15} />
                        Tìm kiếm
                    </Button>
                </div>
                <div className="flex gap-1 items-center  justify-end">
                    <div className="text-sm text-muted-foreground">
                        <span className="text-primary">{filter.page}</span>/
                        <span>{Math.ceil(count / filter.limit)}</span>
                    </div>
                    <Button
                        size={"icon"}
                        variant="outline"
                        disabled={filter.page <= 1}
                    >
                        <ChevronLeft size={15} />
                    </Button>
                    <Button
                        size={"icon"}
                        variant="outline"
                        disabled={
                            filter.page >= Math.ceil(count / filter.limit)
                        }
                    >
                        <ChevronRight size={15} />
                    </Button>
                </div>
            </div>
            <div className=" relative w-full">
                {!!products.length && (
                    <div className="grid grid-cols-4 gap-3 w-full">
                        {products.map((product) => (
                            <div key={product.id}>
                                <div className="w-full h-[330px]">
                                    <Link
                                        href={joinString({
                                            joinString: "/",
                                            strings: ["/p", product.id],
                                        })}
                                    >
                                        <ProductSearchCard product={product} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {!products.length && (
                    <div className="flex items-center justify-center py-16 w-full">
                        <p className="whitespace-nowrap w-fit">
                            Không có sản phẩm nào phù hợp
                        </p>
                    </div>
                )}
                {(isLoading || isDebouncing) && (
                    <div className="w-full h-full absolute left-0 top-0 flex items-center justify-center backdrop-blur-sm">
                        <div className="bg-foreground absolute w-full h-full top-0 left-0 z-[0] opacity-35 "></div>
                        <div className="relative z-[1] flex gap-1 items-center text-background">
                            <span>
                                <LoaderIcon
                                    size={15}
                                    className="animate-spin"
                                />
                            </span>
                            <span>Đang tải</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
