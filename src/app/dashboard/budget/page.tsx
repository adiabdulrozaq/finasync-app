import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getBudgets } from "@/actions/budget";
import BudgetClient from "./BudgetClient";

export default async function BudgetPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const currentYear = new Date().getFullYear();
  const { budgets, spentByMonth } = await getBudgets(currentYear);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Target Anggaran Bulanan
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Kelola dan pantau batas pengeluaran Anda agar tetap hemat sepanjang tahun {currentYear}.
        </p>
      </div>

      <BudgetClient
        initialBudgets={budgets}
        spentByMonth={spentByMonth}
        currentYear={currentYear}
      />
    </div>
  );
}
