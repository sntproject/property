/**
 * PropertyPro - Company Info Utility
 * Fetch company information from display settings for invoices and documents
 */

import { InvoiceCompanyInfo } from "@/lib/invoice/invoice-shared";

export interface CompanyInfo extends InvoiceCompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
}

/**
 * Fetch company information from display settings (client-side)
 */
export async function getCompanyInfo(): Promise<CompanyInfo | null> {
  try {
    // Fetch display settings for branding info
    const displayResponse = await fetch("/api/settings/display");
    if (!displayResponse.ok) {
      console.error("Failed to fetch display settings");
      return null;
    }

    const displayData = await displayResponse.json();
    const displaySettings =
      displayData?.data?.settings || displayData?.settings;

    // Fetch profile settings for contact info
    const profileResponse = await fetch("/api/settings/profile");
    const profileData = await profileResponse.json();
    const profileSettings =
      profileData?.data?.settings || profileData?.settings;

    if (!displaySettings?.branding) {
      return null;
    }

    const { companyName, companyAddress } = displaySettings.branding;

    if (!companyName && !companyAddress) {
      return null;
    }

    return {
      name: companyName || "PropertyPro",
      address: companyAddress || "",
      phone: profileSettings?.phone || "",
      email: profileSettings?.email || "",
      website: profileSettings?.website || "",
      logo:
        displaySettings.branding.favicon || displaySettings.branding.logoLight,
    };
  } catch (error) {
    console.error("Error fetching company info:", error);
    return null;
  }
}

/**
 * Fetch company information from display settings (server-side)
 */
export async function getCompanyInfoServer(): Promise<CompanyInfo | null> {
  try {
    const { default: DisplaySettings } = await import(
      "@/models/DisplaySettings"
    );
    const { default: ProfileSettings } = await import(
      "@/models/ProfileSettings"
    );
    const { default: User } = await import("@/models/User");
    const { UserRole } = await import("@/types");

    // Find admin user
    const admin = await User.findOne({
      role: UserRole.ADMIN,
      isActive: true,
    })
      .select("_id")
      .lean();

    if (!admin?._id) {
      return null;
    }

    const adminId = admin._id.toString();

    // Get display settings for admin (branding info)
    const displaySettings = await DisplaySettings.findByUserId(adminId);

    // Get profile settings for admin (contact info)
    const profileSettings = await ProfileSettings.findOne({
      userId: adminId,
    }).lean();

    if (!displaySettings?.branding) {
      return null;
    }

    const { companyName, companyAddress } = displaySettings.branding;

    if (!companyName && !companyAddress) {
      return null;
    }

    return {
      name: companyName || "PropertyPro",
      address: companyAddress || "",
      phone: profileSettings?.phone || "",
      email: profileSettings?.email || "",
      website: profileSettings?.website || "",
      logo:
        displaySettings.branding.favicon || displaySettings.branding.logoLight,
    };
  } catch (error) {
    console.error("Error fetching company info (server):", error);
    return null;
  }
}

/**
 * Get default company info (fallback)
 */
export function getDefaultCompanyInfo(): CompanyInfo {
  return {
    name: "PropertyPro",
    address: "",
    phone: "",
    email: "",
    website: "",
    logo: "/images/logo-light.png",
  };
}
