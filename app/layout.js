"use client";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { Roboto } from "next/font/google";
import { useRouter } from "next/navigation";
import Script from "next/script";
import "./globals.css";

const roboto = Roboto({ weight: "400", subsets: ["latin"] });

export default function RootLayout({ children }) {
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
          <AuthContent />
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

function AuthContent() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    session && (
      <button onClick={handleLogout}>Çıkış Yap</button>
    )
  );
}
