import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { SERVICE_EMPLOYEE_EXP_TEXT } from "@/constants/service.constant";
import { EServiceEmployeeExperience } from "@/enum/service.enum";
import { CheckIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface IPopoverSelectEmployeeExpProps {
    onSelect: (item: EServiceEmployeeExperience) => void;
    select: EServiceEmployeeExperience;
}

export default function PopoverSelectEmployeeExp({
    onSelect,
    select,
}: IPopoverSelectEmployeeExpProps) {
    const [selected, SetSelected] = useState<EServiceEmployeeExperience>(
        EServiceEmployeeExperience.BEGINNER
    );

    const onClick = (item: EServiceEmployeeExperience) => () => {
        SetSelected(item);
        onSelect(item);
    };

    useEffect(() => {
        SetSelected(select);
    }, [select]);

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="secondary" size="sm" type="button">
                    {SERVICE_EMPLOYEE_EXP_TEXT[selected]}
                </Button>
            </PopoverTrigger>
            <PopoverContent side="bottom" align="start">
                <div className="w-full">
                    <Label>Kinh nghiệm làm việc </Label>
                    <Separator
                        orientation="horizontal"
                        className="my-2 w-auto"
                    />
                    <div className="w-full flex flex-col gap-1">
                        {Object.entries(EServiceEmployeeExperience).map(
                            ([field, value]) => (
                                <Button
                                    key={value}
                                    variant={
                                        selected === value ? "default" : "ghost"
                                    }
                                    className="justify-between w-full"
                                    onClick={onClick(value)}
                                    type="button"
                                >
                                    {SERVICE_EMPLOYEE_EXP_TEXT[value]}
                                    {selected === value && (
                                        <CheckIcon size={15} />
                                    )}
                                </Button>
                            )
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
