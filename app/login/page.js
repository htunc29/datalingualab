"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { redirect, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";
import { set } from "react-hook-form";
import { HashLoader } from "react-spinners";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error,setError]=useState(null)
  const [loading, setLoading] = useState(false);
  async function handleLogin(e) {
    setLoading(true);
    e.preventDefault();

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res.ok) {
      toast.success("Giriş başarılı. Hoş geldin!");
      router.push("/dashboard");
    } else {
      setLoading(false)
      toast.error("Giriş başarısız. Lütfen bilgilerinizi kontrol edin.");
    }
  }


  const handleGoogleLogin = async (e) => {
    e.preventDefault();
    await signIn("google", { callbackUrl: "/dashboard" });
  };

  return (
   <>
   {loading ? <div className="h-screen w-screen flex justify-center items-center"><HashLoader/></div>: <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <Image
            width={120}
            height={120}
            className="rounded-full shadow-md hover:scale-105 transition-transform duration-300"
            src="/logo.png"
            alt="logo"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Giriş Yap</h2>
        </div>

        <form className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Email adresinizi girin"
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              placeholder="Şifrenizi girin"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
          </div>

          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-300"
          >
            Giriş Yap
          </button>
          <div>
            <p className="text-center">Hesabın yok mu ? Hemen <Link className="text-blue-700 underline" href={"/register"}>Kayıt Ol</Link></p>
          </div>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">veya</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 border border-gray-300 rounded-lg transition-colors duration-300"
          >
            <svg width={20} height={20} fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/>
            </svg>
            Google ile Giriş Yap
          </button>
        </form>
      </div>
    </div>}
   </>
  );
}
