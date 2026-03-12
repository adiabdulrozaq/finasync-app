import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCategories } from "@/actions/category";
import CategoryClient from "@/app/dashboard/categories/CategoryClient";

export default async function CategoriesPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const categories = await getCategories();

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Kategori Transaksi</h1>
        <p className="text-gray-500">Kelola kategori khusus Anda untuk mencatat keuangan dengan lebih rapi dan berwarna.</p>
      </div>
      
      <CategoryClient initialCategories={categories} />
    </div>
  );
}
