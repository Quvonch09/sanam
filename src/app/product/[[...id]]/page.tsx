import { ProductDetailClient } from './ProductDetailClient';
import { initialProducts } from '@/data/products';
import { slugify } from '@/utils/slugify';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  const params: { id: string[] }[] = [
    { id: [] }, // /product
  ];

  initialProducts.forEach((p) => {
    params.push({ id: [p.id] });
    params.push({ id: [slugify(p.name)] });
  });

  return params;
}

export default function ProductDetailPage() {
  return <ProductDetailClient />;
}
