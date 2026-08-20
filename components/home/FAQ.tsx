"use client";

import { useState } from 'react'; 

const faqs = [
  {
    question: "How does the AI doctor recommendation work?",
    answer: "You describe your symptoms in plain language and our AI analyzes them to match you with the most appropriate medical specialty and available doctors in Tripoli.",
  },
  {
    question: "Is my medical information kept private?",
    answer: "Absolutely. All your health data is encrypted and never shared with third parties. Only your treating physician can access your medical details.",
  },
  {
    question: "Can I cancel or reschedule my appointment?",
    answer: "Yes. You can cancel or reschedule any appointment free of charge up to 24 hours before the scheduled time directly from your dashboard.",
  },
  {
    question: "What are the consultation fees?",
    answer: "Consultation fees range from $10 to $50 depending on the specialty. Many visits are partially or fully covered by Lebanese social security.",
  },
  {
    question: "Do you offer telehealth appointments?",
    answer: "Yes. Several of our doctors offer video consultations. You can filter by telehealth availability when searching for a doctor.",
  },
];

export default function FAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section className="bg-slate-50 px-5 py-24">
      <div className="mx-auto max-w-4xl">
        <p className="section-badge">FAQ</p>

        <h2 className="section-title">
          Questions &amp; Answers
        </h2>

        <div className="mt-10 space-y-3">
          {faqs.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="faq-card">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="faq-trigger"
                >
                  <span>{item.question}</span>

                  <span className="ml-4 text-gray-400 text-lg font-bold">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {isOpen && (
                  <div className="faq-content">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}