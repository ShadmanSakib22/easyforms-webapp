import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/app/_components/Navbar";
import Footer from "@/app/_components/Footer";
import { Toaster } from "react-hot-toast";
import { NextIntlClientProvider } from "next-intl";
import { getLocale } from "next-intl/server";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ezForms",
  description: "Easily create questionaries from unlimited templates.",
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();

  return (
    <ClerkProvider>
      <html lang={locale} className="bg-grid">
        <NextIntlClientProvider>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            suppressHydrationWarning={true}
          >
            <Navbar />
            <Toaster
              position="bottom-center"
              reverseOrder={false}
              toastOptions={{
                className:
                  "bg-base-300! text-base-content! border! border-primary!",
                duration: 5000,
              }}
            />
            <div className="min-h-screen">{children}</div>
            <Footer />
          </body>
        </NextIntlClientProvider>
      </html>
    </ClerkProvider>
  );
}
