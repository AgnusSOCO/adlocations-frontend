import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { ArrowLeft, MapPin, Edit, Trash2, Download } from "lucide-react";
import { Link, useLocation, useRoute } from "wouter";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import MapView from "@/components/MapView";
import { LocationAnalysisDialog } from "@/components/LocationAnalysisDialog";

import { useTranslation } from "react-i18next";
export default function AdLocationDetail() {
  const { t } = useTranslation();
  const [, params] = useRoute("/ads/:id");
  const [, setLocation] = useLocation();
  const adId = params?.id ? parseInt(params.id) : 0;

  const { data: adLocation, isLoading } = trpc.adLocations.getById.useQuery({ id: adId });
  const { data: landlord } = trpc.landlords.getById.useQuery(
    { id: adLocation?.landlordId || 0 },
    { enabled: !!adLocation?.landlordId }
  );
  const { data: structure } = trpc.structures.getByAdLocationId.useQuery(
    { adLocationId: adId },
    { enabled: !!adId }
  );

  const utils = trpc.useUtils();
  const deleteMutation = trpc.adLocations.delete.useMutation({
    onSuccess: () => {
      toast.success(t("adLocationDeletedSuccessfully"));
      utils.adLocations.list.invalidate();
      setLocation("/ads");
    },
    onError: (error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this ad location?")) {
      deleteMutation.mutate({ id: adId });
    }
  };

  const downloadQRCode = () => {
    const svg = document.getElementById("qr-code");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");

      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-code-${adLocation?.title || "location"}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = "data:image/svg+xml;base64," + btoa(svgData);
  };

  const getStatusBadgeClass = (status: string) => {
    const classes = {
      available: "status-available",
      occupied: "status-occupied",
      maintenance: "status-maintenance",
      pending: "status-pending",
    };
    return classes[status as keyof typeof classes] || "status-pending";
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!adLocation) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Location Not Found</h2>
          <Link href="/ads">
            <Button>Back to Locations</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const locationUrl = `${window.location.origin}/ads/${adId}`;

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/ads">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{adLocation.title}</h1>
              <div className="flex items-center gap-2 mt-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <p className="text-muted-foreground">{adLocation.address}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <LocationAnalysisDialog location={adLocation} />
            <Link href={`/ads/edit/${adId}`}>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Type</p>
                    <p className="font-medium capitalize">{adLocation.type}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(
                        adLocation.availabilityStatus
                      )}`}
                    >
                      {adLocation.availabilityStatus}
                    </span>
                  </div>
                  {adLocation.dimensions && (
                    <div>
                      <p className="text-sm text-muted-foreground">Dimensions</p>
                      <p className="font-medium">{adLocation.dimensions}</p>
                    </div>
                  )}
                  {adLocation.material && (
                    <div>
                      <p className="text-sm text-muted-foreground">Material</p>
                      <p className="font-medium">{adLocation.material}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">Has Vinyl</p>
                    <p className="font-medium">{adLocation.hasVinyl ? "Yes" : "No"}</p>
                  </div>
                  {adLocation.priceEstimate && (
                    <div>
                      <p className="text-sm text-muted-foreground">Price Estimate</p>
                      <p className="font-medium text-lg">
                        ${(adLocation.priceEstimate / 100).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
                {adLocation.notes && (
                  <div className="pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Notes</p>
                    <p className="text-sm">{adLocation.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Details with Map */}
            {(adLocation.latitude || adLocation.longitude || adLocation.mapLink) && (
              <Card>
                <CardHeader>
                  <CardTitle>Location Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {(adLocation.latitude && adLocation.longitude) && (
                    <div className="mb-4">
                      <MapView
                        locations={[adLocation as any]}
                        selectedLocation={adLocation as any}
                        height="300px"
                      />
                    </div>
                  )}
                  {(adLocation.latitude || adLocation.longitude) && (
                    <div className="grid grid-cols-2 gap-4">
                      {adLocation.latitude && (
                        <div>
                          <p className="text-sm text-muted-foreground">Latitude</p>
                          <p className="font-medium">{adLocation.latitude}</p>
                        </div>
                      )}
                      {adLocation.longitude && (
                        <div>
                          <p className="text-sm text-muted-foreground">Longitude</p>
                          <p className="font-medium">{adLocation.longitude}</p>
                        </div>
                      )}
                    </div>
                  )}
                  {adLocation.mapLink && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Map Link</p>
                      <a
                        href={adLocation.mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline text-sm"
                      >
                        View on Map →
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Landlord Information */}
            {landlord && (
              <Card>
                <CardHeader>
                  <CardTitle>Landlord Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{landlord.name}</p>
                  </div>
                  {landlord.company && (
                    <div>
                      <p className="text-sm text-muted-foreground">Company</p>
                      <p className="font-medium">{landlord.company}</p>
                    </div>
                  )}
                  {landlord.email && (
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p className="font-medium">{landlord.email}</p>
                    </div>
                  )}
                  {landlord.phone && (
                    <div>
                      <p className="text-sm text-muted-foreground">Phone</p>
                      <p className="font-medium">{landlord.phone}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Structure Information */}
            {structure && (
              <Card>
                <CardHeader>
                  <CardTitle>Structure Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Maintenance Status</p>
                    <p className="font-medium capitalize">
                      {structure.maintenanceStatus.replace("_", " ")}
                    </p>
                  </div>
                  {structure.technicianNotes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Technician Notes</p>
                      <p className="text-sm">{structure.technicianNotes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* QR Code Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>QR Code</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="qr-container">
                  <QRCodeSVG
                    id="qr-code"
                    value={locationUrl}
                    size={200}
                    level="H"
                    includeMargin={true}
                  />
                </div>
                <Button onClick={downloadQRCode} variant="outline" className="w-full">
                  <Download className="h-4 w-4 mr-2" />
                  Download QR Code
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Scan to view this location
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created</span>
                  <span className="font-medium">
                    {new Date(adLocation.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="font-medium">
                    {new Date(adLocation.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
