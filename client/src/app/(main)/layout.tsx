import Navigation from "@/components/navigation";
import CartProductProvider from "@/context/cart-product.context";
import CartServiceProvider from "@/context/cart-service.context";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="w-full h-screen overflow-hidden flex flex-col">
            <CartProductProvider>
                <CartServiceProvider>
                    <Navigation />
                    <section className="w-full flex-1 overflow-hidden overflow-y-auto">
                        {children}
                    </section>
                </CartServiceProvider>
            </CartProductProvider>
        </main>
    );
}
