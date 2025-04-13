"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // TODO: API bağlantısı buraya gelecek
    console.log("Kayıt olunuyor:", form);

    // Geçici yönlendirme
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        <div className="flex flex-col items-center mb-8">
          <Image
            width={120}
            height={120}
            className="rounded-full shadow-md hover:scale-105 transition-transform duration-300"
            src="/logo.png"
            alt="logo"
          />
          <h2 className="mt-4 text-2xl font-bold text-gray-800">Kayıt Ol</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-700">Ad Soyad</label>
            <input
              type="text"
              name="name"
              placeholder="Adınızı ve Soyadınızı girin"
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Email adresinizi girin"
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Şifre</label>
            <input
              type="password"
              name="password"
              placeholder="Şifrenizi belirleyin"
              onChange={handleChange}
              required
              className="mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors duration-300"
          >
            Kayıt Ol
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Zaten bir hesabınız var mı?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Giriş Yap
          </a>
        </p>
      </div>
    </div>
  );
}
