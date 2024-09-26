import useDebounce from "@/hook/useDebounce.hook";
import useProvince from "@/hook/useProvince.hook";
import { IWard } from "@/interface/province.interface";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown, LoaderIcon } from "lucide-react";
import { ChangeEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandItem,
    CommandList,
} from "./ui/command";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function WardCombobox() {
    const {
        ward: { wards, selected, loading },
        setSelected,
    } = useProvince();
    const [open, setOpen] = useState<boolean>(false);
    const [searchList, SetSearchList] = useState<IWard[]>(wards);
    const [key, SetKey] = useState<string>("");
    const { debouncedValue } = useDebounce<string>(key);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const key = e.target.value;
        SetKey(key);
    };

    const handleSelect = (ward: IWard) => () => {
        setSelected("w", ward);
    };

    useEffect(() => {
        const value = debouncedValue;
        if (!value) {
            SetSearchList(wards);
            return;
        }
        SetSearchList((list) =>
            wards.filter((item) =>
                item.name.toLowerCase().includes(value.toLowerCase())
            )
        );
    }, [debouncedValue]);

    useEffect(() => {
        SetSearchList(wards);
    }, [wards]);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {selected ? selected.name : "Chọn quận, huyện"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <Input
                        placeholder="Nhập quận, huyện"
                        onChange={handleSearch}
                        className=" focus-visible:ring-transparent border-x-0 border-t-none border-b rounded-none"
                    />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy.</CommandEmpty>
                        <CommandGroup>
                            {!loading ? (
                                searchList.map((ward) => (
                                    <CommandItem
                                        key={ward.code}
                                        value={ward.code.toString()}
                                        onSelect={handleSelect(ward)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                selected &&
                                                    selected.code === ward.code
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                        {ward.name}
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
