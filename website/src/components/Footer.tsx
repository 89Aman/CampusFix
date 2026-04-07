'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Github, Twitter, Linkedin, Mail } from 'lucide-react'

const footerLinks = {
  product: [
    { name: 'Features', href: '#features' },
    { name: 'How it Works', href: '#how-it-works' },
    { name: 'Safety Tools', href: '#safety' },
    { name: 'Download App', href: '#cta' },
  ],
  company: [
    { name: 'About Us', href: '#' },
    { name: 'Careers', href: '#' },
    { name: 'Blog', href: '#' },
    { name: 'Contact', href: '#' },
  ],
  resources: [
    { name: 'Documentation', href: '#' },
    { name: 'API Reference', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Status', href: '#' },
  ],
  legal: [
    { name: 'Privacy Policy', href: '#' },
    { name: 'Terms of Service', href: '#' },
    { name: 'Cookie Policy', href: '#' },
  ],
}

const socialLinks = [
  { name: 'GitHub', icon: Github, href: 'https://github.com/89Aman/CampusFix' },
  { name: 'Twitter', icon: Twitter, href: '#' },
  { name: 'LinkedIn', icon: Linkedin, href: '#' },
  { name: 'Email', icon: Mail, href: 'mailto:contact@campusfix.app' },
]

export default function Footer() {
  return (
    <footer className="relative border-t border-primary-800/50">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-primary-950/50 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
            {/* Brand */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-950" />
                </div>
                <span className="text-xl font-bold tracking-tight">
                  Campus<span className="text-primary-400">Fix</span>
                </span>
              </Link>
              <p className="text-sm text-primary-400 mb-6 max-w-xs">
                Streamlining campus facility management and enhancing student safety 
                through real-time reporting and emergency tools.
              </p>
              {/* Social links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target={social.href.startsWith('http') ? '_blank' : undefined}
                    rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="w-9 h-9 rounded-lg bg-primary-900/50 border border-primary-800/50 flex items-center justify-center text-primary-400 hover:text-white hover:bg-primary-800/50 transition-colors duration-200"
                    aria-label={social.name}
                  >
                    <social.icon className="w-4 h-4" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-300 mb-4">
                Product
              </h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-300 mb-4">
                Company
              </h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-300 mb-4">
                Resources
              </h4>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold uppercase tracking-wider text-primary-300 mb-4">
                Legal
              </h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-primary-400 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-primary-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-primary-500">
            © {new Date().getFullYear()} CampusFix. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-xs text-primary-500">
            <span>Made with ❤️ by the CampusFix Team</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
