import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, Profile } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const initAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!isMounted) return

        setUser(session?.user ?? null)

        if (session?.user) {
          try {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            if (isMounted) setProfile(data)
          } catch (err) {
            if (isMounted) setProfile(null)
          }
        }
      } catch (err) {
        console.error('Auth session error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initAuth()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          try {
            const { data } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
            setProfile(data)
          } catch (err) {
            console.error('Profile fetch error:', err)
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
      }
    )

    return () => subscription?.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
