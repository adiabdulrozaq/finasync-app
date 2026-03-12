import Link from "next/link";
import { ArrowRight, ShieldCheck, PieChart, Wallet } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-b from-white to-blue-50 text-center px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-6 heading-animate">
            Aman. Mudah. <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Terpercaya.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Sistem manajemen keuangan terbaik untuk mengontrol pemasukan dan pengeluaran Anda. Pantau dompet Anda kapan saja, di mana saja dengan aman.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group relative inline-flex items-center justify-center gap-2 rounded-full bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 w-full sm:w-auto"
            >
              Mulai Sekarang
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-20 bg-white px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Fitur Unggulan</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<ShieldCheck className="h-10 w-10 text-blue-600" />}
              title="Keamanan Tinggi"
              description="Data Anda dilindungi dengan enkripsi tingkat lanjut dan login aman via Google & Facebook."
            />
            <FeatureCard
              icon={<Wallet className="h-10 w-10 text-indigo-600" />}
              title="Pencatatan Cepat"
              description="Catat setiap transaksi masuk dan keluar hanya dengan beberapa klik."
            />
            <FeatureCard
              icon={<PieChart className="h-10 w-10 text-emerald-600" />}
              title="Analisis Pintar"
              description="Dapatkan ringkasan dan analisis keuangan melalui dashboard yang interaktif."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 text-center flex flex-col items-center">
      <div className="bg-white p-4 rounded-full shadow-sm mb-6 inline-flex">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
