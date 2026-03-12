"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { TransactionType } from "@prisma/client"

export async function getCategories() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  return prisma.category.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      name: "asc",
    },
  })
}

export async function createCategory({ name, type, color, icon }: { name: string; type: TransactionType; color?: string; icon?: string }) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  const category = await prisma.category.create({
    data: {
      name,
      type,
      color: color || "#3b82f6",
      icon: icon || "Wallet",
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard")
  return category
}

export async function deleteCategory(id: string) {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized")
  }

  await prisma.category.delete({
    where: {
      id,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard")
}
