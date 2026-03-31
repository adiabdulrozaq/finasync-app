"use client";

import { useState, useTransition } from "react";
import { createTransaction, deleteTransaction, updateTransaction, exportTransactionsCSV } from "@/actions/transaction";
import { Plus, ArrowDownCircle, ArrowUpCircle, Wallet, Trash2, Search, Download, Edit3, X, TrendingUp, TrendingDown, Receipt } from "lucide-react";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import { AmountInput } from "@/components/ui/amount-input";
import { motion, AnimatePresence } from "framer-motion";

type Transaction = {
  id: string;
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  date: Date;
  categoryId: string | null;
  category: { id: string; name: string; type: string; color: string | null; icon: string | null; } | null;
};

type AnalyticsData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  dailyData: { date: string; displayDate: string; income: number; expense: number; }[];
};

export default function DashboardClient({
  initialTransactions,
  analytics,
  categories = []
}: {
  initialTransactions: Transaction[],
  analytics: AnalyticsData,
  categories?: { id: string; name: string; type: string; color: string | null; icon: string | null; }[]
}) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);
  const [filterType, setFilterType] = useState<"ALL" | "INCOME" | "EXPENSE">("ALL");

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const description = String(formData.get("description"));
    const type = formData.get("type") as "INCOME" | "EXPENSE";
    const categoryId = formData.get("categoryId") ? String(formData.get("categoryId")) : undefined;
    const date = formData.get("date") ? String(formData.get("date")) : undefined;

    startTransition(async () => {
      await createTransaction({ amount, description, type, categoryId, date });
      setIsModalOpen(false);
    });
  };

  const handleEditTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingTx) return;
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      await updateTransaction(editingTx.id, {
        amount: Number(formData.get("amount")),
        description: String(formData.get("description")),
        type: formData.get("type") as "INCOME" | "EXPENSE",
        categoryId: formData.get("categoryId") ? String(formData.get("categoryId")) : null,
      });
      setEditingTx(null);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      startTransition(async () => {
        await deleteTransaction(id);
      });
    }
  };

  const handleExport = () => {
    startTransition(async () => {
      const csv = await exportTransactionsCSV();
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `finasync-transaksi-${new Date().toISOString().split("T")[0]}.csv`;
      link.click();
      URL.revokeObjectURL(url);
    });
  };

  // Filter transactions
  const filteredTransactions = initialTransactions
    .filter(t => t.description.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter(t => filterType === "ALL" ? true : t.type === filterType);

  const txCount = initialTransactions.length;
  const avgExpense = analytics.totalExpense / Math.max(analytics.dailyData.filter(d => d.expense > 0).length, 1);

  return (
    <div className="space-y-6 sm:space-y-8 pb-10">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl sm:rounded-3xl gradient-blue p-5 sm:p-6 shadow-lg shadow-primary-500/20 text-white"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-blue-100 font-medium text-sm">Total Saldo</p>
            <div className="rounded-full bg-white/20 p-2">
              <Wallet className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Rp {analytics.balance.toLocaleString("id-ID")}
          </h3>
          <p className="text-xs sm:text-sm mt-3 sm:mt-4 text-blue-200">30 hari terakhir</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl sm:rounded-3xl card-base p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-[var(--muted-foreground)] font-medium text-sm">Pemasukan</p>
            <div className="rounded-full bg-emerald-50 p-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-600">
            Rp {analytics.totalIncome.toLocaleString("id-ID")}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl sm:rounded-3xl card-base p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-[var(--muted-foreground)] font-medium text-sm">Pengeluaran</p>
            <div className="rounded-full bg-rose-50 p-2">
              <TrendingDown className="h-5 w-5 text-rose-500" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-rose-600">
            Rp {analytics.totalExpense.toLocaleString("id-ID")}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl sm:rounded-3xl card-base p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <p className="text-[var(--muted-foreground)] font-medium text-sm">Total Transaksi</p>
            <div className="rounded-full bg-violet-50 p-2">
              <Receipt className="h-5 w-5 text-violet-500" />
            </div>
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
            {txCount}
          </h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            Rata-rata pengeluaran: Rp {Math.round(avgExpense).toLocaleString("id-ID")}/hari
          </p>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
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
          className="lg:col-span-1 flex flex-col space-y-3 sm:space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[var(--foreground)]">Transaksi Terbaru</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExport}
                disabled={isPending || txCount === 0}
                className="flex items-center justify-center rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition disabled:opacity-50"
                title="Export CSV"
              >
                <Download className="h-4 w-4" />
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center rounded-full gradient-blue p-2 text-white shadow-md shadow-primary-500/20 transition hover:shadow-lg hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search & Filter */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
              <input
                type="text"
                placeholder="Cari transaksi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm input-base"
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as "ALL" | "INCOME" | "EXPENSE")}
              className="rounded-xl px-3 py-2.5 text-sm input-base min-w-0"
            >
              <option value="ALL">Semua</option>
              <option value="INCOME">Masuk</option>
              <option value="EXPENSE">Keluar</option>
            </select>
          </div>

          <div className="flex-1 rounded-2xl card-base overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto max-h-[400px] p-2">
              <AnimatePresence>
                {filteredTransactions.length === 0 ? (
                  <div className="py-12 text-center text-sm text-[var(--muted-foreground)] flex flex-col items-center">
                    <div className="bg-[var(--muted)] h-16 w-16 rounded-full flex items-center justify-center mb-3">
                      <Wallet className="h-8 w-8 opacity-30" />
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
                      className={`group flex items-center justify-between p-3 rounded-xl transition-colors hover:bg-[var(--muted)] ${isPending ? "opacity-50" : ""}`}
                    >
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`shrink-0 rounded-xl p-2.5 ${t.type === "INCOME" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"}`}>
                          {t.type === "INCOME" ? (
                            <ArrowUpCircle className="h-5 w-5" />
                          ) : (
                            <ArrowDownCircle className="h-5 w-5" />
                          )}
                        </div>
                        <div className="min-w-0 pr-2">
                          <p className="truncate font-semibold text-[var(--foreground)] text-sm leading-tight">{t.description}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-[var(--muted-foreground)]">
                              {new Date(t.date).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                            </span>
                            {t.category && (
                              <span
                                className="text-[10px] px-1.5 py-0.5 rounded border"
                                style={{ backgroundColor: `${t.category.color || '#000'}15`, color: t.category.color || undefined, borderColor: `${t.category.color || '#000'}30` }}
                              >
                                {t.category.name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className={`font-bold text-sm ${t.type === "INCOME" ? "text-emerald-600" : "text-[var(--foreground)]"}`}>
                          {t.type === "INCOME" ? "+" : "-"}Rp{t.amount.toLocaleString("id-ID")}
                        </span>
                        <div className="flex items-center gap-0.5 md:opacity-0 md:group-hover:opacity-100 transition">
                          <button
                            onClick={() => setEditingTx(t)}
                            className="text-[var(--muted-foreground)] hover:text-primary-500 transition p-1"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(t.id)}
                            disabled={isPending}
                            className="text-[var(--muted-foreground)] hover:text-rose-500 transition disabled:opacity-50 p-1"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <TransactionModal
            title="Tambah Transaksi"
            categories={categories}
            isPending={isPending}
            onClose={() => setIsModalOpen(false)}
            onSubmit={handleAddTransaction}
          />
        )}
      </AnimatePresence>

      {/* Edit Transaction Modal */}
      <AnimatePresence>
        {editingTx && (
          <TransactionModal
            title="Edit Transaksi"
            categories={categories}
            isPending={isPending}
            onClose={() => setEditingTx(null)}
            onSubmit={handleEditTransaction}
            defaultValues={editingTx}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function TransactionModal({
  title,
  categories,
  isPending,
  onClose,
  onSubmit,
  defaultValues,
}: {
  title: string;
  categories: { id: string; name: string; type: string; color: string | null; icon: string | null; }[];
  isPending: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  defaultValues?: Transaction;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-0">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative w-full max-w-md rounded-3xl bg-[var(--card)] p-6 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[var(--foreground)] flex items-center gap-2">
            <div className="bg-primary-100 p-1.5 rounded-lg">
              <Plus className="h-5 w-5 text-primary-600" />
            </div>
            {title}
          </h3>
          <button type="button" onClick={onClose} className="p-1 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Jenis Transaksi</label>
            <div className="grid grid-cols-2 gap-3">
              <label className="cursor-pointer">
                <input type="radio" name="type" value="EXPENSE" className="peer sr-only" defaultChecked={!defaultValues || defaultValues.type === "EXPENSE"} />
                <div className="rounded-xl border-2 border-transparent bg-[var(--muted)] py-3 text-center text-sm font-medium text-[var(--muted-foreground)] transition-all peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-700">
                  Pengeluaran
                </div>
              </label>
              <label className="cursor-pointer">
                <input type="radio" name="type" value="INCOME" className="peer sr-only" defaultChecked={defaultValues?.type === "INCOME"} />
                <div className="rounded-xl border-2 border-transparent bg-[var(--muted)] py-3 text-center text-sm font-medium text-[var(--muted-foreground)] transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700">
                  Pemasukan
                </div>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Deskripsi</label>
            <input
              type="text"
              name="description"
              required
              defaultValue={defaultValues?.description}
              placeholder="Contoh: Makan Siang, Gaji"
              className="w-full rounded-xl p-3.5 text-sm input-base"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Kategori (Opsional)</label>
            <select
              name="categoryId"
              defaultValue={defaultValues?.categoryId || ""}
              className="w-full rounded-xl p-3.5 text-sm input-base"
            >
              <option value="">-- Pilih Kategori --</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.type === "INCOME" ? "Pemasukan" : "Pengeluaran"})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Jumlah (Rp)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-medium">Rp</span>
              <AmountInput defaultValue={defaultValues?.amount} />
            </div>
          </div>
          {!defaultValues && (
            <div>
              <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Tanggal (Opsional)</label>
              <input
                type="date"
                name="date"
                className="w-full rounded-xl p-3.5 text-sm input-base"
              />
            </div>
          )}
          <div className="mt-6 flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl px-4 py-3 text-sm font-bold text-[var(--muted-foreground)] transition-colors hover:bg-[var(--muted)]"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 rounded-xl gradient-blue px-4 py-3 text-sm font-bold text-white shadow-md shadow-primary-500/20 transition-all hover:shadow-lg disabled:opacity-50"
            >
              {isPending ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
