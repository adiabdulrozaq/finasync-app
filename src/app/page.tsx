import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  PieChart,
  Wallet,
  TrendingUp,
  Target,
  RefreshCw,
  PiggyBank,
  BarChart3,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col min-h-[calc(100vh-4rem)]">
        {/* ====== HERO SECTION ====== */}
        <section className="relative w-full overflow-hidden py-20 md:py-32 lg:py-40 px-4">
          {/* Animated background */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom right, var(--hero-from, #eff6ff), var(--hero-via, #ffffff), var(--hero-to, #f5f3ff))' }} />
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-primary-400/10 blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-violet-400/10 blur-3xl animate-float delay-300" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full bg-emerald-400/5 blur-3xl" />

          <div className="relative container mx-auto max-w-5xl text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-4 py-1.5 text-sm font-medium text-primary-700 mb-8 animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Platform Keuangan #1 di Indonesia
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-[var(--foreground)] mb-6 animate-slide-up">
              Kelola Keuangan{" "}
              <span className="gradient-text">Lebih Cerdas</span>
              <br className="hidden sm:block" />
              dan Terorganisir
            </h1>

            <p className="text-lg md:text-xl text-[var(--muted-foreground)] mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up delay-100">
              Sistem manajemen keuangan terlengkap untuk mengontrol semua aspek
              keuangan Anda — pemasukan, pengeluaran, anggaran, tabungan, hingga
              transaksi berulang. Semua dalam satu dashboard yang indah.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
              <Link
                href="/login"
                className="group relative inline-flex items-center justify-center gap-2 rounded-2xl gradient-blue px-8 py-4 text-base font-bold text-white shadow-xl shadow-primary-500/25 transition-all hover:shadow-2xl hover:-translate-y-1 w-full sm:w-auto"
              >
                Mulai Gratis Sekarang
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--card)] px-8 py-4 text-base font-semibold text-[var(--foreground)] shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 w-full sm:w-auto justify-center"
              >
                Lihat Fitur
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-lg mx-auto animate-slide-up delay-300">
              {[
                { value: "10K+", label: "Pengguna Aktif" },
                { value: "99.9%", label: "Uptime" },
                { value: "100%", label: "Gratis" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl sm:text-3xl font-extrabold gradient-text">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== FEATURES SECTION ====== */}
        <section id="features" className="w-full py-20 md:py-28 px-4 bg-[var(--card)]">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-primary-50 px-4 py-1.5 text-sm font-semibold text-primary-600 mb-4">
                Fitur Unggulan
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4">
                Semua yang Anda Butuhkan
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-2xl mx-auto">
                FinaSync menyediakan semua fitur yang dibutuhkan untuk mengelola
                keuangan pribadi secara profesional.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              <FeatureCard
                icon={<ShieldCheck className="h-7 w-7" />}
                title="Keamanan Tingkat Tinggi"
                description="Data terenkripsi dengan login aman via Google & Facebook. Privasi Anda adalah prioritas utama."
                color="blue"
              />
              <FeatureCard
                icon={<Wallet className="h-7 w-7" />}
                title="Pencatatan Cepat"
                description="Catat setiap transaksi masuk dan keluar hanya dengan beberapa klik. Cepat, mudah, dan akurat."
                color="emerald"
              />
              <FeatureCard
                icon={<PieChart className="h-7 w-7" />}
                title="Analisis Mendalam"
                description="Dashboard interaktif dengan grafik dan chart untuk memahami pola keuangan Anda."
                color="violet"
              />
              <FeatureCard
                icon={<Target className="h-7 w-7" />}
                title="Anggaran Bulanan"
                description="Tetapkan batas pengeluaran per bulan dan pantau progres Anda secara real-time."
                color="amber"
              />
              <FeatureCard
                icon={<RefreshCw className="h-7 w-7" />}
                title="Transaksi Berulang"
                description="Atur langganan dan pembayaran rutin agar tidak pernah terlewat lagi."
                color="rose"
              />
              <FeatureCard
                icon={<PiggyBank className="h-7 w-7" />}
                title="Target Tabungan"
                description="Buat target tabungan dengan deadline dan pantau kemajuan menuju impian Anda."
                color="teal"
              />
            </div>
          </div>
        </section>

        {/* ====== HOW IT WORKS ====== */}
        <section className="w-full py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <span className="inline-block rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-600 mb-4">
                Cara Kerja
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[var(--foreground)] mb-4">
                Tiga Langkah Mudah
              </h2>
              <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
                Mulai kelola keuangan Anda dalam hitungan menit.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                {
                  step: "01",
                  title: "Buat Akun",
                  description: "Daftar gratis menggunakan akun Google atau Facebook Anda. Tanpa form panjang.",
                  icon: <Sparkles className="h-6 w-6" />,
                },
                {
                  step: "02",
                  title: "Catat Transaksi",
                  description: "Mulai catat pemasukan dan pengeluaran Anda dengan kategorisasi yang rapi.",
                  icon: <BarChart3 className="h-6 w-6" />,
                },
                {
                  step: "03",
                  title: "Pantau & Analisis",
                  description: "Lihat dashboard, analisis tren, dan kelola anggaran untuk keuangan yang lebih sehat.",
                  icon: <TrendingUp className="h-6 w-6" />,
                },
              ].map((item, idx) => (
                <div key={idx} className="relative text-center group">
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-12 left-[60%] w-[80%] border-t-2 border-dashed border-[var(--border)]" />
                  )}
                  <div className="relative z-10 mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary-500 to-violet-500 text-white shadow-xl shadow-primary-500/20 transition-transform group-hover:scale-105 group-hover:-translate-y-1">
                    {item.icon}
                    <span className="absolute -top-2 -right-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--card)] text-xs font-extrabold text-primary-600 shadow-md border border-[var(--border)]">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[var(--foreground)] mb-2">{item.title}</h3>
                  <p className="text-[var(--muted-foreground)] text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ====== CTA SECTION ====== */}
        <section className="w-full py-20 md:py-28 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-violet-600 p-10 md:p-16 text-center text-white shadow-2xl shadow-primary-500/20">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
                  Siap Mengelola Keuangan Anda?
                </h2>
                <p className="text-primary-100 text-lg mb-8 max-w-xl mx-auto">
                  Bergabung sekarang dan rasakan kemudahan mengelola keuangan
                  pribadi dengan FinaSync. Sepenuhnya gratis.
                </p>
                <Link
                  href="/login"
                  className="group inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-4 text-base font-bold text-primary-600 shadow-lg transition-all hover:shadow-xl hover:-translate-y-1"
                >
                  Mulai Sekarang — Gratis
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ====== FOOTER ====== */}
        <footer className="w-full border-t border-[var(--border)] bg-[var(--card)] py-12 px-4">
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
              {/* Brand */}
              <div className="sm:col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-blue shadow-md">
                    <Wallet className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-lg font-bold text-[var(--foreground)]">
                    Fina<span className="text-primary-500">Sync</span>
                  </span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                  Solusi manajemen keuangan pribadi modern dan terpercaya.
                </p>
              </div>

              {/* Product */}
              <div>
                <h4 className="font-bold text-sm text-[var(--foreground)] mb-4 uppercase tracking-wider">Produk</h4>
                <ul className="space-y-2.5">
                  {["Dashboard", "Analitik", "Anggaran", "Tabungan"].map((item) => (
                    <li key={item}>
                      <span className="text-sm text-[var(--muted-foreground)] hover:text-primary-500 cursor-pointer transition">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Features */}
              <div>
                <h4 className="font-bold text-sm text-[var(--foreground)] mb-4 uppercase tracking-wider">Fitur</h4>
                <ul className="space-y-2.5">
                  {["Pencatatan Transaksi", "Transaksi Berulang", "Kategori", "Export Data"].map((item) => (
                    <li key={item}>
                      <span className="text-sm text-[var(--muted-foreground)] hover:text-primary-500 cursor-pointer transition">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal */}
              <div>
                <h4 className="font-bold text-sm text-[var(--foreground)] mb-4 uppercase tracking-wider">Lainnya</h4>
                <ul className="space-y-2.5">
                  {["Kebijakan Privasi", "Syarat & Ketentuan", "Bantuan", "Kontak"].map((item) => (
                    <li key={item}>
                      <span className="text-sm text-[var(--muted-foreground)] hover:text-primary-500 cursor-pointer transition">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-[var(--muted-foreground)]">
                © {new Date().getFullYear()} FinaSync. All rights reserved.
              </p>
              <p className="text-sm text-[var(--muted-foreground)]">
                Dibuat dengan ❤️ di Indonesia
              </p>
            </div>
          </div>
        </footer>
      </main>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}) {
  const colorMap: Record<string, { bg: string; text: string; shadow: string }> = {
    blue: { bg: "bg-primary-50", text: "text-primary-600", shadow: "shadow-primary-500/10" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-600", shadow: "shadow-emerald-500/10" },
    violet: { bg: "bg-violet-50", text: "text-violet-600", shadow: "shadow-violet-500/10" },
    amber: { bg: "bg-amber-50", text: "text-amber-600", shadow: "shadow-amber-500/10" },
    rose: { bg: "bg-rose-50", text: "text-rose-600", shadow: "shadow-rose-500/10" },
    teal: { bg: "bg-emerald-50", text: "text-emerald-600", shadow: "shadow-emerald-500/10" },
  };

  const c = colorMap[color] || colorMap.blue;

  return (
    <div className="group relative rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6 md:p-8 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className={`inline-flex rounded-2xl ${c.bg} p-3.5 mb-5 shadow-md ${c.shadow} transition-transform group-hover:scale-110`}>
        <div className={c.text}>{icon}</div>
      </div>
      <h3 className="text-lg font-bold text-[var(--foreground)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{description}</p>
    </div>
  );
}
