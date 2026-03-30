"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryPieChartProps {
  data: {
    name: string;
    value: number;
    color: string;
  }[];
  title?: string;
}

export default function CategoryPieChart({ data, title = "Pengeluaran per Kategori" }: CategoryPieChartProps) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>Tidak ada data untuk ditampilkan.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[250px] text-[var(--muted-foreground)] text-sm">
            Belum ada transaksi dengan kategori.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>Distribusi berdasarkan kategori</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid var(--border)",
                  boxShadow: "0 4px 12px -2px rgba(0,0,0,0.1)",
                  backgroundColor: "var(--card)",
                  color: "var(--foreground)",
                  fontSize: "13px",
                }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => [
                  `Rp ${Number(value).toLocaleString("id-ID")} (${total > 0 ? Math.round((Number(value) / total) * 100) : 0}%)`,
                  undefined,
                ]}
              />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: "12px" }}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(value: any) => (
                  <span style={{ color: "var(--foreground)" }}>{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
