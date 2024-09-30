import { ReactNode } from "react";

export default function ServiceLayout({ children }: { children: ReactNode }) {
    return <div className="flex flex-col min-h-full">{children}</div>;
}
