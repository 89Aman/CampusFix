'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  Camera,
  MapPin,
  TrendingUp,
  ThumbsUp,
  Bell,
  BarChart3,
  Users,
  Lock,
} from 'lucide-react'

const features = [
  {
    icon: Camera,
    title: 'Smart Reporting',
    description: 'Snap photos of campus issues and report them instantly with AI-powered categorization.',
  },
  {
    icon: MapPin,
    title: 'Location Tagging',
    description: 'Precise GPS location logging for faster maintenance dispatch and tracking.',
  },
  {
    icon: TrendingUp,
    title: 'Live Tracking',
    description: 'Real-time status updates: Pending → In Progress → Resolved. Stay informed.',
  },
  {
    icon: ThumbsUp,
    title: 'Community Upvotes',
    description: 'High-priority issues automatically escalate based on community engagement.',
  },
  {
    icon: Bell,
    title: 'Instant Notifications',
    description: 'Get notified when issues you reported or upvoted are updated or resolved.',
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Comprehensive insights for administrators to track and optimize maintenance.',
  },
  {
    icon: Users,
    title: 'Role-Based Access',
    description: 'Secure dashboards with different views for students, staff, and administrators.',
  },
  {
    icon: Lock,
    title: 'Secure & Private',
    description: 'OAuth 2.0 authentication with encrypted data storage and transmission.',
  },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function Features() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="features" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase bg-primary-900/50 border border-primary-800 rounded-full text-primary-400 mb-4">
            Features
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Everything you need for
            <span className="block gradient-text">campus management</span>
          </h2>
          <p className="max-w-2xl mx-auto text-primary-400 text-lg">
            A comprehensive suite of tools designed to streamline facility management 
            and keep your campus running smoothly.
          </p>
        </motion.div>

        {/* Features grid */}
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="h-full p-6 md:p-8 rounded-2xl bg-primary-900/30 border border-primary-800/50 hover:border-primary-700/50 transition-all duration-300 card-hover">
                {/* Icon */}
                <div className="w-12 h-12 mb-6 rounded-xl bg-primary-800/50 flex items-center justify-center group-hover:bg-primary-700/50 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-primary-300 group-hover:text-white transition-colors duration-300" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-3 group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-sm text-primary-400 leading-relaxed">
                  {feature.description}
                </p>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
