'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
  {
    question: 'How long does it take to set up StudentHub?',
    answer: 'Most schools are up and running within 30 minutes. Our onboarding team provides guided setup assistance, data migration support, and training sessions for your staff at no additional cost.',
  },
  {
    question: 'Can I import existing student and teacher data?',
    answer: 'Yes. StudentHub supports CSV and Excel imports for bulk data entry. We also provide API integrations for seamless migration from existing school management systems.',
  },
  {
    question: 'Is my school data secure?',
    answer: 'Absolutely. We use enterprise-grade security with end-to-end encryption, role-based access control, and Row Level Security through Supabase PostgreSQL. All data is backed up daily and stored in SOC 2 compliant infrastructure.',
  },
  {
    question: 'Do parents need a separate account?',
    answer: 'Yes, each parent gets their own secure portal where they can view their children\'s attendance, grades, fee status, and receive notifications. They can also communicate directly with teachers.',
  },
  {
    question: 'Can I customize the platform for my school?',
    answer: 'Enterprise plans include full white-label customization, including school branding, custom color schemes, domain mapping, and tailored workflows. Professional plans include theme customization.',
  },
  {
    question: 'What happens when I exceed my plan limits?',
    answer: 'We never lock you out of your data. If you approach your plan limits, we\'ll notify you and provide options to upgrade. Your existing data is always accessible.',
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Everything you need to know about StudentHub.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-white">{faq.question}</span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0 ml-4" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
