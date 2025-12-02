/**
 * PropertyPro - Email PDF Service
 * PDF invoice generation for email attachments using jsPDF
 */

import jsPDF from "jspdf";
import { ILease } from "@/types";
import {
  deriveCompanyInitials,
  fetchLogoAsDataUrl,
} from "@/lib/invoice/logo-utils";

export interface EmailPDFOptions {
  lease: ILease;
  invoiceNumber?: string;
  issueDate?: Date;
  dueDate?: Date;
  companyInfo?: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website?: string;
    logo?: string;
  };
}

export interface EmailPDFResult {
  success: boolean;
  buffer?: Buffer;
  fileName?: string;
  error?: string;
}

const DEFAULT_COMPANY_INFO = {
  name: "PropertyPro Management",
  address: "123 Business Avenue, Suite 100",
  phone: "+1 (555) 123-4567",
  email: "info@PropertyPro.com",
  website: "www.PropertyPro.com",
};

/**
 * Generate a professional PDF invoice for server-side email attachments
 * Uses the same jsPDF implementation as the client-side for consistency
 */
export async function generateEmailPDF(
  options: EmailPDFOptions
): Promise<EmailPDFResult> {
  try {
    const {
      lease,
      invoiceNumber,
      issueDate = new Date(),
      dueDate,
      companyInfo = DEFAULT_COMPANY_INFO,
    } = options;

    // Generate invoice number if not provided
    const generatedInvoiceNumber =
      invoiceNumber ||
      `INV-${lease._id
        .toString()
        .slice(-8)
        .toUpperCase()}-${new Date().getFullYear()}`;

    // Create new PDF document
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    // Set font
    pdf.setFont("helvetica");

    // Colors
    const primaryColor = [116, 90, 242]; // Purple color from the design
    const textColor = [0, 0, 0];
    const grayColor = [128, 128, 128];

    const companyInitials = deriveCompanyInitials(companyInfo.name);
    let headerLogoRendered = false;
    if (companyInfo.logo) {
      const logoData = await fetchLogoAsDataUrl(companyInfo.logo);
      if (logoData.dataUrl && logoData.format) {
        try {
          pdf.addImage(logoData.dataUrl, logoData.format, 15, 15, 25, 25, undefined, "FAST");
          headerLogoRendered = true;
        } catch (error) {
          if (process.env.NODE_ENV !== "production") {
            console.warn("Failed to render company logo for email invoice", error);
          }
        }
      }
    }

    if (!headerLogoRendered) {
      pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      pdf.rect(15, 15, 25, 25, "F");
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(14);
      pdf.setFont(undefined, "bold");
      pdf.text(companyInitials, 27.5, 30, { align: "center" });
      pdf.setFont(undefined, "normal");
    }

    // Company Info
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(14);
    pdf.text(companyInfo.name, 45, 25);

    pdf.setFontSize(9);
    pdf.text(companyInfo.address, 45, 31);
    pdf.text(`Phone: ${companyInfo.phone}`, 45, 35);
    pdf.text(`Email: ${companyInfo.email}`, 45, 39);

    // Invoice Title and Number
    pdf.setFontSize(18);
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.text("LEASE INVOICE", 140, 25);

    pdf.setFontSize(10);
    pdf.text(`Invoice #: ${generatedInvoiceNumber}`, 140, 33);
    pdf.text(`Issue Date: ${issueDate.toLocaleDateString()}`, 140, 38);
    if (dueDate) {
      pdf.text(`Due Date: ${dueDate.toLocaleDateString()}`, 140, 43);
    }

    // Invoice From and To sections
    let yPos = 65;

    // Invoice From - properly sized background
    pdf.setFillColor(245, 245, 245);
    pdf.rect(15, yPos, 85, 40, "F"); // Increased height to 40
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(10);
    pdf.text("Invoice from", 20, yPos + 7);

    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(9);
    pdf.text(companyInfo.name, 20, yPos + 14);
    pdf.text(companyInfo.address, 20, yPos + 18);
    pdf.text(`Phone: ${companyInfo.phone}`, 20, yPos + 22);
    pdf.text(`Email: ${companyInfo.email}`, 20, yPos + 26);

    const tenant = lease.tenantId as any;
    const property = lease.propertyId as any;

    // First, calculate the required height for the content
    let maxContentHeight = 30; // Base height for basic content

    // Calculate additional height needed for address
    if (property && property.address) {
      if (typeof property.address === "string") {
        maxContentHeight = Math.max(maxContentHeight, 34);
      } else if (
        typeof property.address === "object" &&
        property.address !== null
      ) {
        const addr = property.address as any;
        let addressLines = 0;
        if (addr.street) addressLines++;
        if (addr.city || addr.state || addr.zipCode) addressLines++;
        if (addr.country) addressLines++;
        maxContentHeight = Math.max(maxContentHeight, 30 + addressLines * 4);
      }
    }

    // Now redraw the "Invoice to" background with the correct height
    pdf.setFillColor(245, 245, 245);
    pdf.rect(110, yPos, 85, maxContentHeight, "F");

    // Draw the header
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.setFontSize(10);
    pdf.text("Invoice to", 115, yPos + 7);

    // Draw all the tenant content
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(9);

    if (tenant) {
      pdf.text(`${tenant.firstName} ${tenant.lastName}`, 115, yPos + 14);
      if (tenant.email) {
        pdf.text(tenant.email, 115, yPos + 18);
      }
    }

    if (property) {
      pdf.text(property.name || "Property", 115, yPos + 22);
      if (property.address) {
        if (typeof property.address === "string") {
          pdf.text(property.address, 115, yPos + 26);
        } else if (
          typeof property.address === "object" &&
          property.address !== null
        ) {
          const addr = property.address as any;
          let currentY = yPos + 26;

          if (addr.street) {
            pdf.text(addr.street, 115, currentY);
            currentY += 4;
          }

          const cityStateZip = [addr.city, addr.state, addr.zipCode]
            .filter(Boolean)
            .join(", ");
          if (cityStateZip) {
            pdf.text(cityStateZip, 115, currentY);
            currentY += 4;
          }

          if (addr.country) {
            pdf.text(addr.country, 115, currentY);
          }
        }
      }
    }

    // Invoice Items Table - position after the content boxes
    yPos = yPos + Math.max(40, maxContentHeight) + 10;

    // Table Header
    pdf.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.rect(15, yPos, 180, 10, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text("#", 20, yPos + 7);
    pdf.text("Description", 30, yPos + 7);
    pdf.text("Qty", 120, yPos + 7);
    pdf.text("Unit Price", 140, yPos + 7);
    pdf.text("Total", 170, yPos + 7);

    yPos += 15;

    // Table Rows
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.setFontSize(9);
    let itemNumber = 1;

    // Monthly Rent
    if (lease.terms?.rentAmount) {
      pdf.text(itemNumber.toString(), 20, yPos);

      // Property name for rent description
      const propertyName = property?.name || "Property";
      pdf.text(`Monthly Rent - ${propertyName}`, 30, yPos);

      // Format lease period dates
      const startDate = lease.startDate
        ? new Date(lease.startDate).toLocaleDateString()
        : "Start Date";
      const endDate = lease.endDate
        ? new Date(lease.endDate).toLocaleDateString()
        : "End Date";
      pdf.text(`Lease period: ${startDate} - ${endDate}`, 30, yPos + 5);

      pdf.text("1", 120, yPos);
      pdf.text(`$${lease.terms.rentAmount.toFixed(2)}`, 140, yPos);
      pdf.text(`$${lease.terms.rentAmount.toFixed(2)}`, 170, yPos);
      yPos += 15;
      itemNumber++;
    }

    // Security Deposit
    if (lease.terms?.securityDeposit) {
      pdf.text(itemNumber.toString(), 20, yPos);
      pdf.text("Security Deposit", 30, yPos);
      pdf.text("Refundable security deposit", 30, yPos + 5);
      pdf.text("1", 120, yPos);
      pdf.text(`$${lease.terms.securityDeposit.toFixed(2)}`, 140, yPos);
      pdf.text(`$${lease.terms.securityDeposit.toFixed(2)}`, 170, yPos);
      yPos += 15;
    }

    // Totals section
    yPos += 10;
    const total =
      (lease.terms?.rentAmount || 0) + (lease.terms?.securityDeposit || 0);

    pdf.text("Subtotal:", 140, yPos);
    pdf.text(`$${total.toFixed(2)}`, 170, yPos);
    yPos += 8;

    pdf.text("Shipping:", 140, yPos);
    pdf.text("$0.00", 170, yPos);
    yPos += 8;

    pdf.text("Discount:", 140, yPos);
    pdf.text("$0.00", 170, yPos);
    yPos += 8;

    pdf.text("Tax:", 140, yPos);
    pdf.text("$0.00", 170, yPos);
    yPos += 12;

    // Final Total
    pdf.setFontSize(12);
    pdf.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    pdf.text("Total:", 140, yPos);
    pdf.text(`$${total.toFixed(2)}`, 170, yPos);

    // Question section
    yPos += 20;
    pdf.setFillColor(255, 248, 220); // Light yellow background
    pdf.rect(15, yPos, 180, 20, "F");

    pdf.setTextColor(200, 150, 0);
    pdf.setFontSize(10);
    pdf.text("Have a question?", 20, yPos + 8);
    pdf.setTextColor(textColor[0], textColor[1], textColor[2]);
    pdf.text(
      "We appreciate your business. Should you need us to add VAT or extra notes let us know!",
      20,
      yPos + 15
    );

    // Footer
    yPos += 35;
    pdf.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
    pdf.setFontSize(8);
    pdf.text(
      "This invoice was generated by PropertyPro Property Management System",
      70,
      yPos
    );
    pdf.text("© 2025 PropertyPro. All rights reserved.", 85, yPos + 5);

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));
    const fileName = `lease_invoice_${generatedInvoiceNumber.replace(
      /[^a-zA-Z0-9]/g,
      "_"
    )}.pdf`;

    return {
      success: true,
      buffer: pdfBuffer,
      fileName,
    };
  } catch (error) {
    console.error("Error generating email PDF:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate PDF",
    };
  }
}
