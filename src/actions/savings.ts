"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export async function getSavingsGoals() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  return prisma.savingsGoal.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  })
}

export async function createSavingsGoal(data: {
  name: string
  targetAmount: number
  deadline?: string
  color?: string
  icon?: string
}) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const goal = await prisma.savingsGoal.create({
    data: {
      name: data.name,
      targetAmount: data.targetAmount,
      deadline: data.deadline ? new Date(data.deadline) : null,
      color: data.color || "#3b82f6",
      icon: data.icon || "PiggyBank",
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard/savings")
  revalidatePath("/dashboard")
  return goal
}

export async function updateSavingsGoal(
  id: string,
  data: {
    name?: string
    targetAmount?: number
    deadline?: string | null
    color?: string
    icon?: string
  }
) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const goal = await prisma.savingsGoal.update({
    where: {
      id,
      userId: session.user.id,
    },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.targetAmount !== undefined && { targetAmount: data.targetAmount }),
      ...(data.deadline !== undefined && { deadline: data.deadline ? new Date(data.deadline) : null }),
      ...(data.color !== undefined && { color: data.color }),
      ...(data.icon !== undefined && { icon: data.icon }),
    },
  })

  revalidatePath("/dashboard/savings")
  return goal
}

export async function addToSavingsGoal(id: string, amount: number) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const goal = await prisma.savingsGoal.findUnique({
    where: { id, userId: session.user.id },
  })

  if (!goal) throw new Error("Not found")

  const updated = await prisma.savingsGoal.update({
    where: { id, userId: session.user.id },
    data: {
      currentAmount: goal.currentAmount + amount,
    },
  })

  revalidatePath("/dashboard/savings")
  return updated
}

export async function deleteSavingsGoal(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.savingsGoal.delete({
    where: {
      id,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard/savings")
}
