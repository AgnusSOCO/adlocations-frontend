import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Camera, Upload, X } from "lucide-react";
import { toast } from "sonner";

interface PhotoDocumentationProps {
  structureId: number;
}

export function PhotoDocumentation({ structureId }: PhotoDocumentationProps) {
  const { t } = useTranslation();
  const [photoType, setPhotoType] = useState<"before" | "after" | "inspection" | "damage">("inspection");
  const [caption, setCaption] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const utils = trpc.useUtils();
  const { data: photos, isLoading } = trpc.photoDocumentation.list.useQuery({ structureId });
  const uploadMutation = trpc.photoDocumentation.upload.useMutation({
    onSuccess: () => {
      toast.success(t("uploadSuccess"));
      utils.photoDocumentation.list.invalidate();
      setSelectedFile(null);
      setPreviewUrl(null);
      setCaption("");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    try {
      // Upload to server
      const formData = new FormData();
      formData.append("file", selectedFile);
      
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) throw new Error("Upload failed");

      const { url } = await response.json();

      // Save to database
      await uploadMutation.mutateAsync({
        structureId,
        photoType,
        photoUrl: url,
        caption,
        takenAt: new Date(),
      });
    } catch (error) {
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Upload Photo Documentation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="photoType">Photo Type</Label>
              <Select value={photoType} onValueChange={(value: any) => setPhotoType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="before">Before</SelectItem>
                  <SelectItem value="after">After</SelectItem>
                  <SelectItem value="inspection">Inspection</SelectItem>
                  <SelectItem value="damage">Damage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="photo">Photo</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="flex-1"
                />
                {previewUrl && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            {previewUrl && (
              <div className="rounded-lg border overflow-hidden">
                <img src={previewUrl} alt="Preview" className="w-full h-64 object-cover" />
              </div>
            )}

            <div>
              <Label htmlFor="caption">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Add a description or notes about this photo..."
                rows={3}
              />
            </div>

            <Button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              className="w-full"
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Photo"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Photo History</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-muted-foreground">Loading photos...</p>
          ) : photos && photos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {photos.map((photo) => (
                <div key={photo.id} className="rounded-lg border overflow-hidden">
                  <img
                    src={photo.photoUrl}
                    alt={photo.caption || "Photo"}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium capitalize px-2 py-1 rounded-full bg-primary/10 text-primary">
                        {photo.photoType}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(photo.takenAt)}
                      </span>
                    </div>
                    {photo.caption && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {photo.caption}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              No photos uploaded yet
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
