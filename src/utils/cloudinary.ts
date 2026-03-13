/**
 * Transforms a Cloudinary image URL to serve an optimized version:
 * - f_auto: serves WebP/AVIF instead of PNG/JPG (up to 10x smaller)
 * - q_auto:eco: aggressive quality optimization
 * - w_{width}: resize to actual display size
 *
 * Example: 321KB PNG → ~25KB WebP
 */
export function cloudinaryOptimize(url: string | undefined, width: number): string {
  if (!url || !url.includes('res.cloudinary.com')) return url ?? '';
  return url.replace('/upload/', `/upload/f_auto,q_auto:eco,w_${width}/`);
}
