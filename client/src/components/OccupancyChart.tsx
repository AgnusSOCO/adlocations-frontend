import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { BarChart3 } from "lucide-react";

import { useTranslation } from "react-i18next";
export default function OccupancyChart() {
  const { t } = useTranslation();
  const { data: adLocations } = trpc.adLocations.list.useQuery();

  const getOccupancyData = () => {
    if (!adLocations) return [];

    const statusCounts = {
      available: 0,
      occupied: 0,
      maintenance: 0,
      pending: 0,
    };

    adLocations.forEach((ad) => {
      statusCounts[ad.availabilityStatus]++;
    });

    return [
      { name: "Available", value: statusCounts.available, color: "hsl(142.1 76.2% 36.3%)" },
      { name: "Occupied", value: statusCounts.occupied, color: "hsl(var(--primary))" },
      { name: "Maintenance", value: statusCounts.maintenance, color: "hsl(var(--destructive))" },
      { name: "Pending", value: statusCounts.pending, color: "hsl(var(--warning))" },
    ].filter((item) => item.value > 0);
  };

  const data = getOccupancyData();

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {payload[0].value} location{payload[0].value !== 1 ? "s" : ""}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          Occupancy Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">No data available</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
