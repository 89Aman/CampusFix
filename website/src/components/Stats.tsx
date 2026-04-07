'use client'

import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef, useEffect } from 'react'

const stats = [
  { value: 1284, suffix: '+', label: 'Issues Reported', description: 'and counting' },
  { value: 90, suffix: '%', label: 'Resolution Rate', description: 'within 48 hours' },
  { value: 3200, suffix: '+', label: 'Active Users', description: 'across campus' },
  { value: 4.9, suffix: '', label: 'User Rating', description: 'on app stores' },
]

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => {
    if (value < 10) {
      return latest.toFixed(1)
    }
    return Math.round(latest).toLocaleString()
  })

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, {
        duration: 2,
        ease: 'easeOut',
      })
      return controls.stop
    }
  }, [isInView, value, count])

  return (
    <span ref={ref} className="tabular-nums">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="relative p-8 md:p-16 rounded-3xl bg-gradient-to-br from-primary-900/50 to-primary-800/30 border border-primary-700/30 overflow-hidden"
        >
          {/* Background effects */}
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary-600/10 rounded-full blur-[100px]" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-primary-500/10 rounded-full blur-[100px]" />

          {/* Stats grid */}
          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-2 gradient-text">
                  <AnimatedNumber value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-lg font-medium text-white mb-1">{stat.label}</div>
                <div className="text-sm text-primary-400">{stat.description}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
