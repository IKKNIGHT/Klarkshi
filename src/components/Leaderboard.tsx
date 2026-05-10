import { useEffect, useState } from 'react'
import { supabase, Profile } from '../lib/supabase'
import toast from 'react-hot-toast'

export default function Leaderboard() {
  const [profiles, setProfiles] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('cp_balance', { ascending: false })
        .limit(50)

      if (error) throw error
      setProfiles(data || [])
    } catch (err) {
      console.error('Error fetching leaderboard:', err)
      toast.error('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Loading leaderboard...</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">Top Players</h2>
      <div className="bg-slate-900 rounded-lg overflow-hidden border border-slate-800">
        <div className="divide-y divide-slate-800">
          {profiles.map((profile, index) => (
            <div
              key={profile.id}
              className="flex items-center justify-between p-4 hover:bg-slate-800/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div>
                  <p className="font-medium">{profile.username}</p>
                  {profile.is_main_admin && (
                    <p className="text-xs text-indigo-400">Admin</p>
                  )}
                </div>
              </div>
              <p className="text-lg font-bold text-emerald-400">{profile.cp_balance} CP</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
