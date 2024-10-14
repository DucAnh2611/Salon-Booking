"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useOrderTracking from "@/hook/useOrderTracking.hook";
import { joinString } from "@/lib/string";
import { List, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { KeyboardEvent, useEffect, useState } from "react";

export default function Tracking() {
    const router = useRouter();
    const { setCode } = useOrderTracking();
    const search = useSearchParams();

    const [searchCode, SetSearchCode] = useState<string>("");

    const code = search.get("code");

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const newCode = e.currentTarget.value;
        SetSearchCode(newCode);
        if (e.key === "Enter" && !!newCode && newCode !== code) {
            router.push(`/tracking?code=${e.currentTarget.value}`);
        }
    };

    useEffect(() => {
        if (code) {
            setCode(code);
            SetSearchCode(code);
        }
    }, [code]);

    document.title = "Tra cứu đơn hàng";

    return (
        <div>
            <div className="flex gap-2">
                <Button className="gap-2" variant={"outline"} asChild>
                    <Link href={"/order"}>
                        <List size={15} />
                        Danh sách đơn hàng
                    </Link>
                </Button>
                <Input
                    defaultValue={code || ""}
                    placeholder="Mã đơn hàng"
                    onKeyDown={handleKeyDown}
                    className="flex-2"
                />
                <Button className="gap-2 flex-1" asChild>
                    <Link
                        href={joinString({
                            joinString: "",
                            strings: ["/tracking?code=", searchCode],
                        })}
                    >
                        <Search size={15} />
                        Tra cứu
                    </Link>
                </Button>
            </div>
        </div>
    );
}
