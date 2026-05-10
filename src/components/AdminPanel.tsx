import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function AdminPanel() {
  const { profile } = useAuth()
  const [eventTitle, setEventTitle] = useState('')
  const [eventDescription, setEventDescription] = useState('')
  const [eventType, setEventType] = useState<'yes_no' | 'higher_lower'>('yes_no')
  const [eventEndDate, setEventEndDate] = useState('')
  const [loading, setLoading] = useState(false)

  if (!profile?.is_main_admin) {
    return (
      <div className="bg-slate-900 rounded-lg border border-slate-800 p-6 text-center">
        <p className="text-slate-400">You need admin privileges to access this panel</p>
      </div>
    )
  }

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase.from('events').insert({
        title: eventTitle,
        description: eventDescription,
        type: eventType,
        created_by: profile.id,
        end_date: eventEndDate || null,
        status: 'open',
      })

      if (error) throw error

      toast.success('Event created successfully!')
      setEventTitle('')
      setEventDescription('')
      setEventEndDate('')
    } catch (err) {
      console.error('Error creating event:', err)
      toast.error('Failed to create event')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Create Event</h2>

      <form onSubmit={handleCreateEvent} className="bg-slate-900 rounded-lg border border-slate-800 p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Event Title
          </label>
          <input
            type="text"
            value={eventTitle}
            onChange={(e) => setEventTitle(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            placeholder="e.g., Will the Math exam be on Friday?"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Description
          </label>
          <textarea
            value={eventDescription}
            onChange={(e) => setEventDescription(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
            rows={3}
            placeholder="Provide more details about the event..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            Event Type
          </label>
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value as 'yes_no' | 'higher_lower')}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="yes_no">Yes/No</option>
            <option value="higher_lower">Higher/Lower</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">
            End Date (Optional)
          </label>
          <input
            type="datetime-local"
            value={eventEndDate}
            onChange={(e) => setEventEndDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating Event...' : 'Create Event'}
        </button>
      </form>
    </div>
  )
}
