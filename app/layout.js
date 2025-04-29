import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/app/_components/Navbar";
import { Toaster } from "react-hot-toast";

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

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
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
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
