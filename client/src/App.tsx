import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { useEffect } from "react";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import AdLocations from "./pages/AdLocations";
import AdLocationForm from "./pages/AdLocationForm";
import Landlords from "./pages/Landlords";
import Clients from "./pages/Clients";
import Structures from "./pages/Structures";
import AdLocationDetail from "./pages/AdLocationDetail";
import LandlordForm from "./pages/LandlordForm";
import ClientForm from "./pages/ClientForm";
import StructureForm from "./pages/StructureForm";
import MapOverview from "./pages/MapOverview";
import Login from "./pages/Login";

function Router() {
  return (
    <Switch>
      <Route path={"/login"} component={Login} />
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/ads"} component={AdLocations} />
      <Route path={"/ads/new"} component={AdLocationForm} />
      <Route path={"/ads/edit/:id"} component={AdLocationForm} />
      <Route path={"/ads/:id"} component={AdLocationDetail} />
      <Route path={"/landlords"} component={Landlords} />
      <Route path={"/landlords/new"} component={LandlordForm} />
      <Route path={"/landlords/edit/:id"} component={LandlordForm} />
      <Route path={"/clients"} component={Clients} />
      <Route path={"/clients/new"} component={ClientForm} />
      <Route path={"/clients/edit/:id"} component={ClientForm} />
      <Route path={"/structures"} component={Structures} />
      <Route path={"/structures/new"} component={StructureForm} />
      <Route path={"/structures/edit/:id"} component={StructureForm} />
      <Route path={"/map"} component={MapOverview} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  // Register service worker for offline support
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('Service Worker registered:', registration);
        })
        .catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <CurrencyProvider>
          <TooltipProvider>
            <OfflineIndicator />
            <Toaster />
            <Router />
          </TooltipProvider>
        </CurrencyProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
