"use client";

import { ICategoryTree } from "@/interface/category.interface";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import SelectCategoryTree from "./select-category-tree";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";

interface ISelectCategoryItemProps {
    onSelect: (category: ICategoryTree) => void;
    category: ICategoryTree;
    selected: string[];
}

export default function SelectCategoryItem({
    category,
    selected,
    onSelect,
}: ISelectCategoryItemProps) {
    const [open, SetOpen] = useState<boolean>(false);

    const toggleOpen = () => {
        SetOpen((o) => !o);
    };

    const handleSelect = () => {
        onSelect(category);
    };

    return (
        <div>
            <div className="flex items-center group h-[30px]">
                <div className="flex items-center flex-1 gap-2 group-hover:text-primary">
                    <Checkbox
                        checked={!!selected.find((i) => i === category.id)}
                        onCheckedChange={handleSelect}
                    />
                    <p className="text-sm font-medium">{category.title}</p>
                </div>
                {category.haveChildren && (
                    <div>
                        <Button
                            size="icon"
                            className="w-fit h-fit p-2"
                            variant={"ghost"}
                            onClick={toggleOpen}
                        >
                            {open ? (
                                <ChevronUp size={15} />
                            ) : (
                                <ChevronDown size={15} />
                            )}
                        </Button>
                    </div>
                )}
            </div>
            {category.haveChildren && open && (
                <div className="box-border pl-5 mb-3">
                    <SelectCategoryTree
                        onSelect={onSelect}
                        selected={selected}
                        parentId={category.id}
                    />
                </div>
            )}
        </div>
    );
}
