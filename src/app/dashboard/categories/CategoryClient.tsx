"use client";

import { useState, useTransition } from "react";
import { createCategory, deleteCategory } from "@/actions/category";
import { Plus, Trash2, Tag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type CategoryItem = {
  id: string;
  name: string;
  type: string;
  color: string | null;
  icon: string | null;
};

const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Emerald
  "#f43f5e", // Rose
  "#f59e0b", // Amber
  "#8b5cf6", // Violet
  "#ec4899", // Pink
  "#14b8a6", // Teal
  "#64748b", // Slate
];

export default function CategoryClient({ initialCategories }: { initialCategories: CategoryItem[] }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

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
    if (confirm("Apakah Anda yakin ingin menghapus kategori ini? Data transaksi terkait tidak akan terhapus, hanya kategorinya yang hilang.")) {
      startTransition(async () => {
        await deleteCategory(id);
      });
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-200 transition hover:bg-primary-700 hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Kategori Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {initialCategories.length === 0 ? (
            <div className="col-span-full py-12 text-center text-sm text-gray-500 bg-white rounded-3xl border border-dashed border-gray-300">
              Belum ada kategori kustom. Buat kategori pertama Anda sekarang!
            </div>
          ) : (
            initialCategories.map((c, idx) => (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: idx * 0.05 }}
                className={`group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md ${isPending ? "opacity-50" : ""}`}
              >
                <div 
                  className="absolute left-0 top-0 h-full w-1.5" 
                  style={{ backgroundColor: c.color || "#cbd5e1" }}
                />
                <div className="flex items-center justify-between ml-2">
                  <div className="flex items-center gap-3">
                    <div 
                      className="rounded-xl p-2.5"
                      style={{ backgroundColor: `${c.color}15`, color: c.color || "#64748b" }}
                    >
                      <Tag className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">{c.name}</h3>
                      <p className="text-xs font-medium text-gray-500">
                        {c.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(c.id)}
                    disabled={isPending}
                    className="rounded-lg p-2 text-gray-400 hover:bg-rose-50 hover:text-rose-500 transition disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Modal */}
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
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-6">Kategori Baru</h3>
              <form onSubmit={handleCreate} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Kategori</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Contoh: Belanja Bulanan"
                    className="w-full rounded-xl border-gray-200 bg-gray-50 p-3.5 text-sm border focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Jenis</label>
                  <select
                    name="type"
                    className="w-full rounded-xl border-gray-200 bg-gray-50 p-3.5 text-sm border focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 outline-none transition-all"
                  >
                    <option value="EXPENSE">Pengeluaran</option>
                    <option value="INCOME">Pemasukan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Warna Label</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`h-8 w-8 rounded-full shadow-sm transition-transform ${selectedColor === color ? "scale-110 ring-2 ring-offset-2 ring-gray-900" : "hover:scale-105"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
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
                    className="flex-1 rounded-xl bg-primary-600 px-4 py-3 text-sm font-bold text-white shadow-md shadow-primary-200 transition-all hover:bg-primary-700 hover:shadow-lg disabled:opacity-50"
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
