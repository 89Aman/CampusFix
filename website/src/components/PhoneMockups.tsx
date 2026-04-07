'use client'

import { motion } from 'framer-motion'
import { 
  ThumbsUp, 
  MapPin, 
  RefreshCw, 
  LogOut, 
  LayoutGrid,
  Volume2,
  Users,
  Phone,
  Star,
  Shield,
  AlertTriangle,
  Upload,
  Lock
} from 'lucide-react'

// Issue Card Component
function IssueCard({ status, title, location, author, votes }: {
  status: 'IN PROGRESS' | 'PENDING' | 'RESOLVED'
  title: string
  location: string
  author: string
  votes: number
}) {
  const statusColors = {
    'IN PROGRESS': 'bg-yellow-100 text-yellow-700',
    'PENDING': 'bg-blue-100 text-blue-700',
    'RESOLVED': 'bg-green-100 text-green-700',
  }

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="h-24 bg-gray-100 rounded-xl mb-3 flex items-center justify-center">
        <div className="w-8 h-8 text-gray-300">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
          </svg>
        </div>
      </div>
      <span className={`inline-block px-2 py-1 rounded-full text-[10px] font-semibold ${statusColors[status]}`}>
        {status}
      </span>
      <h4 className="font-bold text-gray-900 text-sm mt-2 leading-tight">{title}</h4>
      <div className="flex items-center gap-1 text-blue-500 text-xs mt-1">
        <MapPin className="w-3 h-3" />
        <span>{location}</span>
      </div>
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-medium text-gray-600">
            {author[0]}
          </div>
          <span className="text-xs text-gray-500">{author}</span>
        </div>
        <div className="flex items-center gap-1 bg-blue-500 text-white px-3 py-1.5 rounded-full text-xs font-medium">
          <ThumbsUp className="w-3 h-3" />
          <span>{votes}</span>
        </div>
      </div>
    </div>
  )
}

// Phone Frame Component
function PhoneFrame({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <div className="bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-black/30">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-gray-900 rounded-b-2xl z-20" />
        {/* Screen */}
        <div className="relative bg-gradient-to-b from-gray-50 to-purple-50/50 rounded-[2rem] overflow-hidden aspect-[9/19.5]">
          {children}
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-24 h-1 bg-gray-700 rounded-full" />
      </div>
    </div>
  )
}

// Screen 1: Campus Issues
export function IssuesScreen() {
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-4 pt-8 pb-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-gray-900">Campus Is...</h1>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-gray-600" />
          <LogOut className="w-5 h-5 text-gray-600" />
          <LayoutGrid className="w-5 h-5 text-blue-600" />
        </div>
      </div>
      
      {/* Issues */}
      <div className="flex-1 px-3 space-y-3 overflow-hidden">
        <IssueCard
          status="IN PROGRESS"
          title="Water cooler leaking near gym"
          location="Sports Complex"
          author="Staff B"
          votes={13}
        />
        <IssueCard
          status="PENDING"
          title="Broken projector in Lecture Hall 3"
          location="Lecture Hall 3"
          author="Student A"
          votes={8}
        />
      </div>

      {/* FAB */}
      <div className="absolute bottom-20 right-4">
        <div className="bg-blue-600 text-white px-4 py-3 rounded-full flex items-center gap-2 shadow-lg">
          <span className="text-lg">+</span>
          <span className="text-sm font-medium">Report Issue</span>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-100 px-6 py-3 flex justify-between">
        {[
          { icon: LayoutGrid, label: 'Issues', active: true },
          { icon: Shield, label: 'Report', active: false },
          { icon: Shield, label: 'Tools', active: false },
          { icon: Users, label: 'Community', active: false },
        ].map((item, i) => (
          <div key={i} className={`flex flex-col items-center gap-1 ${item.active ? 'text-purple-600' : 'text-gray-400'}`}>
            <div className={`p-2 rounded-xl ${item.active ? 'bg-purple-100' : ''}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Screen 2: Admin Dashboard
export function AdminScreen() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-cyan-50 to-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 flex items-center gap-4">
        <span className="text-xl">←</span>
        <h1 className="text-lg font-bold text-gray-900">Admin Dashboard</h1>
      </div>
      
      {/* Stats */}
      <div className="px-4 flex gap-2 mb-6">
        {[
          { label: 'Total', value: '5', color: 'text-blue-600' },
          { label: 'Pending', value: '2', color: 'text-orange-500' },
          { label: 'In Progress', value: '2', color: 'text-purple-600' },
          { label: 'Resolved', value: '1', color: 'text-green-600' },
        ].map((stat, i) => (
          <div key={i} className="flex-1 bg-white rounded-2xl p-3 shadow-sm">
            <span className="text-xs text-gray-500 block">{stat.label}</span>
            <span className={`text-2xl font-bold ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      {/* Manage Issues */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Manage Issues</h2>
        
        <div className="space-y-3">
          {[
            { id: '#11', title: 'Water cooler leaking near gym', location: 'Sports Complex', reporter: 'Staff B', date: 'Jan 23', status: 'In Progress' },
            { id: '#10', title: 'Broken projector in Lecture Hall 3', location: 'Lecture Hall 3', reporter: 'Student A', date: 'Jan 24', status: 'Pending' },
          ].map((issue, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
              <span className="text-xs text-gray-400">{issue.id}</span>
              <h3 className="font-bold text-gray-900">{issue.title}</h3>
              <p className="text-sm text-gray-500">{issue.location}</p>
              <p className="text-xs text-gray-400">Reported by {issue.reporter} on {issue.date}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                <span className="text-sm font-medium text-gray-700">Status:</span>
                <div className={`px-3 py-1.5 rounded-lg text-sm ${issue.status === 'In Progress' ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                  {issue.status} ▼
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Screen 3: Safety Tools
export function SafetyToolsScreen() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-100 to-purple-50/50">
      {/* Header */}
      <div className="px-4 pt-10 pb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Safety Tools</h1>
        <p className="text-gray-500">Emergency Assistance</p>
      </div>
      
      {/* SOS Button */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        <motion.div 
          className="relative"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-40 h-40 rounded-full bg-red-500 flex flex-col items-center justify-center shadow-xl shadow-red-500/30">
            <span className="text-white text-4xl font-bold">SOS</span>
            <span className="text-white/80 text-lg">1091</span>
          </div>
          <div className="absolute inset-0 rounded-full bg-red-400/30 animate-ping" />
        </motion.div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4 w-full mt-8">
          {[
            { icon: Volume2, label: 'Loud Siren', color: 'text-purple-500', bg: 'bg-purple-50' },
            { icon: MapPin, label: 'Share Location', color: 'text-teal-500', bg: 'bg-teal-50' },
            { icon: Users, label: 'My Contacts', sub: '0 added', color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: Phone, label: 'Police', sub: '100', color: 'text-blue-500', bg: 'bg-blue-50' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 flex flex-col items-center shadow-sm">
              <div className={`w-12 h-12 rounded-full ${item.bg} flex items-center justify-center mb-2`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <span className="font-medium text-gray-900 text-sm">{item.label}</span>
              {item.sub && <span className="text-xs text-gray-400">{item.sub}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-100 px-6 py-3 flex justify-between">
        {[
          { icon: LayoutGrid, label: 'Issues', active: false },
          { icon: Shield, label: 'Report', active: false },
          { icon: Shield, label: 'Tools', active: true },
          { icon: Users, label: 'Community', active: false },
        ].map((item, i) => (
          <div key={i} className={`flex flex-col items-center gap-1 ${item.active ? 'text-purple-600' : 'text-gray-400'}`}>
            <div className={`p-2 rounded-xl ${item.active ? 'bg-purple-100' : ''}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Screen 4: Confidential Report
export function ReportScreen() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-50/50 to-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Confidential Report</h1>
        <div className="mt-3 mx-4 bg-yellow-100 border border-yellow-300 rounded-xl p-3 flex items-center gap-2">
          <Lock className="w-4 h-4 text-yellow-700" />
          <span className="text-sm text-yellow-800">Your identity is protected. Reports are anonymous.</span>
        </div>
      </div>
      
      {/* Form */}
      <div className="flex-1 px-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <label className="block font-semibold text-gray-900 mb-2">What happened?</label>
          <div className="bg-gray-50 rounded-xl p-4 min-h-[100px] text-gray-400 text-sm">
            Describe the incident...
          </div>
          
          <label className="block font-semibold text-gray-900 mt-4 mb-2">Where did it happen?</label>
          <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2 text-gray-400 text-sm">
            <MapPin className="w-4 h-4" />
            <span>e.g., Building A, Flo...</span>
          </div>
          
          <label className="block font-semibold text-gray-900 mt-4 mb-2">Attach Evidence (Optional)</label>
          <div className="bg-gray-50 rounded-xl p-6 flex flex-col items-center border-2 border-dashed border-gray-200">
            <Upload className="w-8 h-8 text-gray-300 mb-2" />
            <span className="text-xs text-gray-400 text-center">Tap to upload photos or videos</span>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-100 px-6 py-3 flex justify-between">
        {[
          { icon: LayoutGrid, label: 'Issues', active: false },
          { icon: Shield, label: 'Report', active: true },
          { icon: Shield, label: 'Tools', active: false },
          { icon: Users, label: 'Community', active: false },
        ].map((item, i) => (
          <div key={i} className={`flex flex-col items-center gap-1 ${item.active ? 'text-purple-600' : 'text-gray-400'}`}>
            <div className={`p-2 rounded-xl ${item.active ? 'bg-purple-100' : ''}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Screen 5: Safety Community
export function CommunityScreen() {
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-50/50 to-white">
      {/* Header */}
      <div className="px-4 pt-8 pb-4 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Safety Community</h1>
      </div>
      
      {/* Alerts */}
      <div className="flex-1 px-4 space-y-4">
        {[
          { location: 'near campus gate', text: 'suspicious person spotted near the campus gate', time: 'Jan 27, 1:23 PM' },
          { location: '1st floor hallway', text: 'XYZ staff members is repeatly approaching me for personal reasons which is very uncomfortable', time: 'Jan 27, 1:19 PM' },
        ].map((alert, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 border-2 border-red-200 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-red-100 text-red-600 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                CRITICAL
              </span>
              <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">RECEIVED</span>
              <span className="text-xs text-gray-400 ml-auto">{alert.time}</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-xs mb-1">
              <MapPin className="w-3 h-3" />
              {alert.location}
            </div>
            <p className="text-gray-900 text-sm">{alert.text}</p>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <div className="bg-white border-t border-gray-100 px-6 py-3 flex justify-between">
        {[
          { icon: LayoutGrid, label: 'Issues', active: false },
          { icon: Shield, label: 'Report', active: false },
          { icon: Shield, label: 'Tools', active: false },
          { icon: Users, label: 'Community', active: true },
        ].map((item, i) => (
          <div key={i} className={`flex flex-col items-center gap-1 ${item.active ? 'text-purple-600' : 'text-gray-400'}`}>
            <div className={`p-2 rounded-xl ${item.active ? 'bg-purple-100' : ''}`}>
              <item.icon className="w-5 h-5" />
            </div>
            <span className="text-[10px]">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { PhoneFrame }
