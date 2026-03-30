"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, endOfDay, format } from "date-fns";
import { id } from "date-fns/locale";

export async function getDashboardAnalytics(days = 30) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const startDate = startOfDay(subDays(new Date(), days - 1));
  const endDate = endOfDay(new Date());

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      amount: true,
      type: true,
      date: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  const totalIncome = transactions.filter((t) => t.type === "INCOME").reduce((acc, curr) => acc + curr.amount, 0);
  const totalExpense = transactions.filter((t) => t.type === "EXPENSE").reduce((acc, curr) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // Group by day for charts
  const chartDataMap = new Map();
  
  for (let i = 0; i < days; i++) {
    const d = subDays(new Date(), i);
    const dateStr = format(d, "yyyy-MM-dd");
    chartDataMap.set(dateStr, {
      date: dateStr,
      displayDate: format(d, "dd MMM", { locale: id }),
      income: 0,
      expense: 0,
    });
  }

  transactions.forEach((t) => {
    const dateStr = format(t.date, "yyyy-MM-dd");
    if (chartDataMap.has(dateStr)) {
      const existing = chartDataMap.get(dateStr);
      if (t.type === "INCOME") {
        existing.income += t.amount;
      } else {
        existing.expense += t.amount;
      }
    }
  });

  const dailyData = Array.from(chartDataMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalIncome,
    totalExpense,
    balance,
    dailyData
  };
}

export async function getCategoryAnalytics() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const startDate = startOfDay(subDays(new Date(), 29));

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startDate },
    },
    include: {
      category: true,
    },
  });

  // Group by category for expenses
  const expenseByCategory = new Map<string, { name: string; value: number; color: string }>();
  const incomeByCategory = new Map<string, { name: string; value: number; color: string }>();

  transactions.forEach((t) => {
    const catName = t.category?.name || "Tanpa Kategori";
    const catColor = t.category?.color || "#94a3b8";
    const map = t.type === "EXPENSE" ? expenseByCategory : incomeByCategory;

    if (map.has(catName)) {
      map.get(catName)!.value += t.amount;
    } else {
      map.set(catName, { name: catName, value: t.amount, color: catColor });
    }
  });

  return {
    expenseByCategory: Array.from(expenseByCategory.values()).sort((a, b) => b.value - a.value),
    incomeByCategory: Array.from(incomeByCategory.values()).sort((a, b) => b.value - a.value),
  };
}

export async function getMonthlyComparison() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
      date: { gte: startOfYear },
    },
    select: {
      amount: true,
      type: true,
      date: true,
    },
  });

  const MONTH_NAMES = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  
  const monthlyMap = new Map<number, { month: string; income: number; expense: number }>();
  
  // Initialize all months up to current
  for (let m = 0; m <= now.getMonth(); m++) {
    monthlyMap.set(m, { month: MONTH_NAMES[m], income: 0, expense: 0 });
  }

  transactions.forEach((t) => {
    const m = t.date.getMonth();
    if (monthlyMap.has(m)) {
      const entry = monthlyMap.get(m)!;
      if (t.type === "INCOME") {
        entry.income += t.amount;
      } else {
        entry.expense += t.amount;
      }
    }
  });

  return Array.from(monthlyMap.values());
}
