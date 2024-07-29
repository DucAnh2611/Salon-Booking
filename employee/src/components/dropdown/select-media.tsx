import { EFileType } from "@/enum/media.enum";
import {
    CheckIcon,
    ImageIcon,
    ImagePlayIcon,
    MonitorPlayIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface ISelectMediaTypeDropdown {
    onChange: (type: EFileType | null) => void;
    type: EFileType | null;
}

const parseValue: { [key in EFileType]: { content: string; Icon: any } } = {
    [EFileType.IMAGE]: { content: "Ảnh", Icon: ImageIcon },
    [EFileType.VIDEO]: { content: "Video", Icon: MonitorPlayIcon },
};

export default function SelectMediaTypeDropdown({
    onChange,
    type,
}: ISelectMediaTypeDropdown) {
    const [select, SetSelect] = useState<EFileType | null>(type);

    const handleSelect = (type: EFileType | null) => () => {
        onChange(type);
        SetSelect(type);
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline">
                    {select ? <>{parseValue[select].content}</> : "Tất cả"}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Loại file phương tiện</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Button
                        onClick={handleSelect(null)}
                        className="w-full justify-start gap-1 cursor-pointer"
                        variant={!select ? "default" : "ghost"}
                    >
                        {!select ? (
                            <CheckIcon size={15} />
                        ) : (
                            <ImagePlayIcon size={15} />
                        )}
                        <span>Tất cả</span>
                    </Button>
                </DropdownMenuItem>
                {Object.entries(parseValue).map(
                    ([field, { content, Icon }]) => (
                        <DropdownMenuItem key={field} asChild>
                            <Button
                                onClick={handleSelect(field as EFileType)}
                                className="w-full justify-start gap-1 cursor-pointer"
                                variant={select === field ? "default" : "ghost"}
                            >
                                {select === field ? (
                                    <CheckIcon size={15} />
                                ) : (
                                    <Icon size={15} />
                                )}
                                <span>{content}</span>
                            </Button>
                        </DropdownMenuItem>
                    )
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
