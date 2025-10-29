import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Calendar, AlertTriangle } from "lucide-react";
import { differenceInDays, format } from "date-fns";
import { Link } from "wouter";
import { Button } from "./ui/button";

export default function UpcomingExpirations() {
  const { data: clients } = trpc.clients.list.useQuery();
  const { data: landlords } = trpc.landlords.list.useQuery();
  const { data: structures } = trpc.structures.list.useQuery();

  const getExpiringItems = () => {
    const items: Array<{
      type: "client" | "landlord" | "license";
      name: string;
      date: Date;
      daysLeft: number;
      id: number;
    }> = [];

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    // Check client rental expirations
    clients?.forEach((client) => {
      if (client.rentalEndDate) {
        const endDate = new Date(client.rentalEndDate);
        if (endDate >= now && endDate <= thirtyDaysFromNow) {
          items.push({
            type: "client",
            name: `${client.name} - Rental`,
            date: endDate,
            daysLeft: differenceInDays(endDate, now),
            id: client.id,
          });
        }
      }
    });

    // Check landlord contract expirations
    landlords?.forEach((landlord) => {
      if (landlord.contractEndDate) {
        const endDate = new Date(landlord.contractEndDate);
        if (endDate >= now && endDate <= thirtyDaysFromNow) {
          items.push({
            type: "landlord",
            name: `${landlord.name} - Contract`,
            date: endDate,
            daysLeft: differenceInDays(endDate, now),
            id: landlord.id,
          });
        }
      }
    });

    // Check structure license expirations
    structures?.forEach((structure) => {
      if (structure.licenseExpiryDate) {
        const expiryDate = new Date(structure.licenseExpiryDate);
        if (expiryDate >= now && expiryDate <= thirtyDaysFromNow) {
          items.push({
            type: "license",
            name: `Structure #${structure.id} - License`,
            date: expiryDate,
            daysLeft: differenceInDays(expiryDate, now),
            id: structure.id,
          });
        }
      }
    });

    return items.sort((a, b) => a.daysLeft - b.daysLeft);
  };

  const expiringItems = getExpiringItems();

  const getUrgencyClass = (daysLeft: number) => {
    if (daysLeft <= 7) return "text-destructive";
    if (daysLeft <= 14) return "text-orange-500";
    return "text-yellow-600";
  };

  const getUrgencyBadge = (daysLeft: number) => {
    if (daysLeft <= 7) return "bg-destructive/10 text-destructive";
    if (daysLeft <= 14) return "bg-orange-500/10 text-orange-500";
    return "bg-yellow-600/10 text-yellow-600";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Upcoming Expirations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {expiringItems.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
            <p className="text-sm text-muted-foreground">
              No expirations in the next 30 days
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {expiringItems.slice(0, 5).map((item, index) => (
              <div
                key={index}
                className="flex items-start justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {item.daysLeft <= 7 && (
                      <AlertTriangle className="h-4 w-4 text-destructive flex-shrink-0" />
                    )}
                    <p className="font-medium text-sm truncate">{item.name}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format(item.date, "MMM dd, yyyy")}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 ml-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getUrgencyBadge(
                      item.daysLeft
                    )}`}
                  >
                    {item.daysLeft === 0
                      ? "Today"
                      : item.daysLeft === 1
                      ? "1 day"
                      : `${item.daysLeft} days`}
                  </span>
                  <Link
                    href={
                      item.type === "client"
                        ? `/clients/edit/${item.id}`
                        : item.type === "landlord"
                        ? `/landlords/edit/${item.id}`
                        : `/structures/edit/${item.id}`
                    }
                  >
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      View
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            {expiringItems.length > 5 && (
              <p className="text-xs text-muted-foreground text-center pt-2">
                +{expiringItems.length - 5} more expiring soon
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
