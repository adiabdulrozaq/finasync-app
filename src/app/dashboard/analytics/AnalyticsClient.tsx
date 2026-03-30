"use client";

import { motion } from "framer-motion";
import { ArrowDownCircle, ArrowUpCircle, Wallet, Activity, TrendingUp, TrendingDown } from "lucide-react";
import IncomeExpenseChart from "@/components/charts/IncomeExpenseChart";
import CategoryPieChart from "@/components/charts/CategoryPieChart";
import MonthlyTrendChart from "@/components/charts/MonthlyTrendChart";

type AnalyticsData = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  dailyData: {
    date: string;
    displayDate: string;
    income: number;
    expense: number;
  }[];
};

type CategoryData = {
  expenseByCategory: { name: string; value: number; color: string }[];
  incomeByCategory: { name: string; value: number; color: string }[];
};

type MonthlyData = {
  month: string;
  income: number;
  expense: number;
}[];

export default function AnalyticsClient({
  initialData,
  categoryData,
  monthlyData,
}: {
  initialData: AnalyticsData;
  categoryData: CategoryData;
  monthlyData: MonthlyData;
}) {
  const savingsRate = initialData.totalIncome > 0
    ? ((initialData.totalIncome - initialData.totalExpense) / initialData.totalIncome) * 100
    : 0;

  return (
    <div className="space-y-6 sm:space-y-8 pb-20">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl sm:rounded-3xl gradient-blue p-5 sm:p-6 shadow-lg shadow-primary-500/20 text-white"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-blue-100 font-medium text-sm">Saldo (30H)</p>
            <div className="rounded-full bg-white/20 p-2">
              <Wallet className="h-5 w-5 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">
            Rp {initialData.balance.toLocaleString("id-ID")}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl sm:rounded-3xl card-base p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[var(--muted-foreground)] font-medium text-sm">Total Pemasukan</p>
            <div className="rounded-full bg-emerald-50 p-2">
              <TrendingUp className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-emerald-600">
            Rp {initialData.totalIncome.toLocaleString("id-ID")}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-2xl sm:rounded-3xl card-base p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[var(--muted-foreground)] font-medium text-sm">Total Pengeluaran</p>
            <div className="rounded-full bg-rose-50 p-2">
              <TrendingDown className="h-5 w-5 text-rose-500" />
            </div>
          </div>
          <h3 className="text-2xl font-bold tracking-tight text-rose-600">
            Rp {initialData.totalExpense.toLocaleString("id-ID")}
          </h3>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl sm:rounded-3xl card-base p-5 sm:p-6"
        >
          <div className="flex items-center justify-between mb-3">
            <p className="text-[var(--muted-foreground)] font-medium text-sm">Tingkat Tabungan</p>
            <div className="rounded-full bg-violet-50 p-2">
              <Activity className="h-5 w-5 text-violet-500" />
            </div>
          </div>
          <h3 className={`text-2xl font-bold tracking-tight ${savingsRate >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {savingsRate.toFixed(1)}%
          </h3>
          <p className="text-xs mt-1 text-[var(--muted-foreground)]">dari total pemasukan</p>
        </motion.div>
      </div>

      {/* Daily Chart */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <IncomeExpenseChart data={initialData.dailyData} />
      </motion.div>

      {/* Category & Monthly Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CategoryPieChart data={categoryData.expenseByCategory} title="Pengeluaran per Kategori" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <CategoryPieChart data={categoryData.incomeByCategory} title="Pemasukan per Kategori" />
        </motion.div>
      </div>

      {/* Monthly Trend */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <MonthlyTrendChart data={monthlyData} />
      </motion.div>

      {/* Top Spending */}
      {categoryData.expenseByCategory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card-base rounded-2xl p-5 sm:p-6"
        >
          <h3 className="font-bold text-[var(--foreground)] mb-4">Top Kategori Pengeluaran</h3>
          <div className="space-y-3">
            {categoryData.expenseByCategory.slice(0, 5).map((cat, idx) => {
              const maxVal = categoryData.expenseByCategory[0]?.value || 1;
              const pct = Math.round((cat.value / maxVal) * 100);

              return (
                <div key={cat.name} className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[var(--muted-foreground)] w-5">{idx + 1}</span>
                  <div
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-[var(--foreground)] truncate">{cat.name}</span>
                      <span className="text-sm font-bold text-[var(--foreground)] shrink-0 ml-2">
                        Rp {cat.value.toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[var(--muted)] overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
