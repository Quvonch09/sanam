import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { barcodeProducts, findBarcodeProduct } from '@/data/barcodeProducts';

type PageProps = {
  params: Promise<{ gtin: string }>;
};

export const dynamic = 'force-static';
export const dynamicParams = false;

export function generateStaticParams() {
  return barcodeProducts.flatMap(({ gtin }) => [
    { gtin: `0${gtin}` }, // GS1 Digital Link requires GTIN values padded to 14 digits.
    { gtin }, // Keep a 13-digit path available for legacy integrations.
  ]);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { gtin } = await params;
  const product = findBarcodeProduct(gtin);
  return {
    title: product ? `${product.name} — ${product.size}-o‘lcham | SANAM` : 'Mahsulot topilmadi | SANAM',
    description: product ? `${product.name}. O‘lcham: ${product.size}. SANAM Factory mahsuloti.` : 'SANAM mahsulot barkodi.',
  };
}

export default async function BarcodeProductPage({ params }: PageProps) {
  const { gtin } = await params;
  const product = findBarcodeProduct(gtin);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:py-14">
      <article className="mx-auto max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
        <header className="bg-[#1E1A5B] px-6 py-5 text-white sm:px-8">
          <Link href="/" className="text-xl font-black tracking-[0.2em] text-[#FFC107]">SANAM</Link>
          <p className="mt-1 text-sm text-slate-200">Tikuvchilik fabrikasi mahsuloti</p>
        </header>

        <section className="space-y-6 p-6 sm:p-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-amber-700">Mahsulot ma’lumoti</p>
            <h1 className="mt-2 text-2xl font-black leading-tight text-[#1E1A5B] sm:text-3xl">{product.name}</h1>
            <p className="mt-3 leading-relaxed text-slate-600">{product.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">O‘lcham</p>
              <p className="mt-1 text-2xl font-black text-[#1E1A5B]">{product.size}</p>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500">Brend</p>
              <p className="mt-2 font-bold">{product.brand}</p>
            </div>
          </div>

          <dl className="space-y-3 border-t border-slate-100 pt-5 text-sm">
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-slate-500">GTIN (EAN-13)</dt>
              <dd className="font-mono font-bold tracking-wide">{product.gtin}</dd>
            </div>
            <div className="flex flex-col gap-1 sm:flex-row sm:justify-between">
              <dt className="text-slate-500">Mahsulot kodi</dt>
              <dd className="font-mono font-bold">{product.subtype}</dd>
            </div>
          </dl>

          <Link href="/#contact" className="block rounded-xl bg-[#FFC107] px-5 py-4 text-center font-extrabold text-[#1E1A5B] transition hover:bg-amber-400">
            SANAM bilan bog‘lanish
          </Link>
          <p className="text-center text-xs text-slate-400">Rasmiy mahsulot ma’lumoti — sanamfactory.uz</p>
        </section>
      </article>
    </main>
  );
}
