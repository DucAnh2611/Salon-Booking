"use client";

import useBank from "@/hook/useBank.hook";
import { IBank } from "@/interface/bank.interface";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, LoaderIcon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "./ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

interface ISelectSortProps {
    onSelect: (value: IBank | null) => void;
    value: IBank | null;
}

export default function SelectBanks({ onSelect, value }: ISelectSortProps) {
    const { banks, isLoading } = useBank();

    const [selected, SetSelected] = useState<IBank | null>(value);
    const [open, SetOpen] = useState<boolean>(false);

    const handleSelect = (select: IBank) => () => {
        const newSelected =
            selected && selected.id === select.id ? null : select;

        SetSelected(newSelected);
        onSelect(newSelected);
    };

    useEffect(() => {
        SetSelected(value);
    }, [value]);

    return (
        <Popover open={open} onOpenChange={SetOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    <span className="flex-1 whitespace-nowrap line-clamp-1 text-ellipsis">
                        {selected ? selected.name : "Chọn ngân hàng"}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>

            <PopoverContent align="start" className="p-2 w-[400px]">
                <Command className="">
                    <CommandInput placeholder="Tìm ngân hàng" />

                    <CommandList>
                        <CommandEmpty>Không tìm thấy.</CommandEmpty>
                        <CommandGroup>
                            {!isLoading ? (
                                banks.map((bank) => (
                                    <CommandItem
                                        key={bank.id}
                                        value={`${bank.code} ${bank.name}`}
                                        onSelect={handleSelect(bank)}
                                        className={cn(
                                            selected && selected.id === bank.id
                                                ? "bg-muted"
                                                : ""
                                        )}
                                    >
                                        <div className="flex gap-3 items-start">
                                            <div className="h-7 w-7 flex items-center justify-center">
                                                {selected &&
                                                selected.id === bank.id ? (
                                                    <Check size={15} />
                                                ) : (
                                                    <Image
                                                        src={bank.logo}
                                                        alt="bank_logo"
                                                        width={150}
                                                        height={150}
                                                        className="w-full h-full object-contain bg-white rounded-full"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="w-full mr-2 whitespace-nowrap text-primary font-medium">
                                                    {bank.code}
                                                </p>
                                                <p className="h-fit">{`${bank.name}`}</p>
                                            </div>
                                        </div>
                                    </CommandItem>
                                ))
                            ) : (
                                <CommandItem>
                                    <LoaderIcon
                                        size={15}
                                        className="animate-spin mr-2 h-4 w-4"
                                    />
                                    Đang tải
                                </CommandItem>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
