"use client";

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Language, translations } from '../data/translations';
import { Star, Quote, ExternalLink, Send, CheckCircle2, X } from '@/components/Icons';

interface TestimonialsProps {
  currentLang: Language;
}

export const Testimonials: React.FC<TestimonialsProps> = ({ currentLang }) => {
  const { feedbacks, addFeedback, isDarkMode } = useApp();
  const t = translations[currentLang].testimonials;

  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [userName, setUserName] = useState('');
  const [userRating, setUserRating] = useState(5);
  const [userText, setUserText] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState(false);

  const approvedFeedbacks = feedbacks.filter((item) => item.approved);

  const handleSubmitFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName || !userText) return;

    addFeedback({
      name: userName,
      rating: userRating,
      text: userText,
    });

    setSubmittedMessage(true);
    setTimeout(() => {
      setSubmittedMessage(false);
      setShowFeedbackModal(false);
      setUserName('');
      setUserText('');
      setUserRating(5);
    }, 2000);
  };

  return (
    <section id="testimonials" className={`py-16 sm:py-24 transition-colors duration-300 relative ${
      isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
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

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://maps.google.com/?q=RQWW%2BJ4+Qarshi"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold border transition-all ${
                isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-200 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-700 shadow-sm hover:shadow'
              }`}
            >
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current text-[#FFC107]" />
                ))}
              </div>
              <span>{t.googleBadge}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={() => setShowFeedbackModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#1E1A5B] hover:bg-[#13103D] shadow-md transition-all"
            >
              <Send className="w-3.5 h-3.5 text-[#FFC107]" />
              <span>{t.leaveFeedbackBtn}</span>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {approvedFeedbacks.map((item) => (
            <div
              key={item.id}
              className={`rounded-3xl p-8 border transition-all duration-300 flex flex-col justify-between space-y-6 relative group ${
                isDarkMode
                  ? 'bg-slate-900 border-slate-800 text-white hover:border-slate-700'
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-xl'
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-400">
                    {[...Array(item.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-[#FFC107]" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-[#FFC107]/20 group-hover:text-[#FFC107]/40 transition-colors" />
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed italic font-medium ${
                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                }`}>
                  "{item.text}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-800/40 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E1A5B] to-[#13103D] text-white flex items-center justify-center font-extrabold text-sm shadow">
                    {item.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className={`text-xs font-extrabold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">{item.date}</span>
                  </div>
                </div>

                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{t.verifiedBadge}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Submit Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className={`rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 relative shadow-2xl ${
            isDarkMode ? 'bg-slate-900 border border-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between border-b border-slate-700/50 pb-4">
              <h3 className="text-xl font-black text-[#FFC107]">{t.formTitle}</h3>
              <button
                onClick={() => setShowFeedbackModal(false)}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center font-bold"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submittedMessage ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
                <h4 className="text-lg font-extrabold text-white">{t.feedbackSuccessTitle}</h4>
                <p className="text-xs text-slate-400">{t.feedbackSuccessDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitFeedback} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase mb-1">{t.nameLabel}</label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-[#FFC107] ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">{t.ratingLabel}</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        className={`p-2 rounded-xl border transition-all ${
                          userRating >= star ? 'bg-[#FFC107]/20 border-[#FFC107] text-[#FFC107]' : 'bg-slate-800 border-slate-700 text-slate-500'
                        }`}
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1">{t.commentLabel}</label>
                  <textarea
                    rows={4}
                    required
                    value={userText}
                    onChange={(e) => setUserText(e.target.value)}
                    placeholder={t.commentPlaceholder}
                    className={`w-full px-4 py-2.5 rounded-xl text-xs border outline-none focus:ring-2 focus:ring-[#FFC107] resize-none ${
                      isDarkMode ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="pt-2 flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-[#FFC107] text-[#1E1A5B] font-extrabold text-xs rounded-xl shadow"
                  >
                    {t.submitFeedback}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowFeedbackModal(false)}
                    className="px-5 py-3 bg-slate-800 text-slate-300 text-xs font-bold rounded-xl"
                  >
                    {t.closeBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
