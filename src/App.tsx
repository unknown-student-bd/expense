import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import { User } from '@supabase/supabase-js'

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleAuthSuccess = () => {
    // Session will be handled by the auth state change listener
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />
  }

  return <Dashboard user={user} />
}

export default App