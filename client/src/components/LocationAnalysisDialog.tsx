import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Sparkles, Loader2, TrendingUp, Eye, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

import { useTranslation } from "react-i18next";
interface LocationAnalysisDialogProps {
  location: {
    id: number;
    title: string;
    address: string;
    type: string;
    dimensions?: string | null;
    photos?: string | null;
  };
}

export function LocationAnalysisDialog({ location }: LocationAnalysisDialogProps) {
  const [open, setOpen] = useState(false);
  const [analysis, setAnalysis] = useState<{
    visibility: string;
    condition: string;
    recommendations: string[];
    estimatedValue: string;
  } | null>(null);

  const analyzeMutation = trpc.deepseek.analyzeLocation.useMutation({
    onSuccess: (data) => {
      setAnalysis(data);
      toast.success(t("aiAnalysisComplete"));
    },
    onError: (error) => {
      toast.error(t("analysisFailed") + error.message);
    },
  });

  const handleAnalyze = () => {
    analyzeMutation.mutate({
      photoUrl: location.photos || "",
      title: location.title,
      address: location.address,
      type: location.type,
      dimensions: location.dimensions || undefined,
    });
  };

  const getVisibilityColor = (visibility: string) => {
    if (visibility.toLowerCase().includes("high")) return "text-green-600";
    if (visibility.toLowerCase().includes("medium")) return "text-yellow-600";
    return "text-red-600";
  };

  const getConditionColor = (condition: string) => {
    if (condition.toLowerCase().includes("excellent") || condition.toLowerCase().includes("good")) 
      return "text-green-600";
    if (condition.toLowerCase().includes("fair")) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Sparkles className="h-4 w-4" />
          AI Analysis
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            AI Location Analysis
          </DialogTitle>
          <DialogDescription>
            Get AI-powered insights about this advertising location
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {!analysis && !analyzeMutation.isPending && (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                Click the button below to analyze this location using AI
              </p>
              <Button onClick={handleAnalyze} className="gap-2">
                <Sparkles className="h-4 w-4" />
                Analyze Location
              </Button>
            </div>
          )}

          {analyzeMutation.isPending && (
            <div className="text-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary mb-4" />
              <p className="text-muted-foreground">
                Analyzing location with DeepSeek AI...
              </p>
            </div>
          )}

          {analysis && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      Visibility Assessment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold ${getVisibilityColor(analysis.visibility)}`}>
                      {analysis.visibility}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <AlertCircle className="h-4 w-4" />
                      Condition
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-2xl font-bold ${getConditionColor(analysis.condition)}`}>
                      {analysis.condition}
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Estimated Value
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-xl font-semibold text-primary">
                    {analysis.estimatedValue}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">
                    Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-sm">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Button
                onClick={handleAnalyze}
                variant="outline"
                className="w-full gap-2"
                disabled={analyzeMutation.isPending}
              >
                <Sparkles className="h-4 w-4" />
                Analyze Again
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
