import { useEffect, useRef, useState } from "react";
import Map, { Marker, Popup, NavigationControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
const MAPBOX_STYLE = import.meta.env.VITE_MAPBOX_STYLE_URL;

interface Location {
  id: number;
  title: string;
  latitude: string | null;
  longitude: string | null;
  address: string;
  availabilityStatus: string;
}

interface MapViewProps {
  locations?: Location[];
  selectedLocation?: Location | null;
  height?: string;
  onLocationClick?: (location: Location) => void;
}

export default function MapView({
  locations = [],
  selectedLocation,
  height = "500px",
  onLocationClick,
}: MapViewProps) {
  const [popupInfo, setPopupInfo] = useState<Location | null>(null);
  const [viewState, setViewState] = useState({
    longitude: -74.006,
    latitude: 40.7128,
    zoom: 12,
  });

  useEffect(() => {
    if (selectedLocation?.latitude && selectedLocation?.longitude) {
      setViewState({
        longitude: parseFloat(selectedLocation.longitude),
        latitude: parseFloat(selectedLocation.latitude),
        zoom: 15,
      });
    } else if (locations.length > 0) {
      const validLocations = locations.filter(
        (loc) => loc.latitude && loc.longitude
      );
      if (validLocations.length > 0) {
        const avgLat =
          validLocations.reduce(
            (sum, loc) => sum + parseFloat(loc.latitude!),
            0
          ) / validLocations.length;
        const avgLng =
          validLocations.reduce(
            (sum, loc) => sum + parseFloat(loc.longitude!),
            0
          ) / validLocations.length;
        setViewState({
          longitude: avgLng,
          latitude: avgLat,
          zoom: 12,
        });
      }
    }
  }, [selectedLocation, locations]);

  const getMarkerColor = (status: string) => {
    const colors = {
      available: "#10B981",
      occupied: "#3B82F6",
      maintenance: "#F59E0B",
      pending: "#6B7280",
    };
    return colors[status as keyof typeof colors] || "#6B7280";
  };

  const validLocations = locations.filter(
    (loc) => loc.latitude && loc.longitude
  );

  if (!MAPBOX_TOKEN) {
    return (
      <div
        className="flex items-center justify-center bg-muted rounded-lg"
        style={{ height }}
      >
        <p className="text-muted-foreground">
          Mapbox token not configured. Please add VITE_MAPBOX_ACCESS_TOKEN to
          your environment.
        </p>
      </div>
    );
  }

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border border-border">
      <Map
        {...viewState}
        onMove={(evt: any) => setViewState(evt.viewState)}
        mapboxAccessToken={MAPBOX_TOKEN}
        mapStyle={MAPBOX_STYLE || "mapbox://styles/mapbox/streets-v12"}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="top-right" />

        {validLocations.map((location) => (
          <Marker
            key={location.id}
            longitude={parseFloat(location.longitude!)}
            latitude={parseFloat(location.latitude!)}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              setPopupInfo(location);
              if (onLocationClick) {
                onLocationClick(location);
              }
            }}
          >
            <div
              className="cursor-pointer transition-transform hover:scale-110"
              style={{ color: getMarkerColor(location.availabilityStatus) }}
            >
              <MapPin className="h-8 w-8 drop-shadow-lg" fill="currentColor" />
            </div>
          </Marker>
        ))}

        {popupInfo && (
          <Popup
            longitude={parseFloat(popupInfo.longitude!)}
            latitude={parseFloat(popupInfo.latitude!)}
            anchor="top"
            onClose={() => setPopupInfo(null)}
            closeButton={true}
            closeOnClick={false}
          >
            <div className="p-2">
              <h3 className="font-semibold text-sm mb-1">{popupInfo.title}</h3>
              <p className="text-xs text-muted-foreground mb-2">
                {popupInfo.address}
              </p>
              <span
                className={`inline-block px-2 py-1 rounded-full text-xs font-medium status-${popupInfo.availabilityStatus}`}
              >
                {popupInfo.availabilityStatus}
              </span>
            </div>
          </Popup>
        )}
      </Map>
    </div>
  );
}
