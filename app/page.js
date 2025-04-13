"use client";
import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm p-4 sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">DataLinguaLab</h1>
          <div className="space-x-4">
            <Link href="/login" className="text-gray-600 hover:text-indigo-600 transition-colors">
              Giriş Yap
            </Link>
            <Link href="/register" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
              Kayıt Ol
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 py-20">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 leading-tight">
            Kurumlara Özel Anket ve Test Oluşturma Platformu
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Sürükle-bırak arayüzüyle ses, görsel, dosya ve metin tabanlı sorular ekleyin. 
            Anketlerinizi AI destekli analiz paneliyle kolayca değerlendirin.
          </p>
          <Link href="/register">
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg hover:bg-indigo-700 transition">
              Platforma Katıl
            </button>
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="py-16 container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
          Neler Sunuyoruz?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <FeatureCard
            title="Gelişmiş Sürükle-Bırak"
            desc="Kod yazmadan, kullanıcı dostu arayüzle test ve anketler oluştur."
          />
          <FeatureCard
            title="Ses, Görsel ve Dosya Desteği"
            desc="Ses kaydı, dosya yükleme, çoktan seçmeli veya metin bazlı her format desteklenir."
          />
          <FeatureCard
            title="AI ile Sonuç Analizi"
            desc="Kurumlara özel sonuç değerlendirme. Anket sonuçlarını otomatik yorumla ve filtrele."
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ title, desc }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 text-center hover:shadow-lg transition">
      <h3 className="text-xl font-semibold mb-2 text-indigo-600">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </div>
  );
}
