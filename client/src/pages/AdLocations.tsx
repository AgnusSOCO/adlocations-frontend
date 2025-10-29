import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Search, MapPin, Eye, Download, FileText } from "lucide-react";
import { exportAdLocationsToCSV, exportAdLocationsToPDF } from "@/lib/exportUtils";
import { useState } from "react";
import { Link } from "wouter";

export default function AdLocations() {
  const { data: adLocations, isLoading } = trpc.adLocations.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLocations = adLocations?.filter((location) => {
    const query = searchQuery.toLowerCase();
    return (
      location.title.toLowerCase().includes(query) ||
      location.address.toLowerCase().includes(query) ||
      location.type.toLowerCase().includes(query)
    );
  });

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      available: "status-available",
      occupied: "status-occupied",
      maintenance: "status-maintenance",
      pending: "status-pending",
    };
    return classes[status as keyof typeof classes] || "status-pending";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Ad Locations</h1>
            <p className="text-muted-foreground mt-2">
              Manage your outdoor advertising spaces
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => filteredLocations && exportAdLocationsToCSV(filteredLocations)}
              disabled={!filteredLocations || filteredLocations.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="outline"
              onClick={() => filteredLocations && exportAdLocationsToPDF(filteredLocations)}
              disabled={!filteredLocations || filteredLocations.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              Export PDF
            </Button>
            <Link href="/ads/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Location
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title, address, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Locations Grid */}
        {isLoading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredLocations && filteredLocations.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLocations.map((location) => (
              <Card key={location.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {location.title}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{location.address}</span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getStatusBadgeClass(
                        location.availabilityStatus
                      )}`}
                    >
                      {location.availabilityStatus}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Type</span>
                      <span className="font-medium capitalize">{location.type}</span>
                    </div>
                    {location.dimensions && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Dimensions</span>
                        <span className="font-medium">{location.dimensions}</span>
                      </div>
                    )}
                    {location.priceEstimate && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Price</span>
                        <span className="font-medium">
                          ${(location.priceEstimate / 100).toLocaleString()}
                        </span>
                      </div>
                    )}
                    <Link href={`/ads/${location.id}`}>
                      <Button variant="outline" size="sm" className="w-full mt-2">
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MapPin className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No locations found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? "Try adjusting your search terms"
                  : "Get started by adding your first ad location"}
              </p>
              {!searchQuery && (
                <Link href="/ads/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Location
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
