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

  // Find existing budget for this user/month/year (without category)
  const existing = await prisma.budget.findFirst({
    where: {
      userId: session.user.id,
      month,
      year,
      categoryId: null,
    }
  })

  if (existing) {
    const budget = await prisma.budget.update({
      where: { id: existing.id },
      data: { amount },
    })
    revalidatePath("/dashboard/budget")
    return budget
  }

  const budget = await prisma.budget.create({
    data: {
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

  const spentByMonth = expenses.reduce((acc: Record<number, number>, curr: { date: Date; amount: number }) => {
    const m = curr.date.getMonth() + 1
    acc[m] = (acc[m] || 0) + curr.amount
    return acc
  }, {})

  return { budgets, spentByMonth }
}
