"use client";

import { useState, useTransition } from "react";
import { createBudget } from "@/actions/budget";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target, AlertTriangle } from "lucide-react";

type BudgetClientProps = {
  initialBudgets: any[];
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

  const currentMonthIdx = new Date().getMonth() + 1; // 1-12

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
      {MONTHS.map((monthName, index) => {
        const monthNum = index + 1;
        const isCurrentMonth = monthNum === currentMonthIdx;
        const budgetAmount = getBudgetForMonth(monthNum);
        const spentAmount = spentByMonth[monthNum] || 0;
        
        let percentage = budgetAmount > 0 ? Math.round((spentAmount / budgetAmount) * 100) : 0;
        if (percentage > 100) percentage = 100;

        const isWarning = percentage >= 80 && percentage < 100;
        const isDanger = percentage >= 100;
        const isGood = percentage > 0 && percentage < 80;

        return (
          <motion.div 
            key={monthNum}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${isCurrentMonth ? "ring-2 ring-primary-500" : ""}`}>
              <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
                <CardTitle className="flex justify-between items-center text-lg">
                  <div className="flex items-center gap-2">
                    {isCurrentMonth && (
                      <span className="flex h-2 w-2 rounded-full bg-primary-500"></span>
                    )}
                    {monthName}
                  </div>
                  {isCurrentMonth && <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">Bulan Ini</span>}
                </CardTitle>
                <CardDescription>Target Pengeluaran Bulanan</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {editingMonth === monthNum ? (
                  <form onSubmit={(e) => handleSaveBudget(e, monthNum)} className="flex gap-2">
                    <input
                      type="number"
                      name="amount"
                      defaultValue={budgetAmount || ""}
                      placeholder="Masukkan Anggaran"
                      className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setEditingMonth(null)}
                      disabled={isPending}
                      className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-200 disabled:opacity-50"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isPending}
                      className="rounded-xl bg-primary-600 px-4 py-2 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-50"
                    >
                      Save
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
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Terpakai</p>
                        <p className={`text-xl font-bold ${isDanger ? "text-rose-600" : isWarning ? "text-amber-500" : "text-gray-900"}`}>
                          Rp {spentAmount.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-500">Anggaran</p>
                        <button 
                          onClick={() => setEditingMonth(monthNum)}
                          className="text-sm font-bold text-gray-400 hover:text-primary-600 border-b border-dashed border-gray-300 hover:border-primary-600 transition"
                        >
                          Rp {budgetAmount.toLocaleString("id-ID")}
                        </button>
                      </div>
                    </div>

                    <div className="relative h-3 w-full overflow-hidden rounded-full bg-gray-100">
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
                        <span className="text-gray-500">Sisa Rp {(budgetAmount - spentAmount).toLocaleString("id-ID")}</span>
                      ) : (
                        <span className="text-rose-600 flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Overbudget</span>
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
  );
}
