'use client';

import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Starter',
    description: 'Perfect for small academies and tutoring centers.',
    price: '$29',
    period: '/month',
    features: [
      'Up to 200 students',
      'Basic attendance tracking',
      'Student profiles',
      'Fee management',
      'Email notifications',
      'Standard reports',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    description: 'Ideal for growing schools and colleges.',
    price: '$79',
    period: '/month',
    features: [
      'Up to 1,000 students',
      'Advanced analytics',
      'AI-powered insights',
      'Parent engagement portal',
      'Assignment management',
      'Timetable scheduling',
      'Exam & results system',
      'Priority support',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    description: 'For large institutions and school networks.',
    price: '$199',
    period: '/month',
    features: [
      'Unlimited students',
      'Multi-campus support',
      'Custom integrations',
      'Dedicated account manager',
      'White-label branding',
      'Advanced security',
      'Custom reporting',
      'SLA guarantee',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your institution. All plans include a 14-day free trial.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? 'bg-gradient-to-b from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-500/25 scale-105'
                  : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-amber-400 text-amber-900 text-xs font-semibold rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className={`text-xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                {plan.name}
              </h3>
              <p className={`text-sm mt-2 ${plan.popular ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'}`}>
                {plan.description}
              </p>
              <div className="mt-6 flex items-baseline">
                <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900 dark:text-white'}`}>
                  {plan.price}
                </span>
                <span className={`text-sm ${plan.popular ? 'text-blue-100' : 'text-gray-500'}`}>
                  {plan.period}
                </span>
              </div>
              <ul className="mt-8 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center text-sm">
                    <svg className={`w-5 h-5 mr-3 ${plan.popular ? 'text-blue-200' : 'text-emerald-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={plan.popular ? 'text-blue-50' : 'text-gray-600 dark:text-gray-300'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`mt-8 w-full py-3 px-4 rounded-xl font-medium text-sm transition-all ${
                  plan.popular
                    ? 'bg-white text-blue-600 hover:bg-blue-50'
                    : 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600'
                }`}
              >
                {plan.cta}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
