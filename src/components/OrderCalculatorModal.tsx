"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Language, translations } from '../data/translations';
import { Calculator, X, Send, CheckCircle2, Clock } from '@/components/Icons';

interface OrderCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const OrderCalculatorModal: React.FC<OrderCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const { addCalcInquiry } = useApp();
  const [productType, setProductType] = useState('Korporativ Uniforma');
  const [quantity, setQuantity] = useState<number>(100);
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const t = translations[currentLang].modal;
  const daysEstimate = Math.max(2, Math.ceil(quantity / 150));

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;

    addCalcInquiry({
      productType,
      quantity,
      estimatedDays: daysEstimate,
      phone,
    });

    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in duration-200 border border-slate-200 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#1E1A5B] text-[#FFC107] flex items-center justify-center">
              <Calculator className="w-5 h-5 text-[#FFC107]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#1E1A5B]">
                {t.title}
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                {t.subtitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center font-bold"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h4 className="text-xl font-extrabold text-emerald-900">
              {t.successTitle}
            </h4>
            <p className="text-xs text-emerald-800">
              {t.successDesc}
            </p>
            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#1E1A5B] text-white text-xs font-bold rounded-xl"
            >
              {t.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSend} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.productType}
              </label>
              <select
                value={productType}
                onChange={(e) => setProductType(e.target.value)}
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-[#1E1A5B] outline-none"
              >
                {t.productOptions.map((opt, i) => (
                  <option key={i} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>{t.quantity}:</span>
                <span className="text-[#1E1A5B] font-extrabold text-sm px-3 py-1 bg-slate-100 rounded-lg">
                  {quantity} {t.quantityUnit}
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="5000"
                step="10"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-full accent-[#1E1A5B] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold">
                <span>10 {t.quantityUnit}</span>
                <span>1,000 {t.quantityUnit}</span>
                <span>5,000+ {t.quantityUnit}</span>
              </div>
            </div>

            <div className="p-4 bg-[#1E1A5B]/5 rounded-2xl border border-[#1E1A5B]/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#1E1A5B]">
                <Clock className="w-4 h-4 text-[#FFC107]" />
                <span>{t.estimatedTime}:</span>
              </div>
              <div className="text-sm font-extrabold text-[#1E1A5B]">
                ~ {daysEstimate} {t.days}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t.phoneLabel} <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+998 87 805 66 66"
                className="w-full px-4 py-3 text-sm rounded-xl border border-slate-300 focus:ring-2 focus:ring-[#1E1A5B] outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#1E1A5B] hover:bg-[#13103D] text-white text-sm font-extrabold rounded-xl shadow-lg flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 text-[#FFC107]" />
              <span>{t.sendOrder}</span>
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
