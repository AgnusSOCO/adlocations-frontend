import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";
import PhotoUpload from "@/components/PhotoUpload";
import MapPicker from "@/components/MapPicker";

import { useTranslation } from "react-i18next";
type AdLocationFormData = {
  title: string;
  address: string;
  latitude?: string;
  longitude?: string;
  dimensions?: string;
  type: "billboard" | "poster" | "digital" | "transit" | "street_furniture" | "other";
  material?: string;
  hasVinyl: number;
  photos?: string;
  mapLink?: string;
  availabilityStatus: "available" | "occupied" | "maintenance" | "pending";
  priceEstimate?: string;
  notes?: string;
  landlordId?: string;
};

export default function AdLocationForm() {
  const { t } = useTranslation();
  const [, params] = useRoute("/ads/edit/:id");
  const [, setLocation] = useLocation();
  const isEdit = !!params?.id;
  const utils = trpc.useUtils();
  
  const { data: adLocation, isLoading } = trpc.adLocations.getById.useQuery(
    { id: parseInt(params?.id || "0") },
    { enabled: isEdit }
  );
  
  const { data: landlords } = trpc.landlords.list.useQuery();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AdLocationFormData>({
    defaultValues: adLocation
      ? {
          title: adLocation.title,
          address: adLocation.address,
          latitude: adLocation.latitude || "",
          longitude: adLocation.longitude || "",
          dimensions: adLocation.dimensions || "",
          type: adLocation.type as any,
          material: adLocation.material || "",
          hasVinyl: adLocation.hasVinyl,
          photos: adLocation.photos || "",
          mapLink: adLocation.mapLink || "",
          availabilityStatus: adLocation.availabilityStatus as any,
          priceEstimate: adLocation.priceEstimate
            ? (adLocation.priceEstimate / 100).toString()
            : "",
          notes: adLocation.notes || "",
          landlordId: adLocation.landlordId?.toString() || "",
        }
      : {
          type: "billboard",
          hasVinyl: 0,
          availabilityStatus: "available",
        },
  });

  const createMutation = trpc.adLocations.create.useMutation({
    onSuccess: () => {
      toast.success("Ad location created successfully!");
      utils.adLocations.list.invalidate();
      setLocation("/ads");
    },
    onError: (error) => {
      toast.error(`Failed to create location: ${error.message}`);
    },
  });

  const updateMutation = trpc.adLocations.update.useMutation({
    onSuccess: () => {
      toast.success("Ad location updated successfully!");
      utils.adLocations.list.invalidate();
      setLocation("/ads");
    },
    onError: (error) => {
      toast.error(`Failed to update location: ${error.message}`);
    },
  });

  const onSubmit = (data: AdLocationFormData) => {
    const payload = {
      ...data,
      priceEstimate: data.priceEstimate ? Math.round(parseFloat(data.priceEstimate) * 100) : undefined,
      landlordId: data.landlordId ? parseInt(data.landlordId) : undefined,
    };

    if (isEdit) {
      updateMutation.mutate({
        id: parseInt(params.id),
        data: payload,
      });
    } else {
      createMutation.mutate(payload);
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const selectedType = watch("type");
  const selectedStatus = watch("availabilityStatus");

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/ads">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEdit ? "Edit Ad Location" : "Add Ad Location"}
            </h1>
            <p className="text-muted-foreground mt-2">
              {isEdit
                ? "Update advertising space information"
                : "Create a new advertising space listing"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="e.g., Downtown Billboard - Main Street"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">
                  Address <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="address"
                  placeholder="Full address of the ad location"
                  {...register("address", { required: "Address is required" })}
                  rows={3}
                />
                {errors.address && (
                  <p className="text-sm text-destructive">{errors.address.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select
                    value={selectedType}
                    onValueChange={(value) => setValue("type", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="billboard">Billboard</SelectItem>
                      <SelectItem value="poster">Poster</SelectItem>
                      <SelectItem value="digital">Digital</SelectItem>
                      <SelectItem value="transit">Transit</SelectItem>
                      <SelectItem value="street_furniture">Street Furniture</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availabilityStatus">Availability Status</Label>
                  <Select
                    value={selectedStatus}
                    onValueChange={(value) => setValue("availabilityStatus", value as any)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="occupied">Occupied</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dimensions">Dimensions</Label>
                  <Input
                    id="dimensions"
                    placeholder="e.g., 14ft x 48ft"
                    {...register("dimensions")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="material">Material</Label>
                  <Input
                    id="material"
                    placeholder="e.g., Vinyl, Metal, Digital Screen"
                    {...register("material")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="landlordId">Landlord</Label>
                <Select
                  value={watch("landlordId")}
                  onValueChange={(value) => setValue("landlordId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a landlord (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {landlords?.map((landlord) => (
                      <SelectItem key={landlord.id} value={landlord.id.toString()}>
                        {landlord.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card>
            <CardHeader>
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Location Coordinates</Label>
                <MapPicker
                  latitude={watch("latitude")}
                  longitude={watch("longitude")}
                  onLocationSelect={(lat, lng) => {
                    setValue("latitude", lat);
                    setValue("longitude", lng);
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="mapLink">Map Link</Label>
                <Input
                  id="mapLink"
                  placeholder="Google Maps or other map service URL"
                  {...register("mapLink")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Pricing & Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing & Additional Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="priceEstimate">Price Estimate ($)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={async () => {
                      const formData = watch();
                      if (!formData.address || !formData.type) {
                        toast.error("Please fill in address and type first");
                        return;
                      }
                      toast.info("Estimating price with AI...");
                      try {
                        const result = await utils.client.ai.estimatePrice.mutate({
                          type: formData.type,
                          dimensions: formData.dimensions,
                          address: formData.address,
                          material: formData.material,
                          notes: formData.notes,
                        });
                        setValue("priceEstimate", (result.priceEstimate / 100).toString());
                        toast.success("Price estimated: $" + (result.priceEstimate / 100).toLocaleString());
                      } catch (error) {
                        toast.error("Failed to estimate price");
                      }
                    }}
                  >
                    AI Estimate
                  </Button>
                </div>
                <Input
                  id="priceEstimate"
                  type="number"
                  step="0.01"
                  placeholder="e.g., 2500.00"
                  {...register("priceEstimate")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hasVinyl">Has Vinyl</Label>
                <Select
                  value={watch("hasVinyl")?.toString()}
                  onValueChange={(value) => setValue("hasVinyl", parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">No</SelectItem>
                    <SelectItem value="1">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or special instructions"
                  {...register("notes")}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Photos</CardTitle>
            </CardHeader>
            <CardContent>
              <PhotoUpload
                onUpload={(urls) => setValue("photos", urls.join(","))}
                existingPhotos={watch("photos")?.split(",").filter(Boolean) || []}
              />
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/ads">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={createMutation.isPending}>
              <Save className="h-4 w-4 mr-2" />
              {createMutation.isPending ? "Creating..." : "Create Location"}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
