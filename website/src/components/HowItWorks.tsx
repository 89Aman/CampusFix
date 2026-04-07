'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { Camera, Send, CheckCircle, BarChart } from 'lucide-react'

const steps = [
  {
    number: '01',
    icon: Camera,
    title: 'Report an Issue',
    description: 'Take a photo of the problem, add a description, and tag the location. Our smart system categorizes it automatically.',
  },
  {
    number: '02',
    icon: Send,
    title: 'Community Validates',
    description: 'Other students can upvote the issue, increasing its priority in the queue. More votes = faster resolution.',
  },
  {
    number: '03',
    icon: CheckCircle,
    title: 'Admin Takes Action',
    description: 'Maintenance staff receive the report, update status in real-time, and resolve the issue efficiently.',
  },
  {
    number: '04',
    icon: BarChart,
    title: 'Track & Improve',
    description: 'Analytics provide insights on common issues, response times, and areas needing attention.',
  },
]

export default function HowItWorks() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary-800 to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-24"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase bg-primary-900/50 border border-primary-800 rounded-full text-primary-400 mb-4">
            How It Works
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Simple process,
            <span className="block gradient-text">powerful results</span>
          </h2>
          <p className="max-w-2xl mx-auto text-primary-400 text-lg">
            From reporting to resolution in four easy steps. Our streamlined workflow 
            ensures every issue gets the attention it deserves.
          </p>
        </motion.div>

        {/* Steps */}
        <div ref={ref} className="relative">
          {/* Connection line */}
          <div className="absolute top-24 left-0 right-0 hidden lg:block">
            <div className="max-w-4xl mx-auto h-0.5 bg-gradient-to-r from-primary-900 via-primary-700 to-primary-900" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 40 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                {/* Step card */}
                <div className="text-center lg:text-left">
                  {/* Number badge */}
                  <div className="relative inline-flex mb-8">
                    <div className="w-20 h-20 rounded-2xl bg-primary-900 border border-primary-800 flex items-center justify-center relative z-10">
                      <step.icon className="w-8 h-8 text-primary-300" />
                    </div>
                    <span className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-white text-primary-950 text-sm font-bold flex items-center justify-center z-20">
                      {step.number}
                    </span>
                    {/* Glow */}
                    <div className="absolute inset-0 bg-primary-600/20 rounded-2xl blur-xl -z-10" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-sm text-primary-400 leading-relaxed max-w-xs mx-auto lg:mx-0">
                    {step.description}
                  </p>
                </div>

                {/* Arrow for desktop */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-4 w-8 text-primary-700">
                    <svg viewBox="0 0 24 24" fill="none" className="w-full h-auto">
                      <path
                        d="M5 12h14M12 5l7 7-7 7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
