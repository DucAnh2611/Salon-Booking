"use client";

import { FORGOT_PASSWORD_STEPS } from "@/constant/password.constant";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
    const [step, SetStep] = useState<number>(0);
    const [init, SetInit] = useState<boolean>(false);

    const searchParam = useSearchParams();

    useEffect(() => {
        if (!init) SetInit(true);
        SetStep(parseInt(searchParam.get("step") || "0"));
        if (!searchParam.get("step") && init) {
            SetStep(1);
        }
    }, [searchParam, init]);

    useEffect(() => {
        document.title =
            FORGOT_PASSWORD_STEPS.find((i) => i.step === step)?.title || "";
    }, [step]);

    return (
        <div className="w-full relative">
            <div className="absolute z-0 h-0 w-full border-t-[1px] top-5 left-0 -translate-y-1/2" />
            <div className="grid grid-cols-3 w-full items-center relative z-[1]">
                {FORGOT_PASSWORD_STEPS.map(({ step: s, Icon, title }) => (
                    <div
                        key={"step" + s + title}
                        className="flex justify-center flex-col items-center gap-2 w-full"
                    >
                        <div
                            className={cn(
                                "border-4 border-background box-border size-10 bg-background"
                            )}
                        >
                            <div
                                className={cn(
                                    "w-full h-full rounded-full flex items-center justify-center relative",
                                    step === s &&
                                        "bg-primary border-transparent text-background scale-110 shadow-md shadow-primary before:content-[''] before:w-full before:h-full before:rounded-full before:bg-primary before:animate-ping before:delay-1000 before:z-[0] before:absolute before:top-0 before:left-0",
                                    step < s &&
                                        "bg-background border border-muted text-muted-foreground",
                                    step > s &&
                                        "bg-green-500 border border-green-500 bg-opacity-25 text-green-500"
                                )}
                            >
                                <Icon size={16} />
                            </div>
                        </div>
                        <p
                            className={cn(
                                "text-sm",
                                step === s && "text-primary",
                                step < s && "text-muted-foreground",
                                step > s && "text-green-500"
                            )}
                        >
                            {title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
