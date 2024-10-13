"use client";

import ForgotPasswordStep1 from "@/components/forgot-password-step-one";
import ForgotPasswordStep2 from "@/components/forgot-password-step-second";
import ForgotPasswordStep3 from "@/components/forgot-password-step-third";
import withoutAuth from "@/hoc/withoutAuth";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

function Page() {
    const [step, SetStep] = useState<number>(0);

    const searchParam = useSearchParams();

    useEffect(() => {
        SetStep(parseInt(searchParam.get("step") || "0"));
    }, [searchParam]);

    switch (step) {
        case 1:
            return <ForgotPasswordStep1 />;

        case 2:
            return <ForgotPasswordStep2 />;

        case 3:
            return <ForgotPasswordStep3 />;

        default:
            return (
                <div className="flex items-center justify-center py-10">
                    <p>Đang kiểm tra</p>
                </div>
            );
    }
}
export default withoutAuth(Page);
