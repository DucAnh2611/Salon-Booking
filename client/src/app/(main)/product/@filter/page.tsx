"use client";

import SelectCategory from "@/components/select-category";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import useCategory from "@/hook/useCategory.hook";
import useSearchProduct from "@/hook/useSearchProduct.hook";
import { ICategory } from "@/interface/category.interface";
import { Filter, Minus } from "lucide-react";

export default function FilterProductPage() {
    const { categoryTree } = useCategory();
    const { filter, setFilter } = useSearchProduct();

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
                <div className="h-fit">
                    {categoryTree.map((category) => (
                        <SelectCategory
                            key={category.id}
                            categoryTree={category}
                            onSelect={(category: ICategory) => {}}
                        />
                    ))}
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
                            value={filter.price.from}
                        />
                        <Minus size={15} />
                        <Input
                            placeholder="Đến"
                            className="focus-visible:ring-transparent"
                            type="number"
                            value={filter.price.to || 0}
                        />
                    </div>
                    <div>
                        <Button className="w-full" size="sm">
                            Áp dụng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
