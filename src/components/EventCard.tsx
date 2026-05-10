import { motion } from 'framer-motion'
import { Event } from '../lib/supabase'

interface EventCardProps {
  event: Event
  onClick: () => void
}

export default function EventCard({ event, onClick }: EventCardProps) {
  const isYesNo = event.type === 'yes_no'
  const options = isYesNo ? ['Yes', 'No'] : ['Higher', 'Lower']

  return (
    <motion.div
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="bg-slate-900 rounded-lg border border-slate-800 p-6 cursor-pointer hover:border-indigo-500 transition-colors"
    >
      <h3 className="text-lg font-bold mb-2 text-slate-100">{event.title}</h3>
      <p className="text-slate-400 text-sm mb-4">{event.description}</p>

      <div className="flex gap-2 mb-4">
        {options.map((option) => (
          <span
            key={option}
            className="px-3 py-1 text-xs rounded-full bg-slate-800 text-slate-300"
          >
            {option}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-slate-500">
          {event.end_date
            ? new Date(event.end_date).toLocaleDateString()
            : 'No deadline'}
        </span>
        <button
          className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
        >
          Place Bet
        </button>
      </div>
    </motion.div>
  )
}
