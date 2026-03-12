"use client";

import { useState, useTransition } from "react";
import { createTransaction, deleteTransaction } from "@/actions/transaction";
import { Plus, ArrowDownCircle, ArrowUpCircle, Wallet, Trash2 } from "lucide-react";

type Transaction = {
  id: string;
  amount: number;
  description: string;
  type: "INCOME" | "EXPENSE";
  date: Date;
  categoryId: string | null;
  category: any;
};

export default function DashboardClient({ initialTransactions }: { initialTransactions: Transaction[] }) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Stats
  const totalIncome = initialTransactions
    .filter((t) => t.type === "INCOME")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = initialTransactions
    .filter((t) => t.type === "EXPENSE")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalBalance = totalIncome - totalExpense;

  const handleAddTransaction = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));
    const description = String(formData.get("description"));
    const type = formData.get("type") as "INCOME" | "EXPENSE";

    startTransition(async () => {
      await createTransaction({ amount, description, type });
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

  return (
    <div className="space-y-8">
      {/* Cards Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3">
            <Wallet className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Saldo Total</p>
            <h3 className="text-2xl font-bold text-gray-900">
              Rp {totalBalance.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="rounded-full bg-emerald-100 p-3">
            <ArrowUpCircle className="h-6 w-6 text-emerald-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pemasukan</p>
            <h3 className="text-2xl font-bold text-emerald-600">
              Rp {totalIncome.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>
        <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="rounded-full bg-red-100 p-3">
            <ArrowDownCircle className="h-6 w-6 text-red-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Pengeluaran</p>
            <h3 className="text-2xl font-bold text-red-600">
              Rp {totalExpense.toLocaleString("id-ID")}
            </h3>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Tambah Transaksi
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Riwayat Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50/50 text-gray-900">
              <tr>
                <th className="px-6 py-3 font-medium">Tanggal</th>
                <th className="px-6 py-3 font-medium">Deskripsi</th>
                <th className="px-6 py-3 font-medium text-right">Jumlah (Rp)</th>
                <th className="px-6 py-3 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {initialTransactions.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    Belum ada transaksi. Tambahkan sekarang!
                  </td>
                </tr>
              ) : (
                initialTransactions.map((t) => (
                  <tr key={t.id} className={`transition-colors hover:bg-gray-50/80 ${isPending ? "opacity-50" : ""}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(t.date).toLocaleDateString("id-ID", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{t.description}</p>
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                            t.type === "INCOME"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {t.type === "INCOME" ? "Pemasukan" : "Pengeluaran"}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-right font-medium ${
                        t.type === "INCOME" ? "text-emerald-600" : "text-red-600"
                      }`}
                    >
                      {t.type === "INCOME" ? "+" : "-"}
                      {t.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <button
                        onClick={() => handleDelete(t.id)}
                        disabled={isPending}
                        className="text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Tambah Transaksi</h3>
            <form onSubmit={handleAddTransaction} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Transaksi
                </label>
                <select
                  name="type"
                  required
                  className="w-full rounded-lg border-gray-300 p-2.5 text-sm border focus:border-blue-500 focus:ring-blue-500 outline-none"
                >
                  <option value="INCOME">Pemasukan</option>
                  <option value="EXPENSE">Pengeluaran</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <input
                  type="text"
                  name="description"
                  required
                  placeholder="Cth: Gaji Bulanan, Makan Siang"
                  className="w-full rounded-lg border-gray-300 p-2.5 text-sm border focus:border-blue-500 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah (Rp)
                </label>
                <input
                  type="number"
                  name="amount"
                  min="0"
                  required
                  placeholder="50000"
                  className="w-full rounded-lg border-gray-300 p-2.5 text-sm border focus:border-blue-500 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {isPending ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
