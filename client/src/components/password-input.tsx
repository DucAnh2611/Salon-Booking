"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input, InputProps } from "./ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

interface IPasswordInputProps extends InputProps {}

export default function PasswordInput(props?: IPasswordInputProps) {
    const [show, SetShow] = useState<boolean>(false);

    const toggleShowPassword = () => {
        SetShow((s) => !s);
    };

    return (
        <div className="w-full relative flex gap-1">
            <Input
                {...props}
                type={show ? "text" : "password"}
                placeholder="Mật khẩu"
                className="flex-1"
            />
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={toggleShowPassword}
                        >
                            {show ? (
                                <EyeOffIcon size={15} />
                            ) : (
                                <EyeIcon size={15} />
                            )}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>{show ? "Ẩn" : "Hiện"}</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
}
