"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
    const { setTheme } = useTheme();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="icon"
                    className="size-10 items-center justify-center"
                >
                    <Sun
                        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
                        size={15}
                    />
                    <Moon
                        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
                        size={15}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Sáng
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Tối
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    Hệ thống
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
