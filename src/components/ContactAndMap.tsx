"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Language, translations } from '../data/translations';
import { MapPin, Phone, Clock, Telegram, Instagram, Facebook, Send, CheckCircle2 } from '@/components/Icons';

interface ContactAndMapProps {
  currentLang: Language;
}

export const ContactAndMap: React.FC<ContactAndMapProps> = ({ currentLang }) => {
  const { addLead, isDarkMode } = useApp();
  const t = translations[currentLang].contact;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [service, setService] = useState(t.form.serviceOptions[0]);
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;

    addLead({
      name,
      phone,
      service,
      message,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName('');
      setPhone('+998 ');
      setMessage('');
    }, 4000);
  };

  return (
    <section id="contact" className={`py-16 sm:py-24 transition-colors duration-300 relative ${
      isDarkMode ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className={`text-xs font-extrabold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block ${
            isDarkMode ? 'bg-[#FFC107]/20 text-[#FFC107]' : 'text-[#1E1A5B] bg-[#1E1A5B]/10'
          }`}>
            {t.badge}
          </span>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-[#1E1A5B]'}`}>
            {t.title}
          </h2>
          <p className={`text-base font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            {t.subtitle}
          </p>
        </div>

        {/* Contact Form & Google Map Embed */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Side: Contact Form */}
          <div className={`lg:col-span-6 rounded-3xl p-6 sm:p-8 border shadow-xl ${
            isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <h3 className={`text-xl font-extrabold mb-6 ${isDarkMode ? 'text-white' : 'text-[#1E1A5B]'}`}>
              {t.form.formTitle}
            </h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-lg font-extrabold text-white">{t.form.successMsg}</h4>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    {t.form.nameLabel}
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t.form.namePlaceholder}
                    className={`w-full px-4 py-3 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-[#FFC107] ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    {t.form.phoneLabel}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t.form.phonePlaceholder}
                    className={`w-full px-4 py-3 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-[#FFC107] ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    {t.form.serviceLabel}
                  </label>
                  <select
                    value={service}
                    onChange={(e) => setService(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-[#FFC107] ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {t.form.serviceOptions.map((opt, i) => (
                      <option key={i} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">
                    {t.form.messageLabel}
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t.form.messagePlaceholder}
                    className={`w-full px-4 py-3 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-[#FFC107] resize-none ${
                      isDarkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#1E1A5B] hover:bg-[#13103D] text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4 text-[#FFC107]" />
                  <span>{t.form.submitBtn}</span>
                </button>
              </form>
            )}
          </div>

          {/* Right Side: Map & Factory Info */}
          <div className="lg:col-span-6 space-y-6">
            <div className={`rounded-3xl border overflow-hidden shadow-xl ${
              isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="h-72 w-full relative">
                <iframe
                  title="SANAM Garment Factory Map"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3106.1820986561337!2d65.795893!3d38.847118!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f4ea6570c9dd3d3%3A0x6b10ffc4ebfa1d1e!2sSANAM%20OFFICIAL%20-%20Garment%20Factory!5e0!3m2!1sen!2suz!4v1700000000000!5m2!1sen!2suz"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>

              <div className="p-4 border-t border-slate-800/40 flex items-center justify-between text-xs font-bold">
                <span className="flex items-center gap-1.5 text-slate-400">
                  <MapPin className="w-4 h-4 text-[#FFC107]" />
                  <span>{t.info.addressText}</span>
                </span>

                <a
                  href="https://maps.google.com/?q=RQWW%2BJ4+Qarshi"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-[#FFC107] text-[#1E1A5B] rounded-lg font-black"
                >
                  {t.info.mapRouteBtn}
                </a>
              </div>
            </div>

            {/* Address & Hours Box */}
            <div className={`p-6 rounded-3xl border shadow-lg space-y-4 ${
              isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-[#1E1A5B] text-white'
            }`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="font-extrabold uppercase text-[#FFC107] flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{t.info.addressTitle}</span>
                  </div>
                  <p className="text-slate-300">{t.info.addressText}</p>
                </div>

                <div className="space-y-1">
                  <div className="font-extrabold uppercase text-[#FFC107] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{t.info.hoursTitle}</span>
                  </div>
                  <p className="text-slate-300">{t.info.hoursText}</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <div className="font-extrabold uppercase text-[#FFC107] flex items-center gap-1 mb-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{t.info.phoneTitle}</span>
                  </div>
                  <a href="tel:+998878056666" className="text-base font-black text-white hover:text-[#FFC107]">
                    {t.info.phone1}
                  </a>
                </div>

                <div>
                  <div className="font-extrabold uppercase text-[#FFC107] mb-1">{t.info.socialsTitle}</div>
                  <div className="flex gap-2 text-white">
                    <a href="https://t.me/sanamfactory" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-[#FFC107] hover:text-[#1E1A5B] transition-colors">
                      <Telegram className="w-4 h-4" />
                    </a>
                    <a href="https://www.instagram.com/sanamfactory.uz/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-[#FFC107] hover:text-[#1E1A5B] transition-colors">
                      <Instagram className="w-4 h-4" />
                    </a>
                    <a href="https://www.facebook.com/share/18aXzYX9na/?mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/10 hover:bg-[#FFC107] hover:text-[#1E1A5B] transition-colors">
                      <Facebook className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
