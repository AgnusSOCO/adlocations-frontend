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

type LandlordFormData = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  rentalSite?: string;
  contractStartDate?: string;
  contractEndDate?: string;
  rentAmount?: string;
  paymentStatus: "paid" | "pending" | "overdue";
  notes?: string;
};

export default function LandlordForm() {
  const [, params] = useRoute("/landlords/edit/:id");
  const [, setLocation] = useLocation();
  const isEdit = !!params?.id;

  const { data: landlord, isLoading } = trpc.landlords.getById.useQuery(
    { id: parseInt(params?.id || "0") },
    { enabled: isEdit }
  );

  const createMutation = trpc.landlords.create.useMutation();
  const updateMutation = trpc.landlords.update.useMutation();
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LandlordFormData>({
    defaultValues: landlord
      ? {
          name: landlord.name,
          email: landlord.email || "",
          phone: landlord.phone || "",
          company: landlord.company || "",
          rentalSite: landlord.rentalSite || "",
          contractStartDate: landlord.contractStartDate
            ? new Date(landlord.contractStartDate).toISOString().split("T")[0]
            : "",
          contractEndDate: landlord.contractEndDate
            ? new Date(landlord.contractEndDate).toISOString().split("T")[0]
            : "",
          rentAmount: landlord.rentAmount
            ? (landlord.rentAmount / 100).toString()
            : "",
          paymentStatus: landlord.paymentStatus as any,
          notes: landlord.notes || "",
        }
      : {
          paymentStatus: "pending",
        },
  });

  const onSubmit = async (data: LandlordFormData) => {
    try {
      const payload = {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        company: data.company || undefined,
        rentalSite: data.rentalSite || undefined,
        contractStartDate: data.contractStartDate
          ? new Date(data.contractStartDate)
          : undefined,
        contractEndDate: data.contractEndDate
          ? new Date(data.contractEndDate)
          : undefined,
        rentAmount: data.rentAmount
          ? Math.round(parseFloat(data.rentAmount) * 100)
          : undefined,
        paymentStatus: data.paymentStatus,
        notes: data.notes || undefined,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({
          id: parseInt(params.id),
          data: payload,
        });
        toast.success("Landlord updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Landlord created successfully");
      }

      utils.landlords.list.invalidate();
      setLocation("/landlords");
    } catch (error) {
      toast.error(isEdit ? "Failed to update landlord" : "Failed to create landlord");
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
          <Link href="/landlords">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Landlords
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Landlord" : "Add New Landlord"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit
              ? "Update landlord information and contract details"
              : "Enter landlord information and contract details"}
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Contact details and company information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  placeholder="John Smith"
                  {...register("name", { required: true })}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">Name is required</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1-555-0123"
                    {...register("phone")}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  placeholder="Smith Properties LLC"
                  {...register("company")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="rentalSite">Rental Site/Location</Label>
                <Input
                  id="rentalSite"
                  placeholder="Downtown billboard location"
                  {...register("rentalSite")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contract Details */}
          <Card>
            <CardHeader>
              <CardTitle>Contract Details</CardTitle>
              <CardDescription>
                Contract period and payment information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contractStartDate">Contract Start Date</Label>
                  <Input
                    id="contractStartDate"
                    type="date"
                    {...register("contractStartDate")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contractEndDate">Contract End Date</Label>
                  <Input
                    id="contractEndDate"
                    type="date"
                    {...register("contractEndDate")}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rentAmount">Monthly Rent ($)</Label>
                  <Input
                    id="rentAmount"
                    type="number"
                    step="0.01"
                    placeholder="2500.00"
                    {...register("rentAmount")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Payment Status</Label>
                  <Select
                    value={watch("paymentStatus")}
                    onValueChange={(value) =>
                      setValue("paymentStatus", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Additional notes or special terms"
                  {...register("notes")}
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <Link href="/landlords">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Landlord" : "Create Landlord"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
