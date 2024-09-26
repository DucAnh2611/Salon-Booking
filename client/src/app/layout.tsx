import { ThemeProvider } from "@/components/theme-prodviders";
import { Toaster } from "@/components/ui/toaster";
import UserClientProvider from "@/context/user.context";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
    title: "Create Next App",
    description: "Generated by create next app",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={cn(
                    "min-h-[100dvh] w-full overflow-hidden bg-background font-sans antialiased relative",
                    inter.variable
                )}
            >
                <UserClientProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="system"
                        enableSystem
                        disableTransitionOnChange
                    >
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </UserClientProvider>
            </body>
        </html>
    );
}