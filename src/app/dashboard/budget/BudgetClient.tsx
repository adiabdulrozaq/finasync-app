"use client";

import { useState, useTransition } from "react";
import { createBudget } from "@/actions/budget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AmountInput } from "@/components/ui/amount-input";
import { motion } from "framer-motion";
import { Target, AlertTriangle, ChevronLeft, ChevronRight, TrendingDown, TrendingUp, PiggyBank } from "lucide-react";

type BudgetClientProps = {
  initialBudgets: { month: number; amount: number; }[];
  spentByMonth: Record<number, number>;
  currentYear: number;
};

const MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

export default function BudgetClient({ initialBudgets, spentByMonth, currentYear }: BudgetClientProps) {
  const [isPending, startTransition] = useTransition();
  const [editingMonth, setEditingMonth] = useState<number | null>(null);

  const getBudgetForMonth = (m: number) => {
    return initialBudgets.find((b) => b.month === m)?.amount || 0;
  };

  const currentMonthIdx = new Date().getMonth() + 1;

  // Summary calculations
  const totalBudget = initialBudgets.reduce((sum, b) => sum + b.amount, 0);
  const totalSpent = Object.values(spentByMonth).reduce((sum, v) => sum + v, 0);
  const totalRemaining = totalBudget - totalSpent;

  const handleSaveBudget = (e: React.FormEvent<HTMLFormElement>, month: number) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const amount = Number(formData.get("amount"));

    startTransition(async () => {
      await createBudget({ amount, month, year: currentYear });
      setEditingMonth(null);
    });
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="card-base rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary-500" />
            <p className="text-sm text-[var(--muted-foreground)] font-medium">Total Anggaran</p>
          </div>
          <p className="text-2xl font-bold text-[var(--foreground)]">
            Rp {totalBudget.toLocaleString("id-ID")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card-base rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-rose-500" />
            <p className="text-sm text-[var(--muted-foreground)] font-medium">Total Terpakai</p>
          </div>
          <p className="text-2xl font-bold text-rose-500">
            Rp {totalSpent.toLocaleString("id-ID")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card-base rounded-2xl p-5"
        >
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="h-4 w-4 text-emerald-500" />
            <p className="text-sm text-[var(--muted-foreground)] font-medium">Sisa Anggaran</p>
          </div>
          <p className={`text-2xl font-bold ${totalRemaining >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            Rp {Math.abs(totalRemaining).toLocaleString("id-ID")}
          </p>
        </motion.div>
      </div>

      {/* Year indicator */}
      <div className="flex items-center justify-center gap-4">
        <span className="text-xl font-bold text-[var(--foreground)]">{currentYear}</span>
      </div>

      {/* Monthly Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {MONTHS.map((monthName, index) => {
          const monthNum = index + 1;
          const isCurrentMonth = monthNum === currentMonthIdx;
          const budgetAmount = getBudgetForMonth(monthNum);
          const spentAmount = spentByMonth[monthNum] || 0;

          let percentage = budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0;
          if (percentage > 100) percentage = 100;

          const isWarning = percentage >= 80 && percentage < 100;
          const isDanger = spentAmount >= budgetAmount && budgetAmount > 0;

          return (
            <motion.div
              key={monthNum}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${isCurrentMonth ? "ring-2 ring-primary-500" : ""}`}>
                <CardHeader className="bg-[var(--muted)]/50 pb-4 border-b border-[var(--border)]">
                  <CardTitle className="flex justify-between items-center text-base sm:text-lg">
                    <div className="flex items-center gap-2">
                      {isCurrentMonth && (
                        <span className="flex h-2 w-2 rounded-full bg-primary-500 animate-pulse"></span>
                      )}
                      {monthName}
                    </div>
                    {isCurrentMonth && (
                      <span className="text-[10px] sm:text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">
                        Bulan Ini
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>Target Pengeluaran Bulanan</CardDescription>
                </CardHeader>
                <CardContent className="pt-5 sm:pt-6">
                  {editingMonth === monthNum ? (
                    <form onSubmit={(e) => handleSaveBudget(e, monthNum)} className="flex gap-2">
                       <div className="flex-1 w-full min-w-0 bg-transparent">
                          <AmountInput 
                            defaultValue={budgetAmount || ""} 
                            className="w-full rounded-xl px-3 py-2 text-sm input-base bg-[var(--card)]"
                            autoFocus
                          />
                       </div>
                      <button
                        type="button"
                        onClick={() => setEditingMonth(null)}
                        disabled={isPending}
                        className="rounded-xl bg-[var(--muted)] px-3 py-2 text-sm font-semibold text-[var(--muted-foreground)] hover:bg-gray-200 disabled:opacity-50"
                      >
                        Batal
                      </button>
                      <button
                        type="submit"
                        disabled={isPending}
                        className="rounded-xl gradient-blue px-4 py-2 text-sm font-semibold text-white disabled:opacity-50"
                      >
                        Simpan
                      </button>
                    </form>
                  ) : budgetAmount === 0 ? (
                    <div className="flex flex-col items-center justify-center py-4">
                      <button
                        onClick={() => setEditingMonth(monthNum)}
                        className="flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700 transition"
                      >
                        <Target className="h-4 w-4" /> Atur Anggaran
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex justify-between items-end">
                        <div>
                          <p className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)]">Terpakai</p>
                          <p className={`text-lg sm:text-xl font-bold ${isDanger ? "text-rose-600" : isWarning ? "text-amber-500" : "text-[var(--foreground)]"}`}>
                            Rp {spentAmount.toLocaleString("id-ID")}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs sm:text-sm font-medium text-[var(--muted-foreground)]">Anggaran</p>
                          <button
                            onClick={() => setEditingMonth(monthNum)}
                            className="text-sm font-bold text-[var(--muted-foreground)] hover:text-primary-600 border-b border-dashed border-[var(--border)] hover:border-primary-600 transition"
                          >
                            Rp {budgetAmount.toLocaleString("id-ID")}
                          </button>
                        </div>
                      </div>

                      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-[var(--muted)]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${percentage}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className={`h-full rounded-full ${isDanger ? "bg-rose-500" : isWarning ? "bg-amber-400" : "bg-emerald-500"}`}
                        />
                      </div>

                      <div className="flex justify-between items-center text-xs font-medium">
                        <span className={`${isDanger ? "text-rose-600" : isWarning ? "text-amber-500" : "text-emerald-600"}`}>
                          {percentage}% dari target
                        </span>
                        {budgetAmount - spentAmount > 0 ? (
                          <span className="text-[var(--muted-foreground)]">
                            Sisa Rp {(budgetAmount - spentAmount).toLocaleString("id-ID")}
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" /> Overbudget
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
