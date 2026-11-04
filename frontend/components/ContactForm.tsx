"use client";

import { useState } from "react";
import {
  LocationOnOutlined,
  AccessTimeOutlined,
  PhoneOutlined,
  WhatsApp,
  NearMeOutlined,
  CheckCircleOutlined,
  ExpandMoreOutlined,
} from "@mui/icons-material";
import { clinicInfo } from "@/app/constants/mockData";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ContactForm({ workingHours }: { workingHours: string }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const faqs = [
    {
      question: "How do I reach Elite Dental Centre in F-10 Markaz, Islamabad?",
      answer: "We are located at D-Watson Chemist Building, 2nd Floor, F-10 Markaz, Islamabad. Ample parking is available directly in front of the plaza with elevator access to the second floor.",
    },
    {
      question: "Do you provide same-day emergency dental appointments?",
      answer: "Yes, we reserve dedicated daily emergency slots for severe acute toothache, broken crowns, dental abscesses, or facial trauma. Please call or WhatsApp our clinic line immediately.",
    },
    {
      question: "What should I bring for my first consultation?",
      answer: "Bring any recent OPG x-rays or dental history records if available, plus a list of current medical conditions or allergies so our surgeons can personalize your treatment safely.",
    },
    {
      question: "Are installment payment plans available for expensive procedures?",
      answer: "Yes! We offer flexible, milestone-based installment plans for orthodontic aligners, metal/ceramic braces, and full-mouth dental implant rehabilitations.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      {/* Header */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950 border border-teal-800 px-3 py-1 rounded-full">
            Direct Clinic Access
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-white mt-4 tracking-tight">
            Contact Elite Dental Centre
          </h1>
          <p className="mt-4 text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Have a question about a dental procedure, need a second opinion, or experiencing acute dental pain? Our reception team is available during clinic hours.
          </p>
        </div>
      </section>

      {/* Main Content Grid: Info & Contact Form */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left: Contact Info & Clinic Location Card */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs space-y-6">
              <h2 className="text-xl font-extrabold text-slate-950">Clinic Details</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                    <LocationOnOutlined sx={{ fontSize: 22, color: "#0d9488" }} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Address</h4>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{clinicInfo.address}</p>
                    <p className="text-xs text-slate-500 mt-0.5">2nd Floor, Elevator Access, Above D-Watson Chemist</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                    <AccessTimeOutlined sx={{ fontSize: 22, color: "#0d9488" }} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Clinical Hours</h4>
                    <p className="text-sm font-semibold text-slate-800 mt-0.5">{workingHours || "12:00 PM - 8:00 PM (Mon-Sat)"}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Sunday: On-call emergency coverage only</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                    <PhoneOutlined sx={{ fontSize: 22, color: "#0d9488" }} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">Telephone</h4>
                    <a href={`tel:${clinicInfo.phone}`} className="text-sm font-bold text-teal-700 hover:text-teal-800 mt-0.5 block">
                      {clinicInfo.phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
                    <WhatsApp sx={{ fontSize: 22, color: "#059669" }} />
                  </div>
                  <div>
                    <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider">WhatsApp Consultation</h4>
                    <a
                      href={`https://wa.me/${clinicInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-emerald-700 hover:text-emerald-800 mt-0.5 block"
                    >
                      Chat with Reception (+92 314 5475528)
                    </a>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                <a
                  href="https://www.google.com/maps/search/D-Watson+Chemist+F-10+Markaz+Islamabad"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-teal-700 text-white font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <NearMeOutlined sx={{ fontSize: 16, color: "#2dd4bf" }} />
                  <span>Open in Google Maps</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Message Dispatcher & FAQs */}
          <div className="lg:col-span-7 space-y-8">
            {/* Interactive Message Form */}
            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xs">
              <h2 className="text-xl font-extrabold text-slate-950 mb-2">Send an Inquiry or Feedback</h2>
              <p className="text-xs text-slate-500 mb-6">Our clinical receptionist responds within 2 business hours.</p>

              {formSubmitted ? (
                <div className="p-6 rounded-xl bg-teal-50 border border-teal-200 text-center">
                  <CheckCircleOutlined sx={{ fontSize: 40, color: "#0d9488" }} className="mx-auto mb-2" />
                  <h4 className="text-base font-bold text-slate-900">Message Received</h4>
                  <p className="text-xs text-slate-600 mt-1">Our receptionist will contact you via WhatsApp or phone shortly.</p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setFormSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">Your Name</label>
                      <input
                        required
                        type="text"
                        placeholder="e.g. Tariq Khan"
                        className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-teal-600"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase">Phone or WhatsApp</label>
                      <input
                        required
                        type="tel"
                        placeholder="0300 1234567"
                        className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-teal-600"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase">Treatment Interested In</label>
                    <input
                      type="text"
                      placeholder="e.g. Teeth Whitening, Dental Implants, RCT"
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-teal-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase">Questions or Symptoms</label>
                    <textarea
                      rows={3}
                      placeholder="Describe what you're looking for..."
                      className="w-full mt-1.5 px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm focus:outline-teal-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-teal-600/25 active:scale-95 cursor-pointer"
                  >
                    Submit Inquiry
                  </button>
                </form>
              )}
            </div>

            {/* Frequently Asked Questions */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">Frequently Asked Questions</h3>
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-200"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-sm font-bold text-slate-800 hover:text-teal-700 cursor-pointer"
                    >
                      <span>{faq.question}</span>
                      <ExpandMoreOutlined
                        sx={{ fontSize: 20 }}
                        className={`text-slate-400 transition-transform ${isOpen ? "rotate-180 text-teal-600" : ""}`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
