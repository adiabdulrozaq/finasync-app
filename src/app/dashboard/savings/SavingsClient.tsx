"use client";

import { useState, useTransition } from "react";
import {
  createSavingsGoal,
  addToSavingsGoal,
  deleteSavingsGoal,
} from "@/actions/savings";
import {
  Plus,
  Trash2,
  PiggyBank,
  Target,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AmountInput } from "@/components/ui/amount-input";

type SavingsGoalItem = {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
  color: string;
  icon: string;
  createdAt: string;
};

const PRESET_COLORS = [
  "#3b82f6", "#10b981", "#f43f5e", "#f59e0b",
  "#8b5cf6", "#ec4899", "#14b8a6", "#64748b",
];

export default function SavingsClient({
  initialGoals,
}: {
  initialGoals: SavingsGoalItem[];
}) {
  const [isPending, startTransition] = useTransition();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addingToGoal, setAddingToGoal] = useState<string | null>(null);
  const [addAmount, setAddAmount] = useState("");
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleCreate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await createSavingsGoal({
        name: String(formData.get("name")),
        targetAmount: Number(formData.get("targetAmount")),
        deadline: formData.get("deadline") ? String(formData.get("deadline")) : undefined,
        color: selectedColor,
      });
      setIsModalOpen(false);
    });
  };

  const handleAddMoney = (id: string) => {
    const amount = Number(addAmount);
    if (!amount || amount <= 0) return;
    startTransition(async () => {
      await addToSavingsGoal(id, amount);
      setAddingToGoal(null);
      setAddAmount("");
    });
  };

  const handleDelete = (id: string) => {
    if (confirm("Hapus target tabungan ini?")) {
      startTransition(async () => {
        await deleteSavingsGoal(id);
      });
    }
  };

  const totalSaved = initialGoals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = initialGoals.reduce((sum, g) => sum + g.targetAmount, 0);

  return (
    <div className="space-y-6 pb-20">
      <div className="flex justify-end">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-xl gradient-blue px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-500/20 transition hover:shadow-lg hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" /> Target Baru
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card-base rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary-500" />
            <span className="text-sm text-[var(--muted-foreground)] font-medium">Total Target</span>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            Rp {totalTarget.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="card-base rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="h-4 w-4 text-emerald-500" />
            <span className="text-sm text-[var(--muted-foreground)] font-medium">Total Terkumpul</span>
          </div>
          <p className="text-2xl font-bold text-emerald-500">
            Rp {totalSaved.toLocaleString("id-ID")}
          </p>
        </div>
        <div className="card-base rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-violet-500" />
            <span className="text-sm text-[var(--muted-foreground)] font-medium">Progress Rata-rata</span>
          </div>
          <p className="text-2xl font-bold text-violet-500">
            {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AnimatePresence>
          {initialGoals.length === 0 ? (
            <div className="col-span-full card-base rounded-2xl py-16 text-center">
              <PiggyBank className="h-12 w-12 mx-auto text-[var(--muted-foreground)] opacity-30 mb-4" />
              <p className="text-[var(--muted-foreground)] text-sm">Belum ada target tabungan.</p>
              <p className="text-[var(--muted-foreground)] text-xs mt-1">Mulai buat target pertama Anda!</p>
            </div>
          ) : (
            initialGoals.map((goal, idx) => {
              const percentage = Math.min(
                Math.round((goal.currentAmount / goal.targetAmount) * 100),
                100
              );
              const isComplete = percentage >= 100;
              const remaining = goal.targetAmount - goal.currentAmount;

              let daysLeft: number | null = null;
              if (goal.deadline) {
                const deadlineDate = new Date(goal.deadline);
                daysLeft = Math.ceil(
                  (deadlineDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
              }

              return (
                <motion.div
                  key={goal.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`card-base rounded-2xl overflow-hidden ${isPending ? "opacity-60" : ""}`}
                >
                  {/* Color header strip */}
                  <div className="h-2" style={{ backgroundColor: goal.color }} />

                  <div className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className="rounded-xl p-2.5"
                          style={{ backgroundColor: `${goal.color}15`, color: goal.color }}
                        >
                          <PiggyBank className="h-5 w-5" />
                        </div>
                        <div>
                          <h3 className="font-bold text-[var(--foreground)]">{goal.name}</h3>
                          {goal.deadline && (
                            <div className="flex items-center gap-1 mt-0.5">
                              <Calendar className="h-3 w-3 text-[var(--muted-foreground)]" />
                              <span className={`text-xs ${daysLeft !== null && daysLeft < 30 ? "text-amber-500 font-semibold" : "text-[var(--muted-foreground)]"}`}>
                                {daysLeft !== null && daysLeft < 0
                                  ? "Deadline terlewat"
                                  : daysLeft !== null
                                  ? `${daysLeft} hari lagi`
                                  : new Date(goal.deadline).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleDelete(goal.id)}
                        disabled={isPending}
                        className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-rose-500 hover:bg-rose-50 transition"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Progress ring */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-20 shrink-0">
                        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="var(--muted)"
                            strokeWidth="3"
                          />
                          <path
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke={goal.color}
                            strokeWidth="3"
                            strokeDasharray={`${percentage}, 100`}
                            strokeLinecap="round"
                            className="transition-all duration-700"
                          />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-sm font-bold text-[var(--foreground)]">{percentage}%</span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-end mb-1">
                          <span className="text-xs text-[var(--muted-foreground)]">Terkumpul</span>
                          <span className="text-xs text-[var(--muted-foreground)]">Target</span>
                        </div>
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-bold" style={{ color: goal.color }}>
                            Rp {goal.currentAmount.toLocaleString("id-ID")}
                          </span>
                          <span className="text-sm font-bold text-[var(--foreground)]">
                            Rp {goal.targetAmount.toLocaleString("id-ID")}
                          </span>
                        </div>
                        {!isComplete && (
                          <p className="text-xs text-[var(--muted-foreground)] mt-1">
                            Kurang Rp {remaining.toLocaleString("id-ID")}
                          </p>
                        )}
                        {isComplete && (
                          <p className="text-xs text-emerald-500 font-semibold mt-1">🎉 Target tercapai!</p>
                        )}
                      </div>
                    </div>

                    {/* Add money */}
                    {!isComplete && (
                      <>
                        {addingToGoal === goal.id ? (
                          <div className="flex gap-2">
                            <div className="relative flex-1">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[var(--muted-foreground)]">Rp</span>
                              <AmountInput
                                value={addAmount}
                                onChangeValue={setAddAmount}
                                name="addAmount"
                                className="w-full rounded-lg pl-8 pr-3 py-2 text-sm input-base font-medium"
                                autoFocus
                              />
                            </div>
                            <button
                              onClick={() => handleAddMoney(goal.id)}
                              disabled={isPending || !addAmount}
                              className="rounded-lg px-3 py-2 text-xs font-bold text-white shadow-sm disabled:opacity-50"
                              style={{ backgroundColor: goal.color }}
                            >
                              Tambah
                            </button>
                            <button
                              onClick={() => { setAddingToGoal(null); setAddAmount(""); }}
                              className="rounded-lg px-3 py-2 text-xs font-bold text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                            >
                              Batal
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setAddingToGoal(goal.id)}
                            className="w-full rounded-xl py-2.5 text-sm font-semibold transition-all hover:shadow-sm border-2 border-dashed border-[var(--border)] text-[var(--muted-foreground)] hover:border-current hover:text-[var(--foreground)]"
                          >
                            + Tambah Uang
                          </button>
                        )}
                      </>
                    )}
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
                  <PiggyBank className="h-5 w-5 text-primary-600" />
                </div>
                Target Tabungan Baru
              </h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Nama Target</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="Contoh: Liburan Bali, iPhone Baru"
                    className="w-full rounded-xl p-3.5 text-sm input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Target Jumlah (Rp)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] font-medium">Rp</span>
                    <AmountInput
                      name="targetAmount"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Deadline (Opsional)</label>
                  <input
                    type="date"
                    name="deadline"
                    className="w-full rounded-xl p-3.5 text-sm input-base"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-[var(--foreground)] mb-1.5">Warna</label>
                  <div className="flex flex-wrap gap-2">
                    {PRESET_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`h-8 w-8 rounded-full shadow-sm transition-transform ${
                          selectedColor === color ? "scale-110 ring-2 ring-offset-2 ring-gray-900" : "hover:scale-105"
                        }`}
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
