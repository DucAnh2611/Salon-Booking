import Navigation from "@/components/navigation";
import CartProductProvider from "@/context/cart-product.context";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="w-full h-screen overflow-hidden flex flex-col">
            <CartProductProvider>
                <Navigation />
                <section className="w-full flex-1 overflow-hidden overflow-y-auto">
                    {children}
                </section>
            </CartProductProvider>
        </main>
    );
}
