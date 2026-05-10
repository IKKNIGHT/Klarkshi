import { useState } from 'react'
import { motion } from 'framer-motion'
import { Event } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'

interface BettingModalProps {
  event: Event
  onClose: () => void
  onBetPlaced: () => void
}

export default function BettingModal({ event, onClose, onBetPlaced }: BettingModalProps) {
  const { profile, user } = useAuth()
  const [amount, setAmount] = useState('')
  const [prediction, setPrediction] = useState('')
  const [loading, setLoading] = useState(false)

  const options = event.type === 'yes_no' ? ['Yes', 'No'] : ['Higher', 'Lower']
  const potentialWinnings = amount ? Math.floor(parseInt(amount) * 2) : 0

  const handlePlaceBet = async () => {
    if (!user || !profile) return
    if (!amount || !prediction) {
      toast.error('Please enter amount and select a prediction')
      return
    }

    const betAmount = parseInt(amount)
    if (betAmount > profile.cp_balance) {
      toast.error('Insufficient CP balance')
      return
    }

    setLoading(true)
    try {
      const { error: betError } = await supabase.from('bets').insert({
        user_id: user.id,
        event_id: event.id,
        amount: betAmount,
        prediction,
      })

      if (betError) throw betError

      const { error: balanceError } = await supabase
        .from('profiles')
        .update({ cp_balance: profile.cp_balance - betAmount })
        .eq('id', user.id)

      if (balanceError) throw balanceError

      toast.success(`Bet placed! You could win ${potentialWinnings} CP`)
      onBetPlaced()
      onClose()
    } catch (err) {
      console.error('Error placing bet:', err)
      toast.error('Failed to place bet')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-800"
      >
        <h2 className="text-2xl font-bold mb-4">{event.title}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Select Prediction
            </label>
            <div className="grid grid-cols-2 gap-3">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => setPrediction(option)}
                  className={`py-3 px-4 rounded-lg font-medium transition-colors ${
                    prediction === option
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-300">
              Amount (CP)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="1"
              max={profile?.cp_balance || 0}
              className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
              placeholder="Enter amount"
            />
            <p className="text-xs text-slate-400 mt-1">
              Available: {profile?.cp_balance || 0} CP
            </p>
          </div>

          <div className="bg-slate-800 rounded-lg p-4">
            <p className="text-sm text-slate-400 mb-1">Potential Winnings</p>
            <p className="text-2xl font-bold text-emerald-400">{potentialWinnings} CP</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handlePlaceBet}
              disabled={loading || !prediction || !amount}
              className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Placing...' : 'Place Bet'}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
