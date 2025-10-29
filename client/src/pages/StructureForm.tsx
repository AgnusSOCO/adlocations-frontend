import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";

type StructureFormData = {
  adLocationId: string;
  maintenanceStatus: "good" | "needs_attention" | "critical";
  licenseFileUrl?: string;
  licenseExpiryDate?: string;
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  technicianNotes?: string;
};

export default function StructureForm() {
  const [, params] = useRoute("/structures/edit/:id");
  const [, setLocation] = useLocation();
  const isEdit = !!params?.id;

  const { data: structure, isLoading } = trpc.structures.getById.useQuery(
    { id: parseInt(params?.id || "0") },
    { enabled: isEdit }
  );

  const { data: adLocations } = trpc.adLocations.list.useQuery();

  const createMutation = trpc.structures.create.useMutation();
  const updateMutation = trpc.structures.update.useMutation();
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<StructureFormData>({
    defaultValues: structure
      ? {
          adLocationId: structure.adLocationId.toString(),
          maintenanceStatus: structure.maintenanceStatus as any,
          licenseFileUrl: structure.licenseFileUrl || "",
          licenseExpiryDate: structure.licenseExpiryDate
            ? new Date(structure.licenseExpiryDate).toISOString().split("T")[0]
            : "",
          lastMaintenanceDate: structure.lastMaintenanceDate
            ? new Date(structure.lastMaintenanceDate).toISOString().split("T")[0]
            : "",
          nextMaintenanceDate: structure.nextMaintenanceDate
            ? new Date(structure.nextMaintenanceDate).toISOString().split("T")[0]
            : "",
          technicianNotes: structure.technicianNotes || "",
        }
      : {
          maintenanceStatus: "good",
          adLocationId: "",
        },
  });

  const onSubmit = async (data: StructureFormData) => {
    try {
      const payload = {
        adLocationId: parseInt(data.adLocationId),
        maintenanceStatus: data.maintenanceStatus,
        licenseFileUrl: data.licenseFileUrl || undefined,
        licenseExpiryDate: data.licenseExpiryDate
          ? new Date(data.licenseExpiryDate)
          : undefined,
        lastMaintenanceDate: data.lastMaintenanceDate
          ? new Date(data.lastMaintenanceDate)
          : undefined,
        nextMaintenanceDate: data.nextMaintenanceDate
          ? new Date(data.nextMaintenanceDate)
          : undefined,
        technicianNotes: data.technicianNotes || undefined,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({
          id: parseInt(params.id),
          data: payload,
        });
        toast.success("Structure updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Structure created successfully");
      }

      utils.structures.list.invalidate();
      setLocation("/structures");
    } catch (error) {
      toast.error(
        isEdit ? "Failed to update structure" : "Failed to create structure"
      );
    }
  };

  if (isEdit && isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/structures">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Structures
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Structure" : "Add New Structure"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit
              ? "Update structure maintenance and license information"
              : "Enter structure maintenance and license information"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Structure Information</CardTitle>
              <CardDescription>
                Link structure to ad location and set maintenance status
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adLocationId">
                  Ad Location <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={watch("adLocationId")}
                  onValueChange={(value) => setValue("adLocationId", value)}
                  disabled={isEdit}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select ad location" />
                  </SelectTrigger>
                  <SelectContent>
                    {adLocations?.map((location) => (
                      <SelectItem key={location.id} value={location.id.toString()}>
                        {location.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.adLocationId && (
                  <p className="text-sm text-destructive">
                    Ad location is required
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="maintenanceStatus">Maintenance Status</Label>
                <Select
                  value={watch("maintenanceStatus")}
                  onValueChange={(value) =>
                    setValue("maintenanceStatus", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="needs_attention">
                      Needs Attention
                    </SelectItem>
                    <SelectItem value="critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Maintenance Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Maintenance Schedule</CardTitle>
              <CardDescription>
                Track maintenance dates and schedule future work
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastMaintenanceDate">
                    Last Maintenance Date
                  </Label>
                  <Input
                    id="lastMaintenanceDate"
                    type="date"
                    {...register("lastMaintenanceDate")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextMaintenanceDate">
                    Next Maintenance Date
                  </Label>
                  <Input
                    id="nextMaintenanceDate"
                    type="date"
                    {...register("nextMaintenanceDate")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="technicianNotes">Technician Notes</Label>
                <Textarea
                  id="technicianNotes"
                  placeholder="Notes from maintenance technician..."
                  {...register("technicianNotes")}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* License Information */}
          <Card>
            <CardHeader>
              <CardTitle>License Information</CardTitle>
              <CardDescription>
                License file and expiry date tracking
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="licenseFileUrl">License File URL</Label>
                <Input
                  id="licenseFileUrl"
                  type="url"
                  placeholder="https://example.com/license.pdf"
                  {...register("licenseFileUrl")}
                />
                <p className="text-xs text-muted-foreground">
                  Upload license file to storage and paste the URL here
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licenseExpiryDate">License Expiry Date</Label>
                <Input
                  id="licenseExpiryDate"
                  type="date"
                  {...register("licenseExpiryDate")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/structures">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Structure" : "Create Structure"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
