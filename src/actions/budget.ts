"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function createBudget({ amount, month, year }: { amount: number; month: number; year: number }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const budget = await prisma.budget.upsert({
    where: {
      userId_month_year: {
        userId: session.user.id,
        month,
        year,
      }
    },
    update: {
      amount,
    },
    create: {
      amount,
      month,
      year,
      userId: session.user.id,
    }
  })

  revalidatePath("/dashboard/budget")
  return budget
}

export async function getBudgets(year: number) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const budgets = await prisma.budget.findMany({
    where: {
      userId: session.user.id,
      year: year,
    },
    orderBy: {
      month: 'asc'
    }
  })

  // Also calculate total expenses per month for this year
  const expenses = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
      type: "EXPENSE",
      date: {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      }
    }
  })

  const spentByMonth = expenses.reduce((acc: Record<number, number>, curr) => {
    const m = curr.date.getMonth() + 1 // 1-12
    acc[m] = (acc[m] || 0) + curr.amount
    return acc
  }, {})

  return { budgets, spentByMonth }
}
