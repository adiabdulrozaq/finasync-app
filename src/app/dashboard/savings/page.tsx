import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSavingsGoals } from "@/actions/savings";
import SavingsClient from "./SavingsClient";

export default async function SavingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const goals = await getSavingsGoals();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--foreground)]">
          Target Tabungan
        </h1>
        <p className="text-[var(--muted-foreground)]">
          Buat target tabungan dan pantau kemajuan menuju impian Anda.
        </p>
      </div>

      <SavingsClient initialGoals={JSON.parse(JSON.stringify(goals))} />
    </div>
  );
}
