import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      // Navigation
      dashboard: "Dashboard",
      adLocations: "Ad Locations",
      mapOverview: "Map Overview",
      landlords: "Landlords",
      clients: "Clients",
      structures: "Structures",
      
      // Common
      save: "Save",
      cancel: "Cancel",
      edit: "Edit",
      delete: "Delete",
      create: "Create",
      search: "Search",
      filter: "Filter",
      export: "Export",
      download: "Download",
      upload: "Upload",
      back: "Back",
      next: "Next",
      previous: "Previous",
      loading: "Loading...",
      noData: "No data available",
      signIn: "Sign in",
      signOut: "Sign out",
      pleaseSignIn: "Please sign in to continue",
      
      // Dashboard
      dashboardOverview: "Overview of your ad locations management platform",
      activeAdvertisingSpaces: "Active advertising spaces",
      readyForRental: "Ready for rental",
      propertyOwners: "Property owners",
      currentRenters: "Current renters",
      underMaintenance: "Under maintenance",
      totalRentalIncome: "Total rental income",
      currentOccupancy: "Current occupancy",
      
      manageOutdoorAdvertisingSpaces: "Manage your outdoor advertising spaces",
      managePropertyOwnersAndContracts: "Manage property owners and contracts",
      manageClientRentalsAndAccounts: "Manage client rentals and accounts",
      
      exportCsv: "Export CSV",
      exportPdf: "Export PDF",
      viewDetails: "View Details",
      addLandlord: "Add Landlord",
      editLandlord: "Edit Landlord",
      addClient: "Add Client",
      editClient: "Edit Client",
      
      searchByTitleAddressType: "Search by title, address, or type...",
      searchByNameEmailCompany: "Search by name, email, or company...",
      
      price: "Price",
      monthlyRent: "Monthly Rent",
      rentAmount: "Rent Amount",
      
      noLocationsFound: "No locations found",
      noLandlordsFound: "No landlords found",
      noClientsFound: "No clients found",
      tryAdjustingSearch: "Try adjusting your search terms",
      getStartedAddFirstAdLocation: "Get started by adding your first ad location",
      getStartedAddFirstLandlord: "Get started by adding your first landlord",
      getStartedAddFirstClient: "Get started by adding your first client",
      
      suspended: "Suspended",
      
      addStructure: "Add Structure",
      editStructure: "Edit Structure",
      trackMaintenanceLicenses: "Track maintenance and licenses for ad structures",
      searchByLocationStatus: "Search by location or status...",
      noStructuresFound: "No structures found",
      getStartedAddFirstStructure: "Get started by adding your first structure",
      lastMaintenance: "Last Maintenance",
      nextMaintenance: "Next Maintenance",
      licenseExpires: "License Expires",
      unknownLocation: "Unknown Location",
      
      viewAllLocationsMap: "View all ad locations on an interactive map",
      legend: "Legend",
      locationsWithCoordinates: "locations with coordinates",
      mapConfigurationMissing: "Map configuration is missing. Please set up Mapbox credentials.",
      noLocationsWithCoordinates: "No locations with coordinates available",
      addCoordinatesToLocations: "Add coordinates to your ad locations to see them on the map",
      
      // Dashboard
      totalAdLocations: "Total Ad Locations",
      availableLocations: "Available Locations",
      totalLandlords: "Total Landlords",
      activeClients: "Active Clients",
      monthlyRevenue: "Monthly Revenue",
      occupancyRate: "Occupancy Rate",
      paymentStatus: "Payment Status",
      maintenanceStatus: "Maintenance Status",
      revenueTrends: "Revenue Trends (Last 6 Months)",
      occupancyDistribution: "Occupancy Distribution",
      upcomingExpirations: "Upcoming Expirations",
      
      // Ad Locations
      addLocation: "Add Location",
      editLocation: "Edit Location",
      locationTitle: "Location Title",
      address: "Address",
      type: "Type",
      dimensions: "Dimensions",
      material: "Material",
      hasVinyl: "Has Vinyl",
      priceEstimate: "Price Estimate",
      status: "Status",
      notes: "Notes",
      photos: "Photos",
      coordinates: "Coordinates",
      latitude: "Latitude",
      longitude: "Longitude",
      
      // Status
      available: "Available",
      occupied: "Occupied",
      maintenance: "Maintenance",
      pending: "Pending",
      active: "Active",
      inactive: "Inactive",
      
      // Types
      billboard: "Billboard",
      poster: "Poster",
      digital: "Digital",
      transit: "Transit",
      streetFurniture: "Street Furniture",
      other: "Other",
      
      // Payment
      paid: "Paid",
      overdue: "Overdue",
      
      // Maintenance
      good: "Good",
      needsAttention: "Needs Attention",
      critical: "Critical",
      
      // AI Features
      aiAnalysis: "AI Analysis",
      aiAssistant: "AI Assistant",
      analyzeLocation: "Analyze Location",
      analyzing: "Analyzing...",
      visibilityAssessment: "Visibility Assessment",
      condition: "Condition",
      estimatedValue: "Estimated Value",
      recommendations: "Recommendations",
      
      // Currency
      currency: "Currency",
      selectCurrency: "Select Currency",
      
      // Language
      language: "Language",
      english: "English",
      spanish: "Spanish (Mexico)",
      
      // Messages
      success: "Success",
      error: "Error",
      confirmDelete: "Are you sure you want to delete this item?",
      deleteSuccess: "Item deleted successfully",
      saveSuccess: "Changes saved successfully",
      uploadSuccess: "Upload successful",
    },
  },
  es: {
    translation: {
      // Navigation
      dashboard: "Panel de Control",
      adLocations: "Ubicaciones de Anuncios",
      mapOverview: "Vista del Mapa",
      landlords: "Propietarios",
      clients: "Clientes",
      structures: "Estructuras",
      
      // Common
      save: "Guardar",
      cancel: "Cancelar",
      edit: "Editar",
      delete: "Eliminar",
      create: "Crear",
      search: "Buscar",
      filter: "Filtrar",
      export: "Exportar",
      download: "Descargar",
      upload: "Subir",
      back: "Atrás",
      next: "Siguiente",
      previous: "Anterior",
      loading: "Cargando...",
      noData: "No hay datos disponibles",
      signIn: "Iniciar sesión",
      signOut: "Cerrar sesión",
      pleaseSignIn: "Por favor inicie sesión para continuar",
      
      // Dashboard
      dashboardOverview: "Resumen de su plataforma de gestión de ubicaciones publicitarias",
      activeAdvertisingSpaces: "Espacios publicitarios activos",
      readyForRental: "Listo para alquilar",
      propertyOwners: "Propietarios de inmuebles",
      currentRenters: "Arrendatarios actuales",
      underMaintenance: "En mantenimiento",
      totalRentalIncome: "Ingresos totales por alquiler",
      currentOccupancy: "Ocupación actual",
      
      manageOutdoorAdvertisingSpaces: "Gestione sus espacios publicitarios exteriores",
      managePropertyOwnersAndContracts: "Gestione propietarios y contratos",
      manageClientRentalsAndAccounts: "Gestione alquileres y cuentas de clientes",
      
      exportCsv: "Exportar CSV",
      exportPdf: "Exportar PDF",
      viewDetails: "Ver Detalles",
      addLandlord: "Agregar Propietario",
      editLandlord: "Editar Propietario",
      addClient: "Agregar Cliente",
      editClient: "Editar Cliente",
      
      searchByTitleAddressType: "Buscar por título, dirección o tipo...",
      searchByNameEmailCompany: "Buscar por nombre, correo o empresa...",
      
      price: "Precio",
      monthlyRent: "Renta Mensual",
      rentAmount: "Monto de Renta",
      
      noLocationsFound: "No se encontraron ubicaciones",
      noLandlordsFound: "No se encontraron propietarios",
      noClientsFound: "No se encontraron clientes",
      tryAdjustingSearch: "Intente ajustar sus términos de búsqueda",
      getStartedAddFirstAdLocation: "Comience agregando su primera ubicación publicitaria",
      getStartedAddFirstLandlord: "Comience agregando su primer propietario",
      getStartedAddFirstClient: "Comience agregando su primer cliente",
      
      suspended: "Suspendido",
      
      addStructure: "Agregar Estructura",
      editStructure: "Editar Estructura",
      trackMaintenanceLicenses: "Seguimiento de mantenimiento y licencias para estructuras publicitarias",
      searchByLocationStatus: "Buscar por ubicación o estado...",
      noStructuresFound: "No se encontraron estructuras",
      getStartedAddFirstStructure: "Comience agregando su primera estructura",
      lastMaintenance: "Último Mantenimiento",
      nextMaintenance: "Próximo Mantenimiento",
      licenseExpires: "Vencimiento de Licencia",
      unknownLocation: "Ubicación Desconocida",
      
      viewAllLocationsMap: "Ver todas las ubicaciones publicitarias en un mapa interactivo",
      legend: "Leyenda",
      locationsWithCoordinates: "ubicaciones con coordenadas",
      mapConfigurationMissing: "Falta la configuración del mapa. Por favor configure las credenciales de Mapbox.",
      noLocationsWithCoordinates: "No hay ubicaciones con coordenadas disponibles",
      addCoordinatesToLocations: "Agregue coordenadas a sus ubicaciones publicitarias para verlas en el mapa",
      
      // Dashboard
      totalAdLocations: "Total de Ubicaciones",
      availableLocations: "Ubicaciones Disponibles",
      totalLandlords: "Total de Propietarios",
      activeClients: "Clientes Activos",
      monthlyRevenue: "Ingresos Mensuales",
      occupancyRate: "Tasa de Ocupación",
      paymentStatus: "Estado de Pagos",
      maintenanceStatus: "Estado de Mantenimiento",
      revenueTrends: "Tendencias de Ingresos (Últimos 6 Meses)",
      occupancyDistribution: "Distribución de Ocupación",
      upcomingExpirations: "Próximos Vencimientos",
      
      // Ad Locations
      addLocation: "Agregar Ubicación",
      editLocation: "Editar Ubicación",
      locationTitle: "Título de Ubicación",
      address: "Dirección",
      type: "Tipo",
      dimensions: "Dimensiones",
      material: "Material",
      hasVinyl: "Tiene Vinilo",
      priceEstimate: "Estimación de Precio",
      status: "Estado",
      notes: "Notas",
      photos: "Fotos",
      coordinates: "Coordenadas",
      latitude: "Latitud",
      longitude: "Longitud",
      
      // Status
      available: "Disponible",
      occupied: "Ocupado",
      maintenance: "Mantenimiento",
      pending: "Pendiente",
      active: "Activo",
      inactive: "Inactivo",
      
      // Types
      billboard: "Espectacular",
      poster: "Cartel",
      digital: "Digital",
      transit: "Tránsito",
      streetFurniture: "Mobiliario Urbano",
      other: "Otro",
      
      // Payment
      paid: "Pagado",
      overdue: "Vencido",
      
      // Maintenance
      good: "Bueno",
      needsAttention: "Necesita Atención",
      critical: "Crítico",
      
      // AI Features
      aiAnalysis: "Análisis IA",
      aiAssistant: "Asistente IA",
      analyzeLocation: "Analizar Ubicación",
      analyzing: "Analizando...",
      visibilityAssessment: "Evaluación de Visibilidad",
      condition: "Condición",
      estimatedValue: "Valor Estimado",
      recommendations: "Recomendaciones",
      
      // Currency
      currency: "Moneda",
      selectCurrency: "Seleccionar Moneda",
      
      // Language
      language: "Idioma",
      english: "Inglés",
      spanish: "Español (México)",
      
      // Messages
      success: "Éxito",
      error: "Error",
      confirmDelete: "¿Está seguro de que desea eliminar este elemento?",
      deleteSuccess: "Elemento eliminado exitosamente",
      saveSuccess: "Cambios guardados exitosamente",
      uploadSuccess: "Carga exitosa",
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;
