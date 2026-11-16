'use client';

import { FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { findBarcodeProduct, normalizeGtin } from '@/data/barcodeProducts';

export function ScanClient() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [value, setValue] = useState('');
  const [message, setMessage] = useState('Skanerni ulang va EAN-13 barkodni o‘qing.');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    inputRef.current?.focus();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const openProduct = (rawValue: string) => {
    const gtin = normalizeGtin(rawValue);
    if (!gtin) return;
    const product = findBarcodeProduct(gtin);
    if (!product) {
      setIsError(true);
      setMessage(`Barkod topilmadi: ${gtin}. Ro‘yxatdagi Sanam EAN-13 kodini skanerlang.`);
      inputRef.current?.select();
      return;
    }
    setIsError(false);
    setMessage(`${product.name} — ${product.size}-o‘lcham. Sahifa ochilmoqda…`);
    router.push(`/01/0${product.gtin}`);
  };

  const handleChange = (nextValue: string) => {
    const digits = nextValue.replace(/\D/g, '').slice(0, 14);
    setValue(digits);
    setIsError(false);
    setMessage('Barkod qabul qilindi.');
    if (timerRef.current) clearTimeout(timerRef.current);
    if (digits.length === 13 || (digits.length === 14 && digits.startsWith('0'))) {
      timerRef.current = setTimeout(() => openProduct(digits), 250);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (timerRef.current) clearTimeout(timerRef.current);
    openProduct(value);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-10 text-slate-900">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-9">
        <Link href="/" className="text-sm font-black tracking-[0.2em] text-[#1E1A5B]">SANAM FACTORY</Link>
        <p className="mt-8 text-xs font-bold uppercase tracking-widest text-amber-700">Mahsulotni barkod orqali topish</p>
        <h1 className="mt-2 text-3xl font-black text-[#1E1A5B]">Barkodni skanerlang</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          USB yoki qo‘l skaneri raqamlarni klaviatura kabi yuboradi. Kursor quyidagi maydonda turganda barkodni o‘qing; mahsulot sahifasi avtomatik ochiladi.
        </p>
        <form onSubmit={handleSubmit} className="mt-7 space-y-3">
          <label htmlFor="gtin" className="block text-sm font-bold">EAN-13 / GTIN</label>
          <input
            ref={inputRef}
            id="gtin"
            value={value}
            onChange={(event) => handleChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                if (timerRef.current) clearTimeout(timerRef.current);
                openProduct(value);
              }
            }}
            inputMode="numeric"
            autoComplete="off"
            maxLength={14}
            placeholder="4780051340541"
            className="w-full rounded-xl border border-slate-300 px-4 py-4 font-mono text-lg tracking-widest outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100"
          />
          <button type="submit" className="w-full rounded-xl bg-[#1E1A5B] px-5 py-4 font-extrabold text-white transition hover:bg-[#2b2675]">
            Mahsulotni ochish
          </button>
        </form>
        <p role="status" aria-live="polite" className={`mt-4 min-h-6 text-sm ${isError ? 'font-semibold text-red-600' : 'text-slate-500'}`}>
          {message}
        </p>
        <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-relaxed text-slate-400">
          Telefon kamerasi bilan mavjud EAN-13 raqami odatda saytni o‘zi ochmaydi. Buning uchun mahsulot yorlig‘iga sanamfactory.uz havolali QR-kod qo‘shiladi.
        </p>
      </section>
    </main>
  );
}
