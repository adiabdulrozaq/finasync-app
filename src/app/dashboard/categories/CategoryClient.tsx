"use client";

import { useState, useTransition } from "react";
import { createCategory, deleteCategory } from "@/actions/category";
import { Plus, Trash2, Tag, Edit3, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

type CategoryItem = {
  id: string;
  name: string;
  type: string;
  color: string | null;
  icon: string | null;
};

const PRESET_COLORS = [
  "#3b82f6", "#10b981", "#f43f5e", "#f59e0b",
  "#8b5cf6", "#ec4899", "#14b8a6", "#64748b",
  "#ef4444", "#06b6d4", "#84cc16", "#d946ef",
];

export default function CategoryClient({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const incomeCategories = initialCategories.filter((c) => c.type === "INCOME");
  const expenseCategories = initialCategories.filter((c) => c.type === "EXPENSE");

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = String(formData.get("name"));
    const type = formData.get("type") as "INCOME" | "EXPENSE";

    startTransition(async () => {
      await createCategory({ name, type, color: selectedColor, icon: "Tag" });
      setIsModalOpen(false);
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus kategori ini? Transaksi terkait tidak akan terhapus.")) {
      startTransition(async () => {
        await deleteCategory(id);
      });
    }
  };

  const renderCategoryGrid = (categories: CategoryItem[], label: string) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="font-bold text-[var(--foreground)]">{label}</h3>
        <Badge variant={label === "Pemasukan" ? "success" : "danger"}>
          {categories.length}
        </Badge>
      </div>

      {categories.length === 0 ? (
        <div className="py-8 text-center text-sm text-[var(--muted-foreground)] card-base rounded-2xl border-dashed">
          Belum ada kategori {label.toLowerCase()}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <AnimatePresence>
            {categories.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.03 }}
                className={`group relative overflow-hidden rounded-2xl card-base p-4 sm:p-5 transition hover:shadow-md ${isPending ? "opacity-50" : ""}`}
              >
                <div
                  className="absolute left-0 top-0 h-full w-1.5"
                  style={{ backgroundColor: c.color || "#cbd5e1" }}
                />
                <div className="flex items-center justify-between ml-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="rounded-xl p-2.5"
                      style={{ backgroundColor: `${c.color}15`, color: c.color || "#64748b" }}
                    >
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">{c.name}</h3>
                      <Badge variant={c.type === "INCOME" ? "success" : "danger"} className="mt-1">
                        {c.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                      </Badge>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={isPending}
                    className="rounded-lg p-2 text-[var(--muted-foreground)] hover:bg-rose-50 hover:text-rose-500 transition disabled:opacity-50 opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl gradient-blue px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-500/20 transition hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Kategori Baru
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-base rounded-2xl p-5">
          <p className="text-sm text-[var(--muted-foreground)] font-medium">Total Kategori</p>
          <p className="text-2xl font-bold text-[var(--foreground)] mt-1">{initialCategories.length}</p>
        </div>
        <div className="card-base rounded-2xl p-5">
          <p className="text-sm text-[var(--muted-foreground)] font-medium">Kategori Pemasukan</p>
          <p className="text-2xl font-bold text-emerald-500 mt-1">{incomeCategories.length}</p>
        </div>
        <div className="card-base rounded-2xl p-5">
          <p className="text-sm text-[var(--muted-foreground)] font-medium">Kategori Pengeluaran</p>
          <p className="text-2xl font-bold text-rose-500 mt-1">{expenseCategories.length}</p>
        </div>
      </div>

      {/* Separated sections */}
      {renderCategoryGrid(expenseCategories, "Pengeluaran")}
      {renderCategoryGrid(incomeCategories, "Pemasukan")}

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
              className="relative w-full max-w-sm rounded-3xl bg-[var(--card)] p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-[var(--foreground)]">Kategori Baru</h3>
                <button onClick={() => setIsModalOpen(false)} className="p-1 rounded-lg hover:bg-[var(--muted)] text-[var(--muted-foreground)]">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Nama Kategori</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Contoh: Belanja Bulanan"
                    className="w-full rounded-xl p-3.5 text-sm input-base"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Jenis</label>
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
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Warna Label</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`h-8 w-8 rounded-full shadow-sm transition-transform ${selectedColor === color ? "scale-110 ring-2 ring-offset-2 ring-[var(--foreground)]" : "hover:scale-105"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
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
