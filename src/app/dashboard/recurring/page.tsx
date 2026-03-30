import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getRecurringTransactions } from "@/actions/recurring";
import { getCategories } from "@/actions/category";
import RecurringClient from "./RecurringClient";

export default async function RecurringPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const recurring = await getRecurringTransactions();
  const categories = await getCategories();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Transaksi Berulang
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Kelola langganan dan pembayaran rutin Anda agar tidak pernah terlewat.
        </p>
      </div>

      <RecurringClient
        initialRecurring={JSON.parse(JSON.stringify(recurring))}
        categories={JSON.parse(JSON.stringify(categories))}
      />
    </div>
  );
}
