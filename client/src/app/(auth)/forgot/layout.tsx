import { ILayoutProps } from "@/interface/layout.interface";
import { ReactNode } from "react";

interface ILayoutForgotProps extends ILayoutProps {
    steps: ReactNode;
}

export default function Layout({ steps, children }: ILayoutForgotProps) {
    return (
        <div className="h-full flex flex-col gap-5 w-[500px] box-border py-5 items-center">
            <div className="w-full">{steps}</div>
            <div className="w-full flex-1">{children}</div>
        </div>
    );
}
