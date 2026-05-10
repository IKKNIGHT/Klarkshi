import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase, Event } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import EventCard from './EventCard'
import BettingModal from './BettingModal'
import Leaderboard from './Leaderboard'
import AdminPanel from './AdminPanel'
import toast from 'react-hot-toast'

export default function Dashboard() {
  const { profile } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'events' | 'leaderboard' | 'admin'>('events')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('status', 'open')
        .order('created_at', { ascending: false })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  if (!profile) return null

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Klarkshi</h1>
            <div className="text-right">
              <p className="text-sm text-slate-400">Balance</p>
              <p className="text-2xl font-bold text-indigo-400">{profile.cp_balance} CP</p>
            </div>
          </div>
          <p className="text-slate-400">@{profile.username}</p>
        </div>
      </header>

      {/* Navigation */}
      <div className="bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4">
            <button
              onClick={() => setActiveTab('events')}
              className={`py-4 px-4 font-medium border-b-2 transition-colors ${
                activeTab === 'events'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Open Events
            </button>
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`py-4 px-4 font-medium border-b-2 transition-colors ${
                activeTab === 'leaderboard'
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Leaderboard
            </button>
            {profile?.is_main_admin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`py-4 px-4 font-medium border-b-2 transition-colors ${
                  activeTab === 'admin'
                    ? 'border-indigo-500 text-indigo-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'events' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <div className="text-center py-12">
                <p className="text-slate-400">Loading events...</p>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-400">No open events yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    onClick={() => setSelectedEvent(event)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        ) : activeTab === 'leaderboard' ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Leaderboard />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AdminPanel />
          </motion.div>
        )}
      </main>

      {selectedEvent && (
        <BettingModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onBetPlaced={fetchEvents}
        />
      )}
    </div>
  )
}
