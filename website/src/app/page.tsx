'use client'

import { motion } from 'framer-motion'
import Navbar from '@/components/Navbar'
import Hero from '@/components/Hero'
import AppShowcase from '@/components/AppShowcase'
import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import Safety from '@/components/Safety'
import Stats from '@/components/Stats'
import TechStack from '@/components/TechStack'
import CTA from '@/components/CTA'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 grid-bg pointer-events-none" />
      
      {/* Gradient orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary-800/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-primary-700/10 rounded-full blur-[100px]" />
        <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-primary-800/15 rounded-full blur-[100px]" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        <Navbar />
        <Hero />
        <AppShowcase />
        <Features />
        <HowItWorks />
        <Safety />
        <Stats />
        <TechStack />
        <CTA />
        <Footer />
      </div>
    </main>
  )
}
