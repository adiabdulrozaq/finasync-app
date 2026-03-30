import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getDashboardAnalytics, getCategoryAnalytics, getMonthlyComparison } from "@/actions/analytics";
import AnalyticsClient from "@/app/dashboard/analytics/AnalyticsClient";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const [analyticsData, categoryData, monthlyData] = await Promise.all([
    getDashboardAnalytics(30),
    getCategoryAnalytics(),
    getMonthlyComparison(),
  ]);

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Analitik Keuangan
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Pantau arus kas dan analisis pola pengeluaran Anda.
        </p>
      </div>

      <AnalyticsClient
        initialData={analyticsData}
        categoryData={categoryData}
        monthlyData={monthlyData}
      />
    </div>
  );
}
