/**
 * Utility functions for Google Drive images & files integration.
 * Converts Google Drive sharing links or file IDs into direct high-performance thumbnail/preview URLs
 * that can be embedded directly in standard <img> tags without CORS/authentication blocks.
 */

export function extractGoogleDriveFileId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();

  // Pattern 1: /file/d/ID/
  const matchFileD = trimmed.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (matchFileD && matchFileD[1]) return matchFileD[1];

  // Pattern 2: id=ID or id%3D...
  const matchIdParam = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/i);
  if (matchIdParam && matchIdParam[1]) return matchIdParam[1];

  // Pattern 3: open?id=ID
  const matchOpenId = trimmed.match(/\/open\?id=([a-zA-Z0-9_-]+)/i);
  if (matchOpenId && matchOpenId[1]) return matchOpenId[1];

  // Pattern 4: Raw file ID (alphanumeric, length >= 20)
  if (/^[a-zA-Z0-9_-]{20,}$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

export function formatGoogleDriveImageUrl(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();

  // If it's already a direct data URL or standard non-drive URL
  if (trimmed.startsWith('data:') || trimmed.startsWith('blob:')) {
    return trimmed;
  }

  const driveId = extractGoogleDriveFileId(trimmed);
  if (driveId) {
    // High-resolution direct preview via Google Thumbnail CDN (supports public Google Drive files)
    return `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200`;
  }

  return trimmed;
}

export function getGoogleDriveViewLink(input: string): string | null {
  const driveId = extractGoogleDriveFileId(input);
  if (driveId) {
    return `https://drive.google.com/file/d/${driveId}/view?usp=sharing`;
  }
  return null;
}
