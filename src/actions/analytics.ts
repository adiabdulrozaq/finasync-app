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

  // Calculate totals
  const totalIncome = transactions.filter((t: { type: string }) => t.type === "INCOME").reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0);
  const totalExpense = transactions.filter((t: { type: string }) => t.type === "EXPENSE").reduce((acc: number, curr: { amount: number }) => acc + curr.amount, 0);
  const balance = totalIncome - totalExpense;

  // Group by day for charts
  const chartDataMap = new Map();
  
  // Initialize map with empty values for all days
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

  // Populate data
  transactions.forEach((t: { type: string; amount: number; date: Date }) => {
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

  // Convert map to sorted array
  const dailyData = Array.from(chartDataMap.values()).sort((a, b) => a.date.localeCompare(b.date));

  return {
    totalIncome,
    totalExpense,
    balance,
    dailyData
  };
}
