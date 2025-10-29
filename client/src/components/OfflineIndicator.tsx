import { useOffline } from "@/hooks/useOffline";
import { useTranslation } from "react-i18next";
import { WifiOff } from "lucide-react";

export function OfflineIndicator() {
  const isOffline = useOffline();
  const { t } = useTranslation();

  if (!isOffline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-white px-4 py-2 flex items-center justify-center gap-2 shadow-lg">
      <WifiOff className="h-4 w-4" />
      <span className="text-sm font-medium">
        You are currently offline. Changes will be synced when connection is restored.
      </span>
    </div>
  );
}
