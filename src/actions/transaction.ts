"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createTransaction(data: { amount: number; description: string; type: "INCOME" | "EXPENSE"; categoryId?: string; date?: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  const transaction = await prisma.transaction.create({
    data: {
      amount: data.amount,
      description: data.description,
      type: data.type,
      categoryId: data.categoryId || null,
      date: data.date ? new Date(data.date) : new Date(),
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
  return transaction;
}

export async function updateTransaction(id: string, data: { amount?: number; description?: string; type?: "INCOME" | "EXPENSE"; categoryId?: string | null; date?: string }) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  const transaction = await prisma.transaction.update({
    where: {
      id,
      userId: user.id,
    },
    data: {
      ...(data.amount !== undefined && { amount: data.amount }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.type !== undefined && { type: data.type }),
      ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
      ...(data.date !== undefined && { date: new Date(data.date) }),
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
  return transaction;
}

export async function getTransactions() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return [];

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    include: { category: true },
  });

  return transactions;
}

export async function deleteTransaction(id: string) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  await prisma.transaction.delete({
    where: {
      id,
      userId: user.id,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/analytics");
}

export async function exportTransactionsCSV() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  const transactions = await prisma.transaction.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
    include: { category: true },
  });

  // Build CSV
  const header = "Tanggal,Deskripsi,Jenis,Kategori,Jumlah\n";
  const rows = transactions.map((t) => {
    const date = new Date(t.date).toLocaleDateString("id-ID");
    const desc = `"${t.description.replace(/"/g, '""')}"`;
    const type = t.type === "INCOME" ? "Pemasukan" : "Pengeluaran";
    const cat = t.category?.name || "-";
    const amount = t.amount.toString();
    return `${date},${desc},${type},${cat},${amount}`;
  }).join("\n");

  return header + rows;
}
