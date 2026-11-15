import type { ProductItem } from '@/data/products';

/** Keep gallery order, ignoring empty entries and supporting legacy single-image products. */
export function getProductImages(product: Pick<ProductItem, 'images' | 'imageUrl'>): string[] {
  const images = (product.images ?? []).filter(
    (image): image is string => typeof image === 'string' && image.trim().length > 0,
  );
  if (images.length > 0) return images;
  return product.imageUrl?.trim() ? [product.imageUrl] : [];
}
