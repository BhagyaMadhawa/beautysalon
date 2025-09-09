/**
 * Utility functions for handling image URLs
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

// Hardcoded Vercel Blob storage URL for production
const VERCEL_BLOB_BASE = "https://blob.vercel-storage.com/profiles/";
/**
 * Constructs a full URL for an image from a relative path
 * @param {string} imagePath - The relative image path (e.g., "/uploads/image_12345.png")
 * @returns {string} The full URL to the image
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return null;

  // // If the image path is already a full URL, return it as is
  // if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
  //   return imagePath;
  // }

  // // For production (Vercel), use hardcoded blob storage URL
  // if (import.meta.env.PROD || import.meta.env.VITE_NODE_ENV === 'production') {
  //   return `${VERCEL_BLOB_BASE}${imagePath}`;
  // }

  // For local development, use API base URL
  return imagePath;
};

/**
 * Checks if an image URL is valid and accessible
 * @param {string} url - The image URL to check
 * @returns {Promise<boolean>} True if the image is accessible, false otherwise
 */
export const isImageAccessible = async (url) => {
  if (!url) return false;
  
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Gets a fallback image URL for when the profile image is not available
 * @returns {string} URL to a fallback/default profile image
 */
export const getFallbackProfileImage = () => {
  return "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100";
};
