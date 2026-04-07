'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { 
  PhoneFrame, 
  IssuesScreen, 
  AdminScreen, 
  SafetyToolsScreen, 
  ReportScreen, 
  CommunityScreen 
} from './PhoneMockups'

const screens = [
  {
    id: 1,
    title: 'Campus Issues',
    description: 'Browse and upvote reported issues',
    component: IssuesScreen,
  },
  {
    id: 2,
    title: 'Admin Dashboard',
    description: 'Manage and track all issues',
    component: AdminScreen,
  },
  {
    id: 3,
    title: 'Confidential Report',
    description: 'Anonymous incident reporting',
    component: ReportScreen,
  },
  {
    id: 4,
    title: 'Safety Tools',
    description: 'Emergency SOS and alerts',
    component: SafetyToolsScreen,
  },
  {
    id: 5,
    title: 'Safety Community',
    description: 'Real-time safety alerts',
    component: CommunityScreen,
  },
]

export default function AppShowcase() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % screens.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToPrevious = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev - 1 + screens.length) % screens.length)
  }

  const goToNext = () => {
    setIsAutoPlaying(false)
    setCurrentIndex((prev) => (prev + 1) % screens.length)
  }

  const CurrentScreen = screens[currentIndex].component

  return (
    <section id="app-showcase" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-600/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-500/5 rounded-full blur-[120px]" />
      </div>

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
            App Preview
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            See CampusFix
            <span className="block gradient-text">in action</span>
          </h2>
          <p className="max-w-2xl mx-auto text-primary-400 text-lg">
            Experience the intuitive interface designed for seamless campus management 
            and student safety.
          </p>
        </motion.div>

        {/* Phone mockup carousel */}
        <div className="relative flex flex-col items-center">
          {/* Main phone display */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            {/* Phone frame */}
            <div className="relative mx-auto w-[280px] sm:w-[300px] md:w-[320px]">
              <PhoneFrame>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <CurrentScreen />
                  </motion.div>
                </AnimatePresence>
              </PhoneFrame>

              {/* Glow effect */}
              <div className="absolute -inset-8 bg-gradient-radial from-primary-500/20 to-transparent rounded-[4rem] blur-3xl -z-10" />
            </div>

            {/* Navigation arrows */}
            <button
              onClick={goToPrevious}
              className="absolute left-0 md:-left-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-900/80 border border-primary-700/50 flex items-center justify-center text-primary-400 hover:text-white hover:bg-primary-800/80 transition-all duration-200"
              aria-label="Previous screenshot"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-0 md:-right-20 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary-900/80 border border-primary-700/50 flex items-center justify-center text-primary-400 hover:text-white hover:bg-primary-800/80 transition-all duration-200"
              aria-label="Next screenshot"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>

          {/* Screenshot info */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 text-center"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-semibold mb-2">{screens[currentIndex].title}</h3>
                <p className="text-primary-400">{screens[currentIndex].description}</p>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Dots indicator */}
          <div className="flex items-center gap-2 mt-6">
            {screens.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setIsAutoPlaying(false)
                  setCurrentIndex(index)
                }}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-white'
                    : 'bg-primary-700 hover:bg-primary-600'
                }`}
                aria-label={`Go to screenshot ${index + 1}`}
              />
            ))}
          </div>

          {/* All screens preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-3 sm:grid-cols-5 gap-3 sm:gap-4"
          >
            {screens.map((screen, index) => {
              const ScreenComponent = screen.component
              return (
                <button
                  key={screen.id}
                  onClick={() => {
                    setIsAutoPlaying(false)
                    setCurrentIndex(index)
                  }}
                  className={`relative rounded-2xl overflow-hidden border-2 transition-all duration-300 ${
                    index === currentIndex
                      ? 'border-white scale-105 shadow-lg shadow-white/10'
                      : 'border-primary-800/50 hover:border-primary-600/50 opacity-60 hover:opacity-100'
                  }`}
                >
                  <div className="aspect-[9/19.5] relative bg-gray-900 rounded-xl overflow-hidden">
                    <div className="absolute inset-1 bg-gradient-to-b from-gray-50 to-purple-50/50 rounded-lg overflow-hidden scale-100 pointer-events-none">
                      <div className="transform scale-[0.25] origin-top-left w-[400%] h-[400%]">
                        <ScreenComponent />
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
