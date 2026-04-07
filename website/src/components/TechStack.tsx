'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

const technologies = [
  {
    category: 'Mobile App',
    items: [
      { name: 'Flutter', description: 'Cross-platform framework' },
      { name: 'Dart', description: 'Programming language' },
      { name: 'Material 3', description: 'Design system' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'FastAPI', description: 'Python web framework' },
      { name: 'PostgreSQL', description: 'Database' },
      { name: 'Supabase', description: 'Backend as a Service' },
    ],
  },
  {
    category: 'Infrastructure',
    items: [
      { name: 'Docker', description: 'Containerization' },
      { name: 'Cloud Run', description: 'Serverless compute' },
      { name: 'GCP', description: 'Cloud platform' },
    ],
  },
  {
    category: 'Security',
    items: [
      { name: 'OAuth 2.0', description: 'Authentication' },
      { name: 'HTTPS', description: 'Encryption' },
      { name: 'AI Moderation', description: 'Content safety' },
    ],
  },
]

export default function TechStack() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="tech-stack" className="relative py-24 md:py-32">
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
            Technology
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Built with modern
            <span className="block gradient-text">technology stack</span>
          </h2>
          <p className="max-w-2xl mx-auto text-primary-400 text-lg">
            We use cutting-edge technologies to ensure reliability, security, and 
            scalability for thousands of users.
          </p>
        </motion.div>

        {/* Tech grid */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {technologies.map((tech, categoryIndex) => (
            <motion.div
              key={tech.category}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="p-6 rounded-2xl bg-primary-900/30 border border-primary-800/50"
            >
              <h3 className="text-sm font-medium text-primary-400 uppercase tracking-wider mb-6">
                {tech.category}
              </h3>
              <div className="space-y-4">
                {tech.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.4, delay: categoryIndex * 0.1 + itemIndex * 0.1 }}
                    className="group"
                  >
                    <div className="flex items-center gap-3 p-3 -mx-3 rounded-xl hover:bg-primary-800/30 transition-colors duration-200">
                      <div className="w-10 h-10 rounded-lg bg-primary-800/50 flex items-center justify-center group-hover:bg-primary-700/50 transition-colors duration-200">
                        <span className="text-lg font-bold text-primary-300 group-hover:text-white transition-colors duration-200">
                          {item.name[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium group-hover:text-white transition-colors duration-200">
                          {item.name}
                        </div>
                        <div className="text-xs text-primary-500">{item.description}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-primary-400"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>99.9% Uptime</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Auto-scaling</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Global CDN</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span>Real-time Sync</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
