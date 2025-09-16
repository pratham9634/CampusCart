import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ClerkProvider } from "@clerk/nextjs";
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

  title: "Campus Cart",
  description: "A marketplace for college students to buy and sell items on campus",
  icons: {
    icon: "public/logo_CampusCart.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <head>
        <link rel="icon" href="/logo_CampusCart.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar/>
        {children}
        <Footer/>
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
