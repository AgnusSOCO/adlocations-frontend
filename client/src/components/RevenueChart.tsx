import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function RevenueChart() {
  const { data: clients } = trpc.clients.list.useQuery();
  const { data: landlords } = trpc.landlords.list.useQuery();

  const generateMonthlyData = () => {
    const months = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString("en-US", { month: "short" });

      // Calculate revenue for this month (simplified - in real app would use actual transaction data)
      const clientRevenue =
        clients
          ?.filter((c) => {
            if (!c.rentalStartDate) return false;
            const startDate = new Date(c.rentalStartDate);
            return startDate <= date && (!c.rentalEndDate || new Date(c.rentalEndDate) >= date);
          })
          .reduce((sum, c) => sum + (c.rentAmount || 0), 0) || 0;

      const landlordCosts =
        landlords
          ?.filter((l) => {
            if (!l.contractStartDate) return false;
            const startDate = new Date(l.contractStartDate);
            return (
              startDate <= date && (!l.contractEndDate || new Date(l.contractEndDate) >= date)
            );
          })
          .reduce((sum, l) => sum + (l.rentAmount || 0), 0) || 0;

      months.push({
        month: monthName,
        revenue: clientRevenue / 100,
        costs: landlordCosts / 100,
        profit: (clientRevenue - landlordCosts) / 100,
      });
    }

    return months;
  };

  const data = generateMonthlyData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Revenue Trends (Last 6 Months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: "hsl(var(--muted-foreground))" }}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              name="Revenue"
              dot={{ fill: "hsl(var(--primary))" }}
            />
            <Line
              type="monotone"
              dataKey="costs"
              stroke="hsl(var(--destructive))"
              strokeWidth={2}
              name="Costs"
              dot={{ fill: "hsl(var(--destructive))" }}
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="hsl(142.1 76.2% 36.3%)"
              strokeWidth={2}
              name="Profit"
              dot={{ fill: "hsl(142.1 76.2% 36.3%)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
