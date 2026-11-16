import { MetadataRoute } from 'next';
import { initialProducts } from '@/data/products';
import { barcodeProducts } from '@/data/barcodeProducts';
import { slugify } from '@/utils/slugify';

export const dynamic = 'force-static';


export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.sanamfactory.uz';

  const productUrls = initialProducts.map((p) => ({
    url: `${baseUrl}/product/${slugify(p.name)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));
  const barcodeUrls = barcodeProducts.map((product) => ({
    url: `${baseUrl}/01/0${product.gtin}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    ...productUrls,
    ...barcodeUrls,
  ];
}
