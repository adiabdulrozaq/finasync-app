"use client";

import { useState, useTransition } from "react";
import { createTransaction, deleteTransaction } from "@/actions/transaction";
import { Plus, ArrowDownCircle, ArrowUpCircle, Wallet, Trash2, Search, Filter } from "lucide-react";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import { motion, AnimatePresence } from "framer-motion";

type Transaction = {
  id: string;
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  date: Date;
  categoryId: string | null;
  category: any;
};

type AnalyticsData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  dailyData: any[];
};

export default function DashboardClient({ 
  initialTransactions, 
  analytics,
  categories = [] 
}: { 
  initialTransactions: Transaction[],
  analytics: AnalyticsData,
  categories?: any[]
}) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const description = String(formData.get("description"));
    const type = formData.get("type") as "INCOME" | "EXPENSE";
    const categoryId = formData.get("categoryId") ? String(formData.get("categoryId")) : undefined;

    startTransition(async () => {
      await createTransaction({ amount, description, type, categoryId });
      setIsModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      startTransition(async () => {
        await deleteTransaction(id);
      });
    }
  };

  // Filter transactions
  const filteredTransactions = initialTransactions.filter(t => 
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-3xl bg-blue-600 p-6 shadow-lg shadow-blue-200 text-white flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-blue-100 font-medium">Total Saldo</p>
            <div className="rounded-full bg-blue-500/50 p-2">
              <Wallet className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight">
            Rp {analytics.balance.toLocaleString("id-ID")}
          </h3>
          <p className="text-sm mt-4 text-blue-200">Berdasarkan 30 hari terakhir</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 font-medium">Pemasukan (30D)</p>
            <div className="rounded-full bg-emerald-50 p-2">
              <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Rp {analytics.totalIncome.toLocaleString("id-ID")}
          </h3>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-3xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-gray-500 font-medium">Pengeluaran (30D)</p>
            <div className="rounded-full bg-rose-50 p-2">
              <ArrowDownCircle className="h-5 w-5 text-rose-500" />
            </div>
          </div>
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Rp {analytics.totalExpense.toLocaleString("id-ID")}
          </h3>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="lg:col-span-2"
        >
          <IncomeExpenseChart data={analytics.dailyData} />
        </motion.div>

        {/* Transactions Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-1 flex flex-col space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Transaksi Terbaru</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center rounded-full bg-blue-600 p-2 text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input 
              type="text" 
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div className="flex-1 rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[400px] p-2">
              <AnimatePresence>
                {filteredTransactions.length === 0 ? (
                  <div className="py-12 text-center text-sm text-gray-500 flex flex-col items-center">
                    <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mb-3">
                      <Wallet className="h-8 w-8 text-gray-300" />
                    </div>
                    Tidak ada transaksi.
                  </div>
                ) : (
                  filteredTransactions.map((t) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`group flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-gray-50 ${isPending ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`shrink-0 rounded-full p-2.5 ${t.type === "INCOME" ? "bg-emerald-50" : "bg-rose-50"}`}>
                          {t.type === "INCOME" ? (
                            <ArrowUpCircle className="h-5 w-5 text-emerald-500" />
                          ) : (
                            <ArrowDownCircle className="h-5 w-5 text-rose-500" />
                          )}
                        </div>
                        <div className="min-w-0 pr-2">
                          <p className="truncate font-semibold text-gray-900 text-sm whitespace-normal leading-tight">{t.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">
                              {new Date(t.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                            </span>
                            {t.category && (
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded border"
                                style={{ backgroundColor: `${t.category.color}15`, color: t.category.color, borderColor: `${t.category.color}30` }}
                              >
                                {t.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className={`font-bold text-sm ${t.type === "INCOME" ? "text-emerald-600" : "text-gray-900"}`}>
                          {t.type === "INCOME" ? "+" : "-"}Rp{t.amount.toLocaleString("id-ID")}
                        </span>
                        <button
                          onClick={() => handleDelete(t.id)}
                          disabled={isPending}
                          className="text-gray-300 hover:text-rose-500 transition disabled:opacity-50 md:opacity-0 md:group-hover:opacity-100 p-1"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Modal Tambah Transaksi */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <div className="bg-blue-100 p-1.5 rounded-lg">
                  <Plus className="h-5 w-5 text-blue-600" />
                </div>
                Tambah Transaksi
              </h3>
              <form onSubmit={handleAddTransaction} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Jenis Transaksi
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="cursor-pointer">
                      <input type="radio" name="type" value="EXPENSE" className="peer sr-only" defaultChecked />
                      <div className="rounded-xl border-2 border-transparent bg-gray-50 py-3 text-center text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-700">
                        Pengeluaran
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input type="radio" name="type" value="INCOME" className="peer sr-only" />
                      <div className="rounded-xl border-2 border-transparent bg-gray-50 py-3 text-center text-sm font-medium text-gray-600 transition-all hover:bg-gray-100 peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700">
                        Pemasukan
                      </div>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Deskripsi
                  </label>
                  <input
                    type="text"
                    name="description"
                    required
                    placeholder="Contoh: Makan Siang, Gaji"
                    className="w-full rounded-xl border-gray-200 bg-gray-50 p-3.5 text-sm border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Kategori (Opsional)
                  </label>
                  <select
                    name="categoryId"
                    className="w-full rounded-xl border-gray-200 bg-gray-50 p-3.5 text-sm border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                  >
                    <option value="">-- Pilih Kategori --</option>
                    {categories.map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.type === "INCOME" ? "Pemasukan" : "Pengeluaran"})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Jumlah (Rp)
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                    <input
                      type="number"
                      name="amount"
                      min="0"
                      required
                      placeholder="50000"
                      className="w-full rounded-xl border-gray-200 bg-gray-50 pl-11 pr-4 py-3.5 text-sm border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all font-medium"
                    />
                  </div>
                </div>
                <div className="mt-8 flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-200 transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-50"
                  >
                    {isPending ? "Menyimpan..." : "Simpan Transaksi"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
