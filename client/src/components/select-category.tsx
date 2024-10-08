"use client";

import { ICategory } from "@/interface/category.interface";
import { CheckedState } from "@radix-ui/react-checkbox";
import { Checkbox } from "./ui/checkbox";
import { Label } from "./ui/label";

interface ISelectCategoryProps {
    categoryTree: ICategory;
    onSelect: (category: ICategory) => void;
    checked: boolean;
}

export default function SelectCategory({
    categoryTree,
    onSelect,
    checked = false,
}: ISelectCategoryProps) {
    const onCheck = (check: CheckedState) => {
        onSelect(categoryTree);
    };

    return (
        <div>
            <div className=" flex gap-2">
                <Checkbox onCheckedChange={onCheck} checked={checked} />
                <Label>{categoryTree.title}</Label>
            </div>
        </div>
    );
}
