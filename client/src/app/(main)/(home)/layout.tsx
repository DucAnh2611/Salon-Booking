import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Trang chủ",
    description: "Trang chủ My Salon",
};

export default function HomeLayout({
    hero,
    product,
    service,
    policy,
}: Readonly<{
    hero: React.ReactNode;
    product: React.ReactNode;
    service: React.ReactNode;
    policy: React.ReactNode;
}>) {
    return (
        <div>
            {hero}
            {product}
            {service}
            {policy}
        </div>
    );
}
