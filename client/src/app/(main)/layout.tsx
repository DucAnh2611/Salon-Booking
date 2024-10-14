import Footer from "@/components/footer";
import Navigation from "@/components/navigation";
import CartProductProvider from "@/context/cart-product.context";
import CartServiceProvider from "@/context/cart-service.context";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="w-full h-screen overflow-hidden flex flex-col overflow-y-auto">
            <CartProductProvider>
                <CartServiceProvider>
                    <Navigation />
                    <div className="w-full flex-1 h-fit relative">
                        {children}
                    </div>
                    <Footer />
                </CartServiceProvider>
            </CartProductProvider>
        </main>
    );
}
