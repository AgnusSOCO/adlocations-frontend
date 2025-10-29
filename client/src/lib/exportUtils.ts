import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Papa from "papaparse";

export interface AdLocation {
  id: number;
  title: string;
  address: string;
  type: string;
  availabilityStatus: string;
  dimensions?: string | null;
  priceEstimate?: number | null;
  hasVinyl: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Landlord {
  id: number;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  rentAmount?: number | null;
  paymentStatus?: string | null;
}

export interface Client {
  id: number;
  name: string;
  company?: string | null;
  email?: string | null;
  phone?: string | null;
  rentAmount?: number | null;
  accountStatus?: string | null;
}

export interface Structure {
  id: number;
  adLocationId: number;
  maintenanceStatus: string;
  lastInspectionDate?: Date | null;
  nextInspectionDate?: Date | null;
  technicianNotes?: string | null;
}

// Export Ad Locations to CSV
export function exportAdLocationsToCSV(data: AdLocation[]) {
  const csvData = data.map((ad) => ({
    ID: ad.id,
    Title: ad.title,
    Address: ad.address,
    Type: ad.type,
    Status: ad.availabilityStatus,
    Dimensions: ad.dimensions || "N/A",
    "Price Estimate": ad.priceEstimate ? `$${(ad.priceEstimate / 100).toFixed(2)}` : "N/A",
    "Has Vinyl": ad.hasVinyl ? "Yes" : "No",
    "Created At": new Date(ad.createdAt).toLocaleDateString(),
  }));

  const csv = Papa.unparse(csvData);
  downloadFile(csv, "ad-locations.csv", "text/csv");
}

// Export Landlords to CSV
export function exportLandlordsToCSV(data: Landlord[]) {
  const csvData = data.map((landlord) => ({
    ID: landlord.id,
    Name: landlord.name,
    Company: landlord.company || "N/A",
    Email: landlord.email || "N/A",
    Phone: landlord.phone || "N/A",
    "Rent Amount": landlord.rentAmount ? `$${(landlord.rentAmount / 100).toFixed(2)}` : "N/A",
    "Payment Status": landlord.paymentStatus || "N/A",
  }));

  const csv = Papa.unparse(csvData);
  downloadFile(csv, "landlords.csv", "text/csv");
}

// Export Clients to CSV
export function exportClientsToCSV(data: Client[]) {
  const csvData = data.map((client) => ({
    ID: client.id,
    Name: client.name,
    Company: client.company || "N/A",
    Email: client.email || "N/A",
    Phone: client.phone || "N/A",
    "Rent Amount": client.rentAmount ? `$${(client.rentAmount / 100).toFixed(2)}` : "N/A",
    "Account Status": client.accountStatus || "N/A",
  }));

  const csv = Papa.unparse(csvData);
  downloadFile(csv, "clients.csv", "text/csv");
}

// Export Ad Locations to PDF
export function exportAdLocationsToPDF(data: AdLocation[]) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.text("Ad Locations Report", 14, 20);

  // Metadata
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  doc.text(`Total Locations: ${data.length}`, 14, 34);

  // Table
  const tableData = data.map((ad) => [
    ad.id,
    ad.title,
    ad.address,
    ad.type,
    ad.availabilityStatus,
    ad.dimensions || "N/A",
    ad.priceEstimate ? `$${(ad.priceEstimate / 100).toFixed(2)}` : "N/A",
  ]);

  autoTable(doc, {
    head: [["ID", "Title", "Address", "Type", "Status", "Dimensions", "Price"]],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  });

  doc.save("ad-locations-report.pdf");
}

// Export Landlords to PDF
export function exportLandlordsToPDF(data: Landlord[]) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Landlords Report", 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  doc.text(`Total Landlords: ${data.length}`, 14, 34);

  const tableData = data.map((landlord) => [
    landlord.id,
    landlord.name,
    landlord.company || "N/A",
    landlord.email || "N/A",
    landlord.phone || "N/A",
    landlord.rentAmount ? `$${(landlord.rentAmount / 100).toFixed(2)}` : "N/A",
    landlord.paymentStatus || "N/A",
  ]);

  autoTable(doc, {
    head: [["ID", "Name", "Company", "Email", "Phone", "Rent Amount", "Payment Status"]],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  });

  doc.save("landlords-report.pdf");
}

// Export Clients to PDF
export function exportClientsToPDF(data: Client[]) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Clients Report", 14, 20);

  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);
  doc.text(`Total Clients: ${data.length}`, 14, 34);

  const tableData = data.map((client) => [
    client.id,
    client.name,
    client.company || "N/A",
    client.email || "N/A",
    client.phone || "N/A",
    client.rentAmount ? `$${(client.rentAmount / 100).toFixed(2)}` : "N/A",
    client.accountStatus || "N/A",
  ]);

  autoTable(doc, {
    head: [["ID", "Name", "Company", "Email", "Phone", "Rent Amount", "Account Status"]],
    body: tableData,
    startY: 40,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [66, 139, 202] },
  });

  doc.save("clients-report.pdf");
}

// Helper function to download file
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
