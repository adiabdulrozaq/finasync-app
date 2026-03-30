import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { getTransactions } from "@/actions/transaction";
import { getDashboardAnalytics } from "@/actions/analytics";
import { getCategories } from "@/actions/category";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const transactions = await getTransactions();
  const analytics = await getDashboardAnalytics(30);
  const categories = await getCategories();

  return (
    <div className="py-2 sm:py-4">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-[var(--foreground)]">
          Halo, {session.user?.name}! 👋
        </h1>
        <p className="mt-1 text-[var(--muted-foreground)]">
          Berikut adalah ringkasan keuangan Anda.
        </p>
      </div>
      <DashboardClient initialTransactions={transactions} analytics={analytics} categories={categories} />
    </div>
  );
}
