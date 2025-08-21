import React from 'react'
import { supabase } from '../lib/supabase'
import { LogOut, User, Wallet } from 'lucide-react'

interface HeaderProps {
  userEmail?: string
  isAdmin?: boolean
  onAdminClick?: () => void
}

export default function Header({ userEmail, isAdmin, onAdminClick }: HeaderProps) {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.reload()
  }

  return (
    <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg">
              <Wallet className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Finance Tracker</h1>
              <p className="text-sm text-slate-400">Track your income and expenses</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isAdmin && (
              <button
                onClick={onAdminClick}
                className="flex items-center space-x-2 px-3 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-500/30 text-purple-300 hover:text-purple-200 rounded-lg transition-all"
              >
                <Shield className="w-4 h-4" />
                <span>Admin</span>
              </button>
            )}
            {userEmail && (
              <div className="flex items-center space-x-2 text-slate-300">
                <User className="w-4 h-4" />
                <span className="text-sm">{userEmail}</span>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}