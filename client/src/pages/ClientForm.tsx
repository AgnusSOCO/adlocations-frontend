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

type ClientFormData = {
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  address?: string;
  adRentedId?: string;
  rentalStartDate?: string;
  rentalEndDate?: string;
  rentAmount?: string;
  paymentStatus: "paid" | "pending" | "overdue";
  accountStatus: "active" | "inactive" | "suspended";
  assignedSalesRepId?: string;
  notes?: string;
};

export default function ClientForm() {
  const [, params] = useRoute("/clients/edit/:id");
  const [, setLocation] = useLocation();
  const isEdit = !!params?.id;

  const { data: client, isLoading } = trpc.clients.getById.useQuery(
    { id: parseInt(params?.id || "0") },
    { enabled: isEdit }
  );

  const createMutation = trpc.clients.create.useMutation();
  const updateMutation = trpc.clients.update.useMutation();
  const utils = trpc.useUtils();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ClientFormData>({
    defaultValues: client
      ? {
          name: client.name,
          email: client.email || "",
          phone: client.phone || "",
          company: client.company || "",
          adRentedId: client.adRentedId?.toString() || "",
          rentalStartDate: client.rentalStartDate
            ? new Date(client.rentalStartDate).toISOString().split("T")[0]
            : "",
          rentalEndDate: client.rentalEndDate
            ? new Date(client.rentalEndDate).toISOString().split("T")[0]
            : "",
          rentAmount: client.rentAmount
            ? (client.rentAmount / 100).toString()
            : "",
          paymentStatus: client.paymentStatus as any,
          accountStatus: client.accountStatus as any,
          assignedSalesRepId: client.assignedSalesRepId?.toString() || "",
          notes: client.notes || "",
        }
      : {
          paymentStatus: "pending",
          accountStatus: "active",
        },
  });

  const onSubmit = async (data: ClientFormData) => {
    try {
      const payload = {
        name: data.name,
        email: data.email || undefined,
        phone: data.phone || undefined,
        company: data.company || undefined,
        adRentedId: data.adRentedId ? parseInt(data.adRentedId) : undefined,
        rentalStartDate: data.rentalStartDate
          ? new Date(data.rentalStartDate)
          : undefined,
        rentalEndDate: data.rentalEndDate
          ? new Date(data.rentalEndDate)
          : undefined,
        rentAmount: data.rentAmount
          ? Math.round(parseFloat(data.rentAmount) * 100)
          : undefined,
        paymentStatus: data.paymentStatus,
        accountStatus: data.accountStatus,
        assignedSalesRepId: data.assignedSalesRepId
          ? parseInt(data.assignedSalesRepId)
          : undefined,
        notes: data.notes || undefined,
      };

      if (isEdit) {
        await updateMutation.mutateAsync({
          id: parseInt(params.id),
          data: payload,
        });
        toast.success("Client updated successfully");
      } else {
        await createMutation.mutateAsync(payload);
        toast.success("Client created successfully");
      }

      utils.clients.list.invalidate();
      setLocation("/clients");
    } catch (error) {
      toast.error(isEdit ? "Failed to update client" : "Failed to create client");
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
          <Link href="/clients">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clients
            </Button>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {isEdit ? "Edit Client" : "Add New Client"}
          </h1>
          <p className="text-muted-foreground mt-2">
            {isEdit
              ? "Update client information and rental details"
              : "Enter client information and rental details"}
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
                  placeholder="TechCorp Inc"
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
                    placeholder="contact@techcorp.com"
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
                  placeholder="TechCorp Inc"
                  {...register("company")}
                />
              </div>
            </CardContent>
          </Card>

          {/* Rental Details */}
          <Card>
            <CardHeader>
              <CardTitle>Rental Details</CardTitle>
              <CardDescription>
                Ad space rental and contract information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rentalStartDate">Rental Start Date</Label>
                  <Input
                    id="rentalStartDate"
                    type="date"
                    {...register("rentalStartDate")}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rentalEndDate">Rental End Date</Label>
                  <Input
                    id="rentalEndDate"
                    type="date"
                    {...register("rentalEndDate")}
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
                    placeholder="4500.00"
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
                <Label htmlFor="accountStatus">Account Status</Label>
                <Select
                  value={watch("accountStatus")}
                  onValueChange={(value) =>
                    setValue("accountStatus", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
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
            <Link href="/clients">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              {isEdit ? "Update Client" : "Create Client"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
