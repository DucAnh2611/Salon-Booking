import { GENDER_TEXT } from "@/constants/gender.constant";
import { EGender } from "@/enum/gender.enum";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ISelectGenderDropdownProps {
    onChange: (gender: EGender) => void;
    gender: EGender;
}
export default function SelectGenderDowndown({
    onChange,
    gender,
}: ISelectGenderDropdownProps) {
    const [select, SetSelect] = useState<EGender>(gender);

    const handleSelect = (gender: EGender) => () => {
        onChange(gender);
    };

    useEffect(() => {
        if (gender !== select) {
            SetSelect(gender);
        }
    }, [gender]);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                    {GENDER_TEXT[select]}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                side="bottom"
                align="start"
                className="w-[200px]"
            >
                <DropdownMenuLabel>Giới tính</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(EGender).map(([field, value]) => (
                    <DropdownMenuItem key={field} asChild>
                        <Button
                            onClick={handleSelect(field as EGender)}
                            className="w-full justify-between gap-1 cursor-pointer"
                            variant={select === field ? "default" : "ghost"}
                        >
                            <span>{GENDER_TEXT[value]}</span>
                            {select === field && <CheckIcon size={15} />}
                        </Button>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
