import Sidebar from "@/components/layout/Sidebar";

export default function RootLayout({ children }){
    return (
        <html lang="en">
        <head>
          <link rel="icon" href="/logo_CampusCart.png" />
        </head>
        <body>
           <main className="flex min-h-screen pt-20 bg-gray-100">
            {children}
           </main>
        </body>
        </html>
    );
}