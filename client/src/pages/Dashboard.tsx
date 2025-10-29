import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { MapPin, Building2, Users, Wrench, DollarSign, TrendingUp } from "lucide-react";
import RevenueChart from "@/components/RevenueChart";
import OccupancyChart from "@/components/OccupancyChart";
import UpcomingExpirations from "@/components/UpcomingExpirations";
import { StatsSkeleton } from "@/components/LoadingSkeleton";

export default function Dashboard() {
  const { data: adLocations, isLoading: loadingAds } = trpc.adLocations.list.useQuery();
  const { data: landlords, isLoading: loadingLandlords } = trpc.landlords.list.useQuery();
  const { data: clients, isLoading: loadingClients } = trpc.clients.list.useQuery();
  const { data: structures, isLoading: loadingStructures } = trpc.structures.list.useQuery();

  const isLoading = loadingAds || loadingLandlords || loadingClients || loadingStructures;

  const stats = [
    {
      title: "Total Ad Locations",
      value: adLocations?.length || 0,
      icon: MapPin,
      description: "Active advertising spaces",
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      title: "Available Locations",
      value: adLocations?.filter(ad => ad.availabilityStatus === "available").length || 0,
      icon: TrendingUp,
      description: "Ready for rental",
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/30",
    },
    {
      title: "Total Landlords",
      value: landlords?.length || 0,
      icon: Building2,
      description: "Property owners",
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      title: "Active Clients",
      value: clients?.filter(client => client.accountStatus === "active").length || 0,
      icon: Users,
      description: "Current renters",
      color: "text-amber-600",
      bgColor: "bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Structures",
      value: structures?.length || 0,
      icon: Wrench,
      description: "Under maintenance",
      color: "text-red-600",
      bgColor: "bg-red-100 dark:bg-red-900/30",
    },
    {
      title: "Monthly Revenue",
      value: `$${((clients?.reduce((sum, client) => sum + (client.rentAmount || 0), 0) || 0) / 100).toLocaleString()}`,
      icon: DollarSign,
      description: "Total rental income",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100 dark:bg-emerald-900/30",
    },
  ];

  const occupancyRate = adLocations?.length
    ? ((adLocations.filter(ad => ad.availabilityStatus === "occupied").length / adLocations.length) * 100).toFixed(1)
    : 0;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Overview of your ad locations management platform
          </p>
        </div>

        {/* Stats Grid */}
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.title} className="card-hover">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                      <Icon className={`h-4 w-4 ${stat.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stat.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Occupancy Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Occupancy Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Current occupancy</span>
                <span className="text-2xl font-bold">{occupancyRate}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-500"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Payment Status */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Paid</span>
                  <span className="status-paid px-2 py-1 rounded-full text-xs font-medium">
                    {clients?.filter(c => c.paymentStatus === "paid").length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Pending</span>
                  <span className="status-pending px-2 py-1 rounded-full text-xs font-medium">
                    {clients?.filter(c => c.paymentStatus === "pending").length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Overdue</span>
                  <span className="status-overdue px-2 py-1 rounded-full text-xs font-medium">
                    {clients?.filter(c => c.paymentStatus === "overdue").length || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Status */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Good</span>
                  <span className="status-paid px-2 py-1 rounded-full text-xs font-medium">
                    {structures?.filter(s => s.maintenanceStatus === "good").length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Needs Attention</span>
                  <span className="status-maintenance px-2 py-1 rounded-full text-xs font-medium">
                    {structures?.filter(s => s.maintenanceStatus === "needs_attention").length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Critical</span>
                  <span className="status-overdue px-2 py-1 rounded-full text-xs font-medium">
                    {structures?.filter(s => s.maintenanceStatus === "critical").length || 0}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid gap-6 md:grid-cols-2 mt-6">
          <RevenueChart />
          <OccupancyChart />
        </div>

        {/* Upcoming Expirations */}
        <div className="mt-6">
          <UpcomingExpirations />
        </div>
      </div>
    </DashboardLayout>
  );
}
