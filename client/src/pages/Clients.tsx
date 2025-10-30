import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc";
import { Plus, Search, Users, Mail, Phone, Edit, Download, FileText } from "lucide-react";
import { exportClientsToCSV, exportClientsToPDF } from "@/lib/exportUtils";
import { Link } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

export default function Clients() {
  const { t } = useTranslation();
  const { data: clients, isLoading } = trpc.clients.list.useQuery();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredClients = clients?.filter((client) => {
    const query = searchQuery.toLowerCase();
    return (
      client.name.toLowerCase().includes(query) ||
      client.email?.toLowerCase().includes(query) ||
      client.company?.toLowerCase().includes(query)
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

  const getAccountStatusClass = (status: string) => {
    const classes = {
      active: "status-paid",
      inactive: "status-pending",
      suspended: "status-overdue",
    };
    return classes[status as keyof typeof classes] || "status-pending";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t("clients")}</h1>
            <p className="text-muted-foreground mt-2">
              {t("manageClientRentalsAndAccounts")}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => filteredClients && exportClientsToCSV(filteredClients)}
              disabled={!filteredClients || filteredClients.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              {t("exportCsv")}
            </Button>
            <Button
              variant="outline"
              onClick={() => filteredClients && exportClientsToPDF(filteredClients)}
              disabled={!filteredClients || filteredClients.length === 0}
            >
              <FileText className="h-4 w-4 mr-2" />
              {t("exportPdf")}
            </Button>
            <Link href="/clients/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                {t("addClient")}
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

        {/* Clients Grid */}
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
        ) : filteredClients && filteredClients.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredClients.map((client) => (
              <Card key={client.id} className="card-hover">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg truncate">
                        {client.name}
                      </CardTitle>
                      {client.company && (
                        <p className="text-sm text-muted-foreground truncate mt-1">
                          {client.company}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1 ml-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getAccountStatusClass(
                          client.accountStatus
                        )}`}
                      >
                        {t(client.accountStatus)}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {client.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                    <div className="pt-2 border-t space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t("paymentStatus")}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusClass(
                            client.paymentStatus
                          )}`}
                        >
                          {t(client.paymentStatus)}
                        </span>
                      </div>
                      {client.rentAmount && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">{t("rentAmount")}</span>
                          <span className="font-medium">
                            ${(client.rentAmount / 100).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                <div className="px-6 pb-4 border-t pt-4">
                  <Link href={`/clients/edit/${client.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="h-4 w-4 mr-2" />
                      {t("editClient")}
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("noClientsFound")}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery
                  ? t("tryAdjustingSearch")
                  : t("getStartedAddFirstClient")}
              </p>
              {!searchQuery && (
                <Link href="/clients/new">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {t("addClient")}
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
