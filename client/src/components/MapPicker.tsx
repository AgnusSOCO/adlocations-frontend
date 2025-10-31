import { useEffect, useRef, useState } from "react";
import Map, { Marker } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { MapPin } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useTranslation } from "react-i18next";

interface MapPickerProps {
  latitude?: string;
  longitude?: string;
  onLocationSelect: (lat: string, lng: string) => void;
}

export default function MapPicker({
  latitude,
  longitude,
  onLocationSelect,
}: MapPickerProps) {
  const { t } = useTranslation();
  const mapboxToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  const mapboxStyle = import.meta.env.VITE_MAPBOX_STYLE_URL;
  const [viewport, setViewport] = useState({
    latitude: latitude ? parseFloat(latitude) : 40.7128,
    longitude: longitude ? parseFloat(longitude) : -74.006,
    zoom: 12,
  });

  const [marker, setMarker] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude
      ? { lat: parseFloat(latitude), lng: parseFloat(longitude) }
      : null
  );

  const [manualLat, setManualLat] = useState(latitude || "");
  const [manualLng, setManualLng] = useState(longitude || "");

  useEffect(() => {
    if (latitude && longitude) {
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      setMarker({ lat, lng });
      setViewport((prev) => ({ ...prev, latitude: lat, longitude: lng }));
    }
  }, [latitude, longitude]);

  const handleMapClick = (event: any) => {
    const { lngLat } = event;
    const lat = lngLat.lat.toFixed(6);
    const lng = lngLat.lng.toFixed(6);
    
    setMarker({ lat: parseFloat(lat), lng: parseFloat(lng) });
    setManualLat(lat);
    setManualLng(lng);
    onLocationSelect(lat, lng);
  };

  const handleManualUpdate = () => {
    if (manualLat && manualLng) {
      const lat = parseFloat(manualLat);
      const lng = parseFloat(manualLng);
      
      if (!isNaN(lat) && !isNaN(lng)) {
        setMarker({ lat, lng });
        setViewport((prev) => ({ ...prev, latitude: lat, longitude: lng }));
        onLocationSelect(lat.toFixed(6), lng.toFixed(6));
      }
    }
  };

  if (!mapboxToken || !mapboxStyle) {
    return (
      <div className="p-4 border rounded-lg bg-muted">
        <p className="text-sm text-muted-foreground">
          Map configuration is missing. Please set up Mapbox credentials.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden border">
        <Map
          {...viewport}
          onMove={(evt) => setViewport(evt.viewState)}
          onClick={handleMapClick}
          mapboxAccessToken={mapboxToken}
          mapStyle={mapboxStyle}
          style={{ width: "100%", height: "400px" }}
        >
          {marker && (
            <Marker latitude={marker.lat} longitude={marker.lng}>
              <div className="relative">
                <MapPin className="h-8 w-8 text-primary fill-primary drop-shadow-lg" />
              </div>
            </Marker>
          )}
        </Map>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="manual-lat">Latitude</Label>
          <Input
            id="manual-lat"
            type="number"
            step="0.000001"
            placeholder="40.712800"
            value={manualLat}
            onChange={(e) => setManualLat(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="manual-lng">Longitude</Label>
          <Input
            id="manual-lng"
            type="number"
            step="0.000001"
            placeholder="-74.006000"
            value={manualLng}
            onChange={(e) => setManualLng(e.target.value)}
          />
        </div>
      </div>

      <Button
        type="button"
        variant="outline"
        onClick={handleManualUpdate}
        className="w-full"
      >
        Update Location from Coordinates
      </Button>

      <p className="text-xs text-muted-foreground">
        Click on the map to select a location, or enter coordinates manually above.
      </p>
    </div>
  );
}
