"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
import { Button } from "./ui/button";

const navigatge = [
    {
        code: "ME_INFO",
        url: "/me/i",
        title: "Thông tin cá nhân",
    },
];

export default function MeNavigation() {
    const [selected, SetSelected] = useState<string>("");

    const onSelect = (code: string) => () => {
        SetSelected(code);
    };

    return (
        <div className="flex flex-col h-fit">
            {navigatge.map((nav) => (
                <div key={nav.code}>
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full items-center justify-start",
                            selected === nav.code && "bg-muted"
                        )}
                        onClick={onSelect(nav.code)}
                        asChild
                    >
                        <Link href={nav.url}>{nav.title}</Link>
                    </Button>
                </div>
            ))}
        </div>
    );
}
