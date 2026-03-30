"use client";

import { useState, useTransition } from "react";
import {
  createRecurringTransaction,
  deleteRecurringTransaction,
  toggleRecurringTransaction,
} from "@/actions/recurring";
import {
  Plus,
  Trash2,
  RefreshCw,
  Calendar,
  Pause,
  Play,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type RecurringItem = {
  id: string;
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  nextDueDate: string;
  isActive: boolean;
  startDate: string;
  category: { id: string; name: string; color: string | null } | null;
};

type CategoryItem = {
  id: string;
  name: string;
  type: string;
  color: string | null;
  icon: string | null;
};

const FREQ_LABELS: Record<string, string> = {
  DAILY: "Harian",
  WEEKLY: "Mingguan",
  MONTHLY: "Bulanan",
  YEARLY: "Tahunan",
};

export default function RecurringClient({
  initialRecurring,
  categories,
}: {
  initialRecurring: RecurringItem[];
  categories: CategoryItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createRecurringTransaction({
        amount: Number(formData.get("amount")),
        description: String(formData.get("description")),
        type: formData.get("type") as "INCOME" | "EXPENSE",
        frequency: formData.get("frequency") as "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY",
        categoryId: formData.get("categoryId") ? String(formData.get("categoryId")) : undefined,
      });
      setIsModalOpen(false);
    });
  };

  const handleToggle = (id: string) => {
    startTransition(async () => {
      await toggleRecurringTransaction(id);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus transaksi berulang ini?")) {
      startTransition(async () => {
        await deleteRecurringTransaction(id);
      });
    }
  };

  const getDueDays = (dateStr: string) => {
    const now = new Date();
    const due = new Date(dateStr);
    const diff = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl gradient-blue px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-500/20 transition hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Tambah Berulang
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-base rounded-2xl p-5">
          <p className="text-sm text-[var(--muted-foreground)] font-medium">Total Aktif</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">
            {initialRecurring.filter((r) => r.isActive).length}
          </p>
        </div>
        <div className="card-base rounded-2xl p-5">
          <p className="text-sm text-[var(--muted-foreground)] font-medium">Pengeluaran Rutin / Bulan</p>
          <p className="text-2xl font-bold text-rose-500 mt-1">
            Rp{" "}
            {initialRecurring
              .filter((r) => r.isActive && r.type === "EXPENSE" && r.frequency === "MONTHLY")
              .reduce((sum, r) => sum + r.amount, 0)
              .toLocaleString("id-ID")}
          </p>
        </div>
        <div className="card-base rounded-2xl p-5">
          <p className="text-sm text-[var(--muted-foreground)] font-medium">Pemasukan Rutin / Bulan</p>
          <p className="text-2xl font-bold text-emerald-500 mt-1">
            Rp{" "}
            {initialRecurring
              .filter((r) => r.isActive && r.type === "INCOME" && r.frequency === "MONTHLY")
              .reduce((sum, r) => sum + r.amount, 0)
              .toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        <AnimatePresence>
          {initialRecurring.length === 0 ? (
            <div className="card-base rounded-2xl py-16 text-center">
              <RefreshCw className="h-12 w-12 mx-auto text-[var(--muted-foreground)] opacity-30 mb-4" />
              <p className="text-[var(--muted-foreground)] text-sm">Belum ada transaksi berulang.</p>
              <p className="text-[var(--muted-foreground)] text-xs mt-1">Tambahkan langganan atau pembayaran rutin Anda.</p>
            </div>
          ) : (
            initialRecurring.map((item, idx) => {
              const dueDays = getDueDays(item.nextDueDate);
              const isOverdue = dueDays < 0;
              const isDueSoon = dueDays >= 0 && dueDays <= 3;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: idx * 0.03 }}
                  className={`card-base rounded-2xl p-4 sm:p-5 ${!item.isActive ? "opacity-50" : ""} ${isPending ? "opacity-60" : ""}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <div
                        className={`shrink-0 rounded-xl p-2.5 ${
                          item.type === "INCOME" ? "bg-emerald-50 text-emerald-500" : "bg-rose-50 text-rose-500"
                        }`}
                      >
                        <RefreshCw className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-[var(--foreground)] truncate">{item.description}</h3>
                          <Badge variant={item.isActive ? "success" : "default"}>
                            {item.isActive ? "Aktif" : "Dijeda"}
                          </Badge>
                          {item.category && (
                            <Badge
                              variant="outline"
                              style={{ borderColor: item.category.color || undefined, color: item.category.color || undefined }}
                            >
                              {item.category.name}
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-[var(--muted-foreground)]">
                          <span className="flex items-center gap-1">
                            <RefreshCw className="h-3 w-3" />
                            {FREQ_LABELS[item.frequency]}
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Berikutnya: {new Date(item.nextDueDate).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                          </span>
                          {item.isActive && (isOverdue || isDueSoon) && (
                            <span className={`flex items-center gap-1 font-semibold ${isOverdue ? "text-rose-500" : "text-amber-500"}`}>
                              <AlertCircle className="h-3 w-3" />
                              {isOverdue ? "Terlewat!" : `${dueDays} hari lagi`}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className={`font-bold text-sm ${item.type === "INCOME" ? "text-emerald-600" : "text-[var(--foreground)]"}`}>
                        {item.type === "INCOME" ? "+" : "-"}Rp {item.amount.toLocaleString("id-ID")}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleToggle(item.id)}
                          disabled={isPending}
                          className="p-2 rounded-lg text-[var(--muted-foreground)] hover:bg-[var(--muted)] transition disabled:opacity-50"
                          title={item.isActive ? "Jeda" : "Aktifkan"}
                        >
                          {item.isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isPending}
                          className="p-2 rounded-lg text-[var(--muted-foreground)] hover:text-rose-500 hover:bg-rose-50 transition disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              className="relative w-full max-w-md rounded-3xl bg-[var(--card)] p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-[var(--foreground)] mb-6 flex items-center gap-2">
                <div className="bg-primary-100 p-1.5 rounded-lg">
                  <RefreshCw className="h-5 w-5 text-primary-600" />
                </div>
                Transaksi Berulang Baru
              </h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <label className="cursor-pointer">
                    <input type="radio" name="type" value="EXPENSE" className="peer sr-only" defaultChecked />
                    <div className="rounded-xl border-2 border-transparent bg-[var(--muted)] py-3 text-center text-sm font-medium text-[var(--muted-foreground)] transition-all peer-checked:border-rose-500 peer-checked:bg-rose-50 peer-checked:text-rose-700">
                      Pengeluaran
                    </div>
                  </label>
                  <label className="cursor-pointer">
                    <input type="radio" name="type" value="INCOME" className="peer sr-only" />
                    <div className="rounded-xl border-2 border-transparent bg-[var(--muted)] py-3 text-center text-sm font-medium text-[var(--muted-foreground)] transition-all peer-checked:border-emerald-500 peer-checked:bg-emerald-50 peer-checked:text-emerald-700">
                      Pemasukan
                    </div>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Deskripsi</label>
                  <input
                    type="text"
                    name="description"
                    required
                    placeholder="Contoh: Netflix, Gaji"
                    className="w-full rounded-xl p-3.5 text-sm input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Frekuensi</label>
                  <select name="frequency" className="w-full rounded-xl p-3.5 text-sm input-base">
                    <option value="MONTHLY">Bulanan</option>
                    <option value="WEEKLY">Mingguan</option>
                    <option value="DAILY">Harian</option>
                    <option value="YEARLY">Tahunan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Kategori (Opsional)</label>
                  <select name="categoryId" className="w-full rounded-xl p-3.5 text-sm input-base">
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
                    <input
                      type="number"
                      name="amount"
                      min="0"
                      required
                      placeholder="50000"
                      className="w-full rounded-xl pl-11 pr-4 py-3.5 text-sm input-base font-medium"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
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
        )}
      </AnimatePresence>
    </div>
  );
}
