import type jsPDF from "jspdf";
import {
  NormalizedInvoice,
  InvoiceLineItemInfo,
} from "@/lib/invoice/invoice-shared";
import {
  deriveCompanyInitials,
  fetchLogoAsDataUrl,
} from "@/lib/invoice/logo-utils";

export interface InvoicePdfRenderOptions {
  includeNotes?: boolean;
}

function isApproximatelyZero(value: number): boolean {
  return Math.abs(value) < 1e-6;
}

function formatCurrency(amount: number, formatter: Intl.NumberFormat): string {
  const normalized = isApproximatelyZero(amount) ? 0 : amount;
  return formatter.format(normalized);
}

function renderPartySection(
  pdf: jsPDF,
  x: number,
  y: number,
  title: string,
  lines: string[]
) {
  pdf.setTextColor(107, 114, 128);
  pdf.setFontSize(10);
  pdf.text(title, x, y + 6);

  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(9);

  let currentY = y + 13;
  lines.filter(Boolean).forEach((line) => {
    pdf.text(line, x, currentY);
    currentY += 4;
  });
}

export async function renderInvoicePdf(
  pdf: jsPDF,
  normalized: NormalizedInvoice,
  options: InvoicePdfRenderOptions = {}
): Promise<jsPDF> {
  const includeNotes = options.includeNotes ?? true;

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  // Company details
  const company = normalized.companyInfo;
  const companyInitials = deriveCompanyInitials(company.name);

  let logoRendered = false;
  if (company.logo) {
    const logoData = await fetchLogoAsDataUrl(company.logo);
    if (logoData.dataUrl && logoData.format) {
      try {
        pdf.addImage(logoData.dataUrl, logoData.format, 15, 15, 18, 18, undefined, "FAST");
        logoRendered = true;
      } catch (error) {
        if (process.env.NODE_ENV !== "production") {
          console.warn("Failed to render company logo in PDF", error);
        }
      }
    }
  }

  if (!logoRendered) {
    pdf.setFillColor(16, 185, 129);
    pdf.rect(15, 15, 18, 18, "F");
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(11);
    pdf.setFont(undefined, "bold");
    pdf.text(companyInitials, 24, 25, { align: "center" });
    pdf.setFont(undefined, "normal");
  }

  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(14);
  pdf.text(company.name, 34, 20);
  pdf.setFontSize(9);
  pdf.setTextColor(107, 114, 128);
  pdf.text(company.address, 34, 25);
  pdf.text(company.phone, 34, 29);
  pdf.text(company.email, 34, 33);
  if (company.website) {
    pdf.text(company.website, 34, 37);
  }

  // Status under company info
  pdf.text(normalized.statusMeta.label, 34, 41);

  // Invoice meta
  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(18);
  pdf.text("LEASE INVOICE", 140, 20);
  pdf.setFontSize(10);
  pdf.setTextColor(107, 114, 128);
  pdf.text(
    String(normalized.invoiceNumber || normalized._id || "Invoice"),
    140,
    26
  );
  pdf.text(
    `Issue Date: ${normalized.issueDate.toLocaleDateString()}`,
    140,
    31
  );
  pdf.text(`Due Date: ${normalized.dueDate.toLocaleDateString()}`, 140, 36);

  pdf.setFillColor(...normalized.statusMeta.pdfFillColor);
  pdf.roundedRect(140, 40, 30, 8, 2, 2, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text(normalized.statusMeta.label.toUpperCase(), 155, 46, {
    align: "center",
  });

  // Parties panels
  renderPartySection(pdf, 15, 58, "Invoice from", [
    company.name,
    company.address,
    company.phone,
    company.email,
  ]);

  const tenant = normalized.tenantId || {};
  const property = normalized.propertyId || {};

  const tenantLines: string[] = [];
  const tenantName =
    [tenant.firstName, tenant.lastName].filter(Boolean).join(" ") || tenant.name;
  if (tenantName) tenantLines.push(String(tenantName));

  const propertyName = property.name ? String(property.name) : "";
  if (propertyName) tenantLines.push(propertyName);

  if (property.address) {
    if (typeof property.address === "string") {
      tenantLines.push(property.address);
    } else {
      const addr = property.address;
      const cityStateZip = [addr.city, addr.state, addr.zipCode]
        .filter(Boolean)
        .join(", ");
      tenantLines.push(
        [addr.street, cityStateZip, addr.country].filter(Boolean).join("\n")
      );
    }
  }

  if (tenant.email) tenantLines.push(String(tenant.email));
  if (tenant.phone) tenantLines.push(String(tenant.phone));

  renderPartySection(pdf, 110, 58, "Invoice to", tenantLines);

  // Items table header
  let y = 98;
  pdf.setFillColor(243, 244, 246);
  pdf.rect(15, y, 180, 10, "F");
  pdf.setDrawColor(229, 231, 235);
  pdf.rect(15, y, 180, 10);
  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(10);
  pdf.text("#", 18, y + 7);
  pdf.text("Description", 28, y + 7);
  pdf.text("Qty", 120, y + 7);
  pdf.text("Unit price", 140, y + 7);
  pdf.text("Total", 170, y + 7);

  const items = Array.isArray(normalized.lineItems)
    ? (normalized.lineItems as InvoiceLineItemInfo[])
    : [];
  y += 15;
  pdf.setTextColor(17, 24, 39);
  pdf.setFontSize(9);

  if (items.length === 0) {
    pdf.text("No line items available", 28, y);
    y += 8;
  } else {
    items.forEach((item, index) => {
      const qty = Number(item.quantity ?? 1) || 1;
      const unit = Number(item.unitPrice ?? 0);
      const total = Number(item.total ?? item.amount ?? qty * unit);

      pdf.text(String(index + 1), 18, y);
      pdf.text(String(item.description || "Item"), 28, y);
      pdf.text(String(qty), 120, y);
      pdf.text(formatCurrency(unit, currencyFormatter), 140, y);
      pdf.text(formatCurrency(total, currencyFormatter), 170, y);

      pdf.setDrawColor(229, 231, 235);
      pdf.line(15, y + 3, 195, y + 3);
      y += 8;
    });
  }

  // Totals section
  y += 6;
  const {
    totals: {
      subtotal,
      taxAmount,
      discountAmount,
      shippingAmount,
      adjustmentsAmount,
      total,
      amountPaid,
      balanceDue,
    },
  } = normalized;

  pdf.setFontSize(10);
  const totalsLabelX = 140;
  const totalsValueX = 190;
  pdf.text("Subtotal", totalsLabelX, y);
  pdf.text(formatCurrency(subtotal, currencyFormatter), totalsValueX, y, {
    align: "right",
  });
  y += 6;
  pdf.text("Shipping", totalsLabelX, y);
  pdf.text(formatCurrency(shippingAmount, currencyFormatter), totalsValueX, y, {
    align: "right",
  });
  y += 6;
  pdf.text("Discount", totalsLabelX, y);
  const discountDisplay = discountAmount === 0 ? 0 : -Math.abs(discountAmount);
  pdf.text(formatCurrency(discountDisplay, currencyFormatter), totalsValueX, y, {
    align: "right",
  });
  y += 6;
  if (!isApproximatelyZero(adjustmentsAmount)) {
    pdf.text("Adjustments", totalsLabelX, y);
    pdf.text(
      formatCurrency(adjustmentsAmount, currencyFormatter),
      totalsValueX,
      y,
      {
        align: "right",
      }
    );
    y += 6;
  }
  pdf.text("Taxes", totalsLabelX, y);
  pdf.text(formatCurrency(taxAmount, currencyFormatter), totalsValueX, y, {
    align: "right",
  });
  y += 8;
  pdf.setFontSize(12);
  pdf.setTextColor(17, 24, 39);
  pdf.text("Total", totalsLabelX, y);
  pdf.text(formatCurrency(total, currencyFormatter), totalsValueX, y, {
    align: "right",
  });

  y += 6;
  pdf.setFontSize(10);
  pdf.text("Amount Paid", totalsLabelX, y);
  pdf.text(formatCurrency(amountPaid, currencyFormatter), totalsValueX, y, {
    align: "right",
  });
  y += 6;
  pdf.text("Balance Due", totalsLabelX, y);
  pdf.text(formatCurrency(balanceDue, currencyFormatter), totalsValueX, y, {
    align: "right",
  });

  if (includeNotes) {
    const notesY = 250;
    pdf.setTextColor(17, 24, 39);
    pdf.setFontSize(10);
    pdf.setDrawColor(229, 231, 235);
    pdf.line(15, notesY, 195, notesY);
    pdf.text("NOTES", 15, notesY + 10);
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text(normalized.notes, 15, notesY + 16, { maxWidth: 120 });
    pdf.setFontSize(10);
    pdf.setTextColor(17, 24, 39);
    pdf.text("Have a question?", 150, notesY + 10);
    pdf.setFontSize(9);
    pdf.setTextColor(107, 114, 128);
    pdf.text(company.email, 150, notesY + 16);
  }

  // Footer
  pdf.setTextColor(128, 128, 128);
  pdf.setFontSize(8);
  pdf.text(
    "This invoice was generated by PropertyPro Property Management System",
    35,
    285
  );

  return pdf;
}
