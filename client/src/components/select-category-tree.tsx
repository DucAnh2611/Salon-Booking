"use client";

import { ICategoryTree } from "@/interface/category.interface";
import { getCategoryTree } from "@/lib/actions/category.action";
import { useEffect, useState } from "react";
import SelectCategoryItem from "./select-category-item";
import { Separator } from "./ui/separator";

interface ISelectCategoryTreeProps {
    onSelect: (category: ICategoryTree) => void;
    selected: string[];
    parentId?: string;
}

export default function SelectCategoryTree({
    parentId,
    selected,
    onSelect,
}: ISelectCategoryTreeProps) {
    const [categories, SetCategories] = useState<ICategoryTree[]>([]);
    const [loading, SetLoading] = useState<boolean>(false);

    const getTree = async (parentId?: string) => {
        SetLoading(true);
        const { response } = await getCategoryTree(parentId);

        if (response) {
            SetCategories(response.result);
        }
        SetLoading(false);
    };
    useEffect(() => {
        getTree(parentId);
    }, [parentId]);

    return (
        <div className="flex flex-col gap-1 relative">
            {categories.map((category) => (
                <div key={category.id}>
                    <SelectCategoryItem
                        onSelect={onSelect}
                        selected={selected}
                        category={category}
                    />
                    {!parentId && <Separator orientation="horizontal" />}
                </div>
            ))}
            {loading && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center bg-orange-300 bg-opacity-5 dark:bg-yellow-300">
                    <p className="text-foreground">Đang tải</p>{" "}
                </div>
            )}
        </div>
    );
}
