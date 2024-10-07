"use client";

import SelectCategoryTree from "@/components/select-category-tree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useSearchProduct from "@/hook/useSearchProduct.hook";
import { ICategory } from "@/interface/category.interface";
import { Filter, Minus } from "lucide-react";
import { ChangeEvent, useState } from "react";

export default function FilterProductPage() {
    const { filter, setFilter, resetFilter } = useSearchProduct();

    const [from, SetFrom] = useState<number>(filter.price.from || 0);
    const [to, SetTo] = useState<number>(filter.price.to || 0);

    const handleChangeFrom = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        SetFrom(value < 0 ? 0 : value);
    };

    const handleChangeTo = (e: ChangeEvent<HTMLInputElement>) => {
        const value = parseInt(e.target.value) || 0;
        SetTo(value < 0 ? 0 : value);
    };

    const onResetPrice = () => {
        SetFrom(0);
        SetTo(0);
        setFilter("price", {
            from: 0,
        });
    };

    const onConfirm = () => {
        setFilter("price", {
            from,
            ...(to ? { to } : {}),
        });
    };

    const onSelectCategory = (category: ICategory) => {
        setFilter(
            "categoryIds",
            filter.categoryIds
                ? filter.categoryIds.find((i) => i === category.id)
                    ? filter.categoryIds.filter((i) => i !== category.id)
                    : [...filter.categoryIds, category.id]
                : []
        );
    };

    const reset = () => {
        resetFilter();
        SetFrom(0);
        SetTo(0);
    };

    return (
        <div className="w-full h-fit flex flex-col gap-3">
            <div className="box-border w-fullh-fit flex flex-col gap-3">
                <div className="flex w-full items-center gap-2">
                    <Filter size={15} />
                    <p className="text-lg whitespace-nowrap font-medium">
                        Bộ lọc sản phẩm
                    </p>
                </div>
            </div>

            <div className="box-border w-full h-fit flex flex-col gap-3">
                <div>
                    <p className="text-base whitespace-nowrap">Danh mục</p>
                </div>
                <div className="h-fit flex flex-col gap-2">
                    <SelectCategoryTree
                        selected={filter.categoryIds || []}
                        onSelect={onSelectCategory}
                    />
                </div>
            </div>

            <Separator className="my-1" orientation="horizontal" />

            <div className="box-border w-full h-fit flex flex-col gap-3">
                <div>
                    <p className="text-base whitespace-nowrap">Khoảng giá</p>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="flex gap-1 w-full items-center hide-arrows">
                        <Input
                            placeholder="Từ"
                            className="focus-visible:ring-transparent"
                            type="number"
                            value={from}
                            onChange={handleChangeFrom}
                        />
                        <Minus size={15} />
                        <Input
                            placeholder="Đến"
                            className="focus-visible:ring-transparent"
                            type="number"
                            value={to}
                            onChange={handleChangeTo}
                        />
                    </div>
                    <div className="flex gap-2">
                        {(!!from || !!to) && (
                            <Button
                                className="flex-1"
                                size="sm"
                                onClick={onResetPrice}
                                variant="destructive"
                            >
                                Xóa
                            </Button>
                        )}
                        <Button
                            className="flex-1"
                            size="sm"
                            onClick={onConfirm}
                        >
                            Áp dụng
                        </Button>
                    </div>
                </div>
            </div>

            <Separator className="my-1" orientation="horizontal" />

            <div className="w-full">
                <Button
                    variant="destructive"
                    onClick={reset}
                    className="w-full"
                >
                    Xóa bộ lọc
                </Button>
            </div>
        </div>
    );
}
