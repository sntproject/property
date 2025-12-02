/**
 * PropertyPro - Image Utilities
 * Utility functions for safe image handling and validation
 */

/**
 * Safely get images array from property object
 * Handles undefined, null, and non-array cases
 */
export function getPropertyImages(property: any): string[] {
  // Handle completely undefined/null property
  if (!property || typeof property !== "object") {
    console.warn(
      "getPropertyImages: Invalid property object provided",
      property
    );
    return [];
  }

  const images = property.images;

  // Handle undefined or null images
  if (images === undefined || images === null) {
    return [];
  }

  // Handle non-array cases
  if (!Array.isArray(images)) {
    console.warn(
      "getPropertyImages: property.images is not an array",
      typeof images,
      images
    );
    return [];
  }

  // Filter out invalid image URLs and log any issues
  return images.filter((img, index): img is string => {
    if (typeof img !== "string") {
      console.warn(
        `getPropertyImages: Invalid image at index ${index}`,
        typeof img,
        img
      );
      return false;
    }
    if (img.trim().length === 0) {
      console.warn(`getPropertyImages: Empty image URL at index ${index}`);
      return false;
    }
    return true;
  });
}

/**
 * Get the featured image (first image) from property
 */
export function getFeaturedImage(property: any): string | null {
  const images = getPropertyImages(property);
  return images.length > 0 ? images[0] : null;
}

/**
 * Check if property has any valid images
 */
export function hasPropertyImages(property: any): boolean {
  return getPropertyImages(property).length > 0;
}

/**
 * Get image count for property
 */
export function getImageCount(property: any): number {
  return getPropertyImages(property).length;
}

/**
 * Validate image URL
 */
export function isValidImageUrl(url: string): boolean {
  if (!url || typeof url !== "string") return false;

  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Get placeholder image URL for properties without images
 */
export function getPlaceholderImage(): string {
  return "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop";
}

/**
 * Get image with fallback to placeholder
 */
export function getImageWithFallback(property: any, index: number = 0): string {
  const images = getPropertyImages(property);

  if (images.length > index && isValidImageUrl(images[index])) {
    return images[index];
  }

  return getPlaceholderImage();
}

/**
 * Safe image mapping function that handles errors gracefully
 */
export function mapPropertyImages<T>(
  property: any,
  mapFn: (imageUrl: string, index: number) => T
): T[] {
  const images = getPropertyImages(property);

  return images.map((imageUrl, index) => {
    try {
      return mapFn(imageUrl, index);
    } catch (error) {
      console.error(`Error mapping image at index ${index}:`, error);
      // Return a default/fallback value - this depends on what T is
      // For now, we'll throw to let the caller handle it
      throw error;
    }
  });
}

/**
 * Optimize image URL for different display sizes
 */
export function optimizeImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: "auto" | "webp" | "jpg" | "png";
  } = {}
): string {
  // Note: R2 doesn't support on-the-fly transformations
  // Images are pre-processed during upload using sharp
  // For now, we return the URL as-is
  // In production, you might want to use Cloudflare Images or implement a transformation API

  return url;
}

/**
 * Generate responsive image sizes for Next.js Image component
 */
export function getResponsiveSizes(
  breakpoints: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  } = {}
): string {
  const { mobile = "100vw", tablet = "50vw", desktop = "33vw" } = breakpoints;

  return `(max-width: 768px) ${mobile}, (max-width: 1200px) ${tablet}, ${desktop}`;
}
