import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardClient from "./DashboardClient";
import { getTransactions } from "@/actions/transaction";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const transactions = await getTransactions();

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Halo, {session.user?.name}! 👋
          </h1>
          <p className="mt-1 text-gray-600">
            Berikut adalah ringkasan keuangan Anda.
          </p>
        </div>
        <DashboardClient initialTransactions={transactions} />
      </div>
    </div>
  );
}
