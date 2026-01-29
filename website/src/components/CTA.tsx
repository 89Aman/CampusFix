'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Download, Github } from 'lucide-react'
import Link from 'next/link'

export default function CTA() {
  return (
    <section id="cta" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl"
        >
          {/* Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950" />
          <div className="absolute inset-0 grid-bg opacity-30" />
          
          {/* Gradient orbs */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/5 rounded-full blur-[100px]" />

          {/* Content */}
          <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-sm text-primary-200">Download for Android • v1.0.2</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6"
            >
              Ready to transform your
              <span className="block text-primary-300">campus experience?</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-primary-300 max-w-2xl mx-auto mb-10"
            >
              Join thousands of students and staff who are making their campuses safer 
              and better maintained with CampusFix.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link
                href="https://github.com/89Aman/CampusFix/releases/download/v1.0.0-alpha/app-release-v1.0.2.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-8 py-4 bg-white text-primary-950 font-semibold rounded-full hover:bg-primary-100 transition-all duration-300 btn-hover"
              >
                <Download className="w-5 h-5" />
                Download APK
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="https://github.com/89Aman/CampusFix"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-8 py-4 border border-white/20 text-white font-semibold rounded-full hover:bg-white/10 transition-all duration-300"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-12 flex flex-wrap items-center justify-center gap-8 text-sm text-primary-400"
            >
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L3 7v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm-1 15l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
                <span>Free to Use</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
