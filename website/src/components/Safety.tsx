'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import {
  AlertTriangle,
  Siren,
  MapPin,
  Phone,
  Users,
  Shield,
} from 'lucide-react'

const safetyFeatures = [
  {
    icon: AlertTriangle,
    title: 'SOS Button',
    description: 'One-tap emergency alert sends your location to campus security immediately.',
    color: 'red',
  },
  {
    icon: Siren,
    title: 'Virtual Siren',
    description: 'High-decibel audible alert to draw attention in dangerous situations.',
    color: 'yellow',
  },
  {
    icon: MapPin,
    title: 'Live Location Sharing',
    description: 'Share your real-time GPS coordinates with trusted contacts instantly.',
    color: 'blue',
  },
  {
    icon: Users,
    title: 'Trusted Contacts',
    description: 'Maintain a secure list of emergency contacts for quick access.',
    color: 'green',
  },
  {
    icon: Phone,
    title: 'Quick Dial',
    description: 'Fast access to Police (100), Campus Security, and emergency services.',
    color: 'purple',
  },
  {
    icon: Shield,
    title: 'Anonymous Reporting',
    description: 'Report safety concerns anonymously to protect your identity.',
    color: 'gray',
  },
]

export default function Safety() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="safety" className="relative py-24 md:py-32">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 text-xs font-medium tracking-wider uppercase bg-red-500/10 border border-red-500/20 rounded-full text-red-400 mb-4">
              Safety First
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Your safety,
              <span className="block gradient-text">our priority</span>
            </h2>
            <p className="text-primary-400 text-lg mb-8 leading-relaxed">
              CampusFix goes beyond maintenance. Our comprehensive safety tools are designed 
              to protect students with instant emergency features, location sharing, and 
              anonymous reporting capabilities.
            </p>

            {/* Key stats */}
            <div className="flex flex-wrap gap-8">
              <div>
                <div className="text-3xl font-bold text-white mb-1">&lt; 3s</div>
                <div className="text-sm text-primary-400">SOS Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-primary-400">Emergency Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-primary-400">Anonymous Option</div>
              </div>
            </div>
          </motion.div>

          {/* Features grid */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, x: 40 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-2 gap-4"
          >
            {safetyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group p-5 rounded-2xl bg-primary-900/30 border border-primary-800/50 hover:border-primary-700/50 transition-all duration-300 card-hover"
              >
                <div className="w-10 h-10 mb-4 rounded-xl bg-primary-800/50 flex items-center justify-center group-hover:bg-primary-700/50 transition-colors duration-300">
                  <feature.icon className="w-5 h-5 text-primary-300 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="font-semibold mb-2 group-hover:text-white transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-xs text-primary-400 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Emergency CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-20 p-8 md:p-12 rounded-3xl bg-gradient-to-br from-primary-900/50 to-primary-900/30 border border-primary-800/50 relative overflow-hidden"
        >
          {/* Background pattern */}
          <div className="absolute inset-0 grid-bg opacity-50" />
          
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              In case of emergency
            </h3>
            <p className="text-primary-400 max-w-2xl mx-auto mb-8">
              The SOS button is always accessible from any screen. One tap activates the emergency 
              protocol, alerting campus security and sharing your location with trusted contacts.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex items-center gap-2 px-6 py-3 bg-primary-800/50 rounded-full text-sm">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>Campus Security: <span className="text-white font-semibold">1091</span></span>
              </div>
              <div className="flex items-center gap-2 px-6 py-3 bg-primary-800/50 rounded-full text-sm">
                <Phone className="w-4 h-4 text-primary-400" />
                <span>Police: <span className="text-white font-semibold">100</span></span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
