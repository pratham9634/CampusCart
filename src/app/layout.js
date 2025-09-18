import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import { store } from "@/lib/store";

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
        <Provider store={store}>
        {children}
        </Provider>
        <Footer/>
        <Toaster
  position="bottom-left"
  reverseOrder={true}
  gutter={12}
  containerClassName="my-toast-container"
  containerStyle={{ zIndex: 9999 }}
  toastOptions={{
    duration: 4000,
    style: {
      background: "#1e293b",
      color: "#facc15",
      fontSize: "16px",
      padding: "12px 20px",
      borderRadius: "10px",
    },
    success: {
      duration: 3000,
      icon: '✅',
    },
    error: {
      duration: 5000,
      icon: '❌',
    },
    loading: {
      icon: '⏳',
    },
  }}
/>

      </body>
    </html>
    </ClerkProvider>
  );
}
