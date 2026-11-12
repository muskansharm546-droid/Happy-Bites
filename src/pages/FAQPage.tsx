import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

const FAQS = [
  {
    q: 'How fast is Happy Bites delivery?',
    a: 'We deliver within 30 to 45 minutes across supported postal codes! Orders are dispatched from local temperature-controlled hubs right near your neighborhood.',
  },
  {
    q: 'How do you prevent chocolates and ice creams from melting during delivery?',
    a: 'Every confectionery and ice cream item is packed in specialized insulated thermal bubble pouches with medical-grade food-safe chilling gel packs. We guarantee cold, solid chocolates upon arrival!',
  },
  {
    q: 'What are the delivery charges?',
    a: 'Delivery is 100% FREE on all orders of ₹499 and above. For orders under ₹499, a nominal delivery partner fee of ₹49 is charged.',
  },
  {
    q: 'Can I pay via Cash on Delivery (COD) or UPI?',
    a: 'Yes! We support all major payment modes: Google Pay, PhonePe, Paytm, BHIM UPI, RuPay, Visa, Mastercard, and Cash on Delivery at your door.',
  },
  {
    q: 'How can I track my active order?',
    a: 'You can track your order in real time on our Track Order page! Simply enter your Order ID (like HB-89421) or click "Track" directly from your My Orders page to see live rider updates.',
  },
  {
    q: 'What is your cancellation and refund policy?',
    a: 'You can cancel any order free of charge before the packaging stage begins directly from the tracking page. For pre-paid orders, refunds are credited back to your original payment method in 24 hours.',
  },
];

export const FAQPage: React.FC = () => {
  const { navigateTo } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100/70 px-3 py-1 rounded-full">
          Help & Answers
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#2C1810] font-heading">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Everything you need to know about snacking with Happy Bites.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs transition"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-[#2C1810] hover:text-orange-600 transition"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-orange-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-1 text-xs text-stone-600 leading-relaxed border-t border-stone-100 animate-in fade-in duration-150">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="p-6 bg-amber-50 rounded-3xl border border-amber-200 text-center space-y-2">
        <p className="text-xs font-bold text-amber-950">Still have a question?</p>
        <p className="text-xs text-stone-500">
          Our friendly customer care team is available 7:00 AM to 2:00 AM every day.
        </p>
        <button
          onClick={() => navigateTo('contact')}
          className="mt-2 px-5 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold hover:bg-orange-700 transition"
        >
          Contact Support
        </button>
      </div>
    </div>
  );
};
