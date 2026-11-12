import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ContactPage: React.FC = () => {
  const { showToast } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Order Inquiry');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    setIsSent(true);
    showToast('Your message has been sent to Happy Bites Care Team!', 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12 space-y-12">
      {/* Title */}
      <div className="text-center space-y-2">
        <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 bg-orange-100/70 px-3 py-1 rounded-full">
          We’re Here for You
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#2C1810] font-heading">
          Get in Touch with Happy Bites
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
          Have a question about your order, need party bulk snack catering, or want to suggest a new treat?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Left Column: Contact Cards */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-[#2C1810] text-white p-6 rounded-3xl shadow-xl space-y-6">
            <h3 className="font-bold text-lg font-heading text-amber-200">
              Happy Bites Headquarters
            </h3>

            <div className="space-y-4 text-xs text-amber-100/80">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Central Hub & Fulfillment</p>
                  <p>Plot 48, Snack Hub Lane, Bandra West, Mumbai 400050, India</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Customer Support Helpline</p>
                  <p>+91 1800-HAPPY-BITES (Toll Free)</p>
                  <p className="text-[11px] text-amber-200/60">+91 98765 43210 (WhatsApp)</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Official Email</p>
                  <p>support@happybites.com</p>
                  <p className="text-[11px] text-amber-200/60">orders@happybites.com</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Operating Hours</p>
                  <p>Daily: 7:00 AM – 2:00 AM IST</p>
                  <p className="text-[11px] text-emerald-400 font-bold">Midnight Deliveries Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contact Form */}
        <div className="md:col-span-7">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200 shadow-xs">
            {isSent ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-stone-900 font-heading">
                  Message Sent Successfully!
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Thank you for reaching out, {name}. Our snack experts will reply to {email} within 30 minutes.
                </p>
                <button
                  onClick={() => setIsSent(false)}
                  className="px-6 py-2 bg-orange-600 text-white rounded-xl text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="text-base font-bold text-[#2C1810] font-heading">
                  Send Us a Message
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Muskan Sharma"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">Subject</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl font-semibold"
                    >
                      <option value="Order Inquiry">Order Inquiry / Tracking</option>
                      <option value="Bulk Order">Bulk / Party Snacks Order</option>
                      <option value="Feedback">Product Feedback</option>
                      <option value="Partnership">Vendor Partnership</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Message *</label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us what you need help with..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl outline-hidden focus:border-orange-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-2xl text-xs transition shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Message</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
