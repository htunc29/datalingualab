"use client"
import { SessionProvider } from "next-auth/react";
import { Roboto } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ToastContainer, toast } from 'react-toastify';
import moment from "moment";
const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function RootLayout({ children }) {
  moment.locale("tr");
  return (
    <html lang="en">
      <head>
        {/* FontAwesome Script */}
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/js/all.min.js"
        strategy="beforeInteractive"
      />
      </head>
      <body className={`${roboto.className} [&>button]:hover:cursor-pointer` }>
      <SessionProvider>
        {children}
        <ToastContainer/>
      </SessionProvider>
      </body>
    </html>
  );
}




