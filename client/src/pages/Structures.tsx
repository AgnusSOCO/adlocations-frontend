import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Wrench, AlertTriangle, CheckCircle2, XCircle, Edit } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function Structures() {
  const { t } = useTranslation();
  const { data: structures, isLoading } = trpc.structures.list.useQuery();
  const { data: adLocations } = trpc.adLocations.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const getAdLocationTitle = (adLocationId: number) => {
    return adLocations?.find((ad) => ad.id === adLocationId)?.title || t("unknownLocation");
  };

  const filteredStructures = structures?.filter((structure) => {
    const query = searchQuery.toLowerCase();
    const adTitle = getAdLocationTitle(structure.adLocationId).toLowerCase();
    return (
      adTitle.includes(query) ||
      structure.maintenanceStatus.toLowerCase().includes(query) ||
      structure.technicianNotes?.toLowerCase().includes(query)
    );
  });

  const getMaintenanceStatusClass = (status: string) => {
    const classes = {
      good: "status-paid",
      needs_attention: "status-maintenance",
      critical: "status-overdue",
    };
    return classes[status as keyof typeof classes] || "status-pending";
  };

  const getMaintenanceIcon = (status: string) => {
    const icons = {
      good: CheckCircle2,
      needs_attention: AlertTriangle,
      critical: XCircle,
    };
    return icons[status as keyof typeof icons] || Wrench;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("structures")}</h1>
            <p className="text-muted-foreground mt-2">
              {t("trackMaintenanceLicenses")}
            </p>
          </div>
          <Link href="/structures/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("addStructure")}
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchByLocationStatus")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Structures Grid */}
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
        ) : filteredStructures && filteredStructures.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredStructures.map((structure) => {
              const Icon = getMaintenanceIcon(structure.maintenanceStatus);
              return (
                <Card key={structure.id} className="card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {getAdLocationTitle(structure.adLocationId)}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          Structure #{structure.id}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 flex items-center gap-1 ${getMaintenanceStatusClass(
                          structure.maintenanceStatus
                        )}`}
                      >
                        <Icon className="h-3 w-3" />
                        {t(structure.maintenanceStatus === "needs_attention" ? "needsAttention" : structure.maintenanceStatus)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {structure.lastMaintenanceDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("lastMaintenance")}</span>
                          <span className="font-medium">
                            {format(new Date(structure.lastMaintenanceDate), "MMM d, yyyy")}
                          </span>
                        </div>
                      )}
                      {structure.nextMaintenanceDate && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("nextMaintenance")}</span>
                          <span className="font-medium">
                            {format(new Date(structure.nextMaintenanceDate), "MMM d, yyyy")}
                          </span>
                        </div>
                      )}
                      {structure.licenseExpiryDate && (
                        <div className="flex items-center justify-between text-sm pt-2 border-t">
                          <span className="text-muted-foreground">{t("licenseExpires")}</span>
                          <span className="font-medium">
                            {format(new Date(structure.licenseExpiryDate), "MMM d, yyyy")}
                          </span>
                        </div>
                      )}
                      {structure.technicianNotes && (
                        <div className="text-sm pt-2 border-t">
                          <p className="text-muted-foreground mb-1">{t("notes")}</p>
                          <p className="text-xs line-clamp-2">{structure.technicianNotes}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <div className="px-6 pb-4 border-t pt-4">
                    <Link href={`/structures/edit/${structure.id}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        <Edit className="h-4 w-4 mr-2" />
                        {t("editStructure")}
                      </Button>
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Wrench className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("noStructuresFound")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? t("tryAdjustingSearch")
                  : t("getStartedAddFirstStructure")}
              </p>
              {!searchQuery && (
                <Link href="/structures/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addStructure")}
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
