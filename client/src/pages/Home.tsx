import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { MapPin, Building2, Users, Wrench, ArrowRight } from "lucide-react";
import { APP_LOGO, APP_TITLE } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";

import { useTranslation } from "react-i18next";
export default function Home() {
  const { t } = useTranslation();
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      setLocation("/dashboard");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="container py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {APP_LOGO && <img src={APP_LOGO} alt={APP_TITLE} className="h-10 w-10" />}
            <span className="text-xl font-bold">{APP_TITLE}</span>
          </div>
          <Button onClick={() => setLocation("/login")}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
            Manage Your Ad Locations
            <span className="block text-primary mt-2">With Confidence</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline outdoor advertising space management with AI-powered insights,
            automated workflows, and comprehensive tracking.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button size="lg" onClick={() => setLocation("/login")}>
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-border">
            <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-semibold mb-2">Ad Locations</h3>
            <p className="text-sm text-muted-foreground">
              Track and manage all your advertising spaces with detailed information and maps.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-border">
            <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-semibold mb-2">Landlord Management</h3>
            <p className="text-sm text-muted-foreground">
              Maintain relationships with property owners and track contracts.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-border">
            <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center mb-4">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h3 className="font-semibold mb-2">Client Tracking</h3>
            <p className="text-sm text-muted-foreground">
              Monitor client rentals, payments, and account statuses in one place.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-border">
            <div className="h-12 w-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center mb-4">
              <Wrench className="h-6 w-6 text-red-600" />
            </div>
            <h3 className="font-semibold mb-2">Maintenance</h3>
            <p className="text-sm text-muted-foreground">
              Keep structures in top condition with scheduled maintenance tracking.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
