"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { TransactionType, Frequency } from "@prisma/client"

export async function getRecurringTransactions() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  return prisma.recurringTransaction.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      category: true,
    },
    orderBy: {
      nextDueDate: "asc",
    },
  })
}

export async function createRecurringTransaction(data: {
  amount: number
  description: string
  type: TransactionType
  frequency: Frequency
  categoryId?: string
  startDate?: string
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const start = data.startDate ? new Date(data.startDate) : new Date()
  const nextDue = calculateNextDueDate(start, data.frequency)

  const recurring = await prisma.recurringTransaction.create({
    data: {
      amount: data.amount,
      description: data.description,
      type: data.type,
      frequency: data.frequency,
      categoryId: data.categoryId || null,
      startDate: start,
      nextDueDate: nextDue,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard/recurring")
  revalidatePath("/dashboard")
  return recurring
}

export async function updateRecurringTransaction(
  id: string,
  data: {
    amount?: number
    description?: string
    frequency?: Frequency
    categoryId?: string | null
  }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const recurring = await prisma.recurringTransaction.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.frequency !== undefined && { frequency: data.frequency }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
    },
  })

  revalidatePath("/dashboard/recurring")
  return recurring
}

export async function toggleRecurringTransaction(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const existing = await prisma.recurringTransaction.findUnique({
    where: { id, userId: session.user.id },
  })

  if (!existing) throw new Error("Not found")

  await prisma.recurringTransaction.update({
    where: { id, userId: session.user.id },
    data: { isActive: !existing.isActive },
  })

  revalidatePath("/dashboard/recurring")
}

export async function deleteRecurringTransaction(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.recurringTransaction.delete({
    where: {
      id,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard/recurring")
}

function calculateNextDueDate(startDate: Date, frequency: Frequency): Date {
  const now = new Date()
  const result = new Date(startDate)

  // If start date is in the future, that's the next due date
  if (result > now) return result

  // Calculate next due date based on frequency
  while (result <= now) {
    switch (frequency) {
      case "DAILY":
        result.setDate(result.getDate() + 1)
        break
      case "WEEKLY":
        result.setDate(result.getDate() + 7)
        break
      case "MONTHLY":
        result.setMonth(result.getMonth() + 1)
        break
      case "YEARLY":
        result.setFullYear(result.getFullYear() + 1)
        break
    }
  }

  return result
}
