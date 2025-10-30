import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Building2, Mail, Phone, Edit, Download, FileText } from "lucide-react";
import { exportLandlordsToCSV, exportLandlordsToPDF } from "@/lib/exportUtils";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function Landlords() {
  const { t } = useTranslation();
  const { data: landlords, isLoading } = trpc.landlords.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredLandlords = landlords?.filter((landlord) => {
    const query = searchQuery.toLowerCase();
    return (
      landlord.name.toLowerCase().includes(query) ||
      landlord.email?.toLowerCase().includes(query) ||
      landlord.company?.toLowerCase().includes(query)
    );
  });

  const getPaymentStatusClass = (status: string) => {
    const classes = {
      paid: "status-paid",
      pending: "status-pending",
      overdue: "status-overdue",
    };
    return classes[status as keyof typeof classes] || "status-pending";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("landlords")}</h1>
            <p className="text-muted-foreground mt-2">
              {t("managePropertyOwnersAndContracts")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => filteredLandlords && exportLandlordsToCSV(filteredLandlords)}
              disabled={!filteredLandlords || filteredLandlords.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              {t("exportCsv")}
            </Button>
            <Button
              variant="outline"
              onClick={() => filteredLandlords && exportLandlordsToPDF(filteredLandlords)}
              disabled={!filteredLandlords || filteredLandlords.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t("exportPdf")}
            </Button>
            <Link href="/landlords/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("addLandlord")}
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchByNameEmailCompany")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Landlords Grid */}
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
        ) : filteredLandlords && filteredLandlords.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredLandlords.map((landlord) => (
              <Card key={landlord.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {landlord.name}
                      </CardTitle>
                      {landlord.company && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {landlord.company}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${getPaymentStatusClass(
                        landlord.paymentStatus
                      )}`}
                    >
                      {t(landlord.paymentStatus)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {landlord.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{landlord.email}</span>
                      </div>
                    )}
                    {landlord.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{landlord.phone}</span>
                      </div>
                    )}
                    {landlord.rentAmount && (
                      <div className="flex items-center justify-between text-sm pt-2 border-t">
                        <span className="text-muted-foreground">{t("monthlyRent")}</span>
                        <span className="font-medium">
                          ${(landlord.rentAmount / 100).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
                <div className="px-6 pb-4 border-t pt-4">
                  <Link href={`/landlords/edit/${landlord.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      {t("editLandlord")}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("noLandlordsFound")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? t("tryAdjustingSearch")
                  : t("getStartedAddFirstLandlord")}
              </p>
              {!searchQuery && (
                <Link href="/landlords/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addLandlord")}
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
