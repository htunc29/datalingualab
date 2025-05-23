"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const router = useRouter();

  const onSubmit = async (data) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      toast.success("Kaydınız Başarılı");
      router.push("/login");
    } else {
      const result = await res.json();
      toast.error("Hata: " + result.message);
    }
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700">
              Ad Soyad
            </label>
            <input
              {...register("name", { required: "Ad Soyad alanı zorunludur" })}
              type="text"
              placeholder="Adınızı ve Soyadınızı girin"
              className="outline-none mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
            {errors.name && (
              <span className="text-red-500 text-sm">
                {errors.name.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              {...register("email", {
                required: "Email alanı zorunludur",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Geçerli bir email adresi girin",
                },
              })}
              type="email"
              placeholder="Email adresinizi girin"
              className="outline-none mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
            {errors.email && (
              <span className="text-red-500 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700">Şifre</label>
            <input
              {...register("password", 
                { 
                  required: "Şifre alanı zorunludur", 
                  pattern:{
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
                    message: "Şifre en az 8 karakter, bir büyük harf ve bir rakam içermelidir"
                  }
                })}
              type="password"
              placeholder="Şifrenizi belirleyin"
              className="outline-none mt-1 w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-300"
            />
            {errors.password && (
              <span className="text-rose-500 mt-2 text-sm">{errors.password.message}</span>
            )}
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
