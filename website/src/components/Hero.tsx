'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Play, Smartphone, Shield, Zap } from 'lucide-react'
import Link from 'next/link'
import { PhoneFrame, IssuesScreen, SafetyToolsScreen, AdminScreen } from './PhoneMockups'

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.15, 0.1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-radial from-primary-600/20 to-transparent rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.15, 0.1, 0.15],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-radial from-primary-500/15 to-transparent rounded-full blur-3xl"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-900/50 border border-primary-700/50 mb-8"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
              </span>
              <span className="text-sm text-primary-300">Version 1.0 — Now Live</span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6"
            >
              <span className="block">Smart Campus</span>
              <span className="block gradient-text mt-2">Maintenance & Safety</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-primary-400 mb-10"
            >
              Streamline campus facility management with real-time reporting, transparent tracking, 
              and advanced safety tools. Built for students, staff, and administration.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Link
                href="https://github.com/89Aman/CampusFix/releases/download/v1.0.0-alpha/app-release-v1.0.2.apk"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-8 py-4 bg-white text-primary-950 font-semibold rounded-full hover:bg-primary-100 transition-all duration-300 btn-hover"
              >
                Download APK
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="#app-showcase"
                className="group flex items-center gap-2 px-8 py-4 border border-primary-700 text-white font-semibold rounded-full hover:bg-primary-900/50 transition-all duration-300"
              >
                <Play className="w-4 h-4" />
                See App Preview
              </Link>
            </motion.div>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-primary-400"
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-primary-500" />
                <span>iOS & Android</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary-500" />
                <span>Emergency Tools</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary-500" />
                <span>Real-time Updates</span>
              </div>
            </motion.div>
          </div>

          {/* Right - Phone mockups */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center"
          >
            {/* Multiple phones stacked */}
            <div className="relative w-[280px] sm:w-[300px] md:w-[320px]">
              {/* Back phone (Safety Tools) */}
              <motion.div
                initial={{ opacity: 0, x: 30, rotate: 12 }}
                animate={{ opacity: 1, x: 0, rotate: 12 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="absolute -right-12 md:-right-16 top-8 w-[180px] sm:w-[200px] opacity-50 hidden sm:block"
              >
                <PhoneFrame className="scale-90">
                  <SafetyToolsScreen />
                </PhoneFrame>
              </motion.div>

              {/* Back phone (Admin) */}
              <motion.div
                initial={{ opacity: 0, x: -30, rotate: -12 }}
                animate={{ opacity: 1, x: 0, rotate: -12 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="absolute -left-12 md:-left-16 top-8 w-[180px] sm:w-[200px] opacity-50 hidden sm:block"
              >
                <PhoneFrame className="scale-90">
                  <AdminScreen />
                </PhoneFrame>
              </motion.div>

              {/* Main phone (Issues) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="relative z-10"
              >
                <PhoneFrame>
                  <IssuesScreen />
                </PhoneFrame>

                {/* Glow effect */}
                <div className="absolute -inset-8 bg-gradient-radial from-primary-500/20 to-transparent rounded-[4rem] blur-3xl -z-10" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 rounded-full border-2 border-primary-700 p-1"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-primary-400 rounded-full mx-auto"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
