import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { useState } from "react";
import Map, { Marker, Popup } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin, DollarSign, Ruler } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useTranslation } from "react-i18next";

export default function MapOverview() {
  const { t } = useTranslation();
  const { data: adLocations, isLoading } = trpc.adLocations.list.useQuery();
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);
  const [viewport, setViewport] = useState({
    latitude: 40.7128,
    longitude: -74.006,
    zoom: 10,
  });

  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const mapboxStyle = import.meta.env.VITE_MAPBOX_STYLE_URL;

  const locationsWithCoords = adLocations?.filter(
    (ad) => ad.latitude && ad.longitude
  );

  // Center map on first location if available
  if (locationsWithCoords && locationsWithCoords.length > 0 && viewport.zoom === 10) {
    const firstLoc = locationsWithCoords[0];
    if (firstLoc.latitude && firstLoc.longitude) {
      setViewport({
        latitude: parseFloat(firstLoc.latitude),
        longitude: parseFloat(firstLoc.longitude),
        zoom: 11,
      });
    }
  }

  const getMarkerColor = (status: string) => {
    switch (status) {
      case "available":
        return "#10b981"; // green
      case "occupied":
        return "#3b82f6"; // blue
      case "maintenance":
        return "#ef4444"; // red
      case "pending":
        return "#f59e0b"; // amber
      default:
        return "#6b7280"; // gray
    }
  };

  const selectedAd = locationsWithCoords?.find(
    (ad) => ad.id === selectedLocation
  );

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[600px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  if (!mapboxToken || !mapboxStyle) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              {t("mapConfigurationMissing")}
            </p>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("mapOverview")}</h1>
          <p className="text-muted-foreground mt-2">
            {t("viewAllLocationsMap")}
          </p>
        </div>

        {/* Legend */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="font-medium">{t("legend")}:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span>{t("available")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span>{t("occupied")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span>{t("maintenance")}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>{t("pending")}</span>
              </div>
              <span className="text-muted-foreground ml-auto">
                {locationsWithCoords?.length || 0} {t("locationsWithCoordinates")}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Map */}
        <Card>
          <CardContent className="p-0">
            <div className="rounded-lg overflow-hidden" style={{ height: "600px" }}>
              {locationsWithCoords && locationsWithCoords.length > 0 ? (
                <Map
                  {...viewport}
                  onMove={(evt) => setViewport(evt.viewState)}
                  mapboxAccessToken={mapboxToken}
                  mapStyle={mapboxStyle}
                  style={{ width: "100%", height: "100%" }}
                >
                  {locationsWithCoords.map((location) => {
                    if (!location.latitude || !location.longitude) return null;

                    return (
                      <Marker
                        key={location.id}
                        latitude={parseFloat(location.latitude)}
                        longitude={parseFloat(location.longitude)}
                        onClick={(e) => {
                          e.originalEvent.stopPropagation();
                          setSelectedLocation(location.id);
                        }}
                      >
                        <div
                          className="cursor-pointer transition-transform hover:scale-110"
                          style={{
                            color: getMarkerColor(location.availabilityStatus),
                          }}
                        >
                          <MapPin className="h-8 w-8 fill-current drop-shadow-lg" />
                        </div>
                      </Marker>
                    );
                  })}

                  {selectedAd && selectedAd.latitude && selectedAd.longitude && (
                    <Popup
                      latitude={parseFloat(selectedAd.latitude)}
                      longitude={parseFloat(selectedAd.longitude)}
                      onClose={() => setSelectedLocation(null)}
                      closeButton={true}
                      closeOnClick={false}
                      anchor="bottom"
                      offset={25}
                    >
                      <div className="p-3 min-w-[250px]">
                        <h3 className="font-semibold text-base mb-2">
                          {selectedAd.title}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <p className="text-muted-foreground">
                            {selectedAd.address}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground">{t("status")}:</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium capitalize status-${selectedAd.availabilityStatus}`}
                            >
                              {t(selectedAd.availabilityStatus)}
                            </span>
                          </div>
                          {selectedAd.dimensions && (
                            <div className="flex items-center gap-2">
                              <Ruler className="h-4 w-4 text-muted-foreground" />
                              <span>{selectedAd.dimensions}</span>
                            </div>
                          )}
                          {selectedAd.priceEstimate && (
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span>
                                ${(selectedAd.priceEstimate / 100).toLocaleString()}
                              </span>
                            </div>
                          )}
                        </div>
                        <Link href={`/ads/${selectedAd.id}`}>
                          <Button className="w-full mt-3" size="sm">
                            {t("viewDetails")}
                          </Button>
                        </Link>
                      </div>
                    </Popup>
                  )}
                </Map>
              ) : (
                <div className="flex items-center justify-center h-full bg-muted">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">
                      {t("noLocationsWithCoordinates")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {t("addCoordinatesToLocations")}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
