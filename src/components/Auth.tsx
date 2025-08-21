import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { LogIn, UserPlus, Mail, Lock, Github, Chrome, Apple } from 'lucide-react'

interface AuthProps {
  onAuthSuccess: () => void
  onBack?: () => void
}

export default function Auth({ onAuthSuccess, onBack }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [socialLoading, setSocialLoading] = useState<string | null>(null)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
      }
      onAuthSuccess()
    } catch (error: any) {
      if (error.message === 'Invalid login credentials' && isLogin) {
        setError('Invalid login credentials. If you just signed up, please check your email for a confirmation link.')
      } else {
        setError(error.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSocialAuth = async (provider: 'google' | 'github' | 'apple') => {
    setSocialLoading(provider)
    setError('')
    
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin
        }
      })
      if (error) throw error
    } catch (error: any) {
      setError(error.message)
    } finally {
      setSocialLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 text-slate-400 hover:text-white transition-colors flex items-center space-x-2"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>
        )}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Finance Tracker
            </h1>
            <p className="text-slate-400">
              {isLogin ? 'Welcome back' : 'Create your account'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Social Auth Buttons */}
            <div className="space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-800 text-slate-400">Continue with</span>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => handleSocialAuth('google')}
                  disabled={socialLoading !== null}
                  className="flex items-center justify-center px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all disabled:opacity-50"
                >
                  {socialLoading === 'google' ? (
                    <div className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                  ) : (
                    <Chrome className="w-5 h-5 text-slate-300" />
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialAuth('github')}
                  disabled={socialLoading !== null}
                  className="flex items-center justify-center px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all disabled:opacity-50"
                >
                  {socialLoading === 'github' ? (
                    <div className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                  ) : (
                    <Github className="w-5 h-5 text-slate-300" />
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => handleSocialAuth('apple')}
                  disabled={socialLoading !== null}
                  className="flex items-center justify-center px-4 py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg transition-all disabled:opacity-50"
                >
                  {socialLoading === 'apple' ? (
                    <div className="w-5 h-5 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                  ) : (
                    <Apple className="w-5 h-5 text-slate-300" />
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-slate-800 text-slate-400">Or continue with email</span>
              </div>
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || socialLoading !== null}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading || socialLoading !== null ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? (
                    <LogIn className="w-5 h-5" />
                  ) : (
                    <UserPlus className="w-5 h-5" />
                  )}
                  <span>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              disabled={loading || socialLoading !== null}
              className="text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {isLogin
                ? "Don't have an account? Sign up"
                : 'Already have an account? Sign in'}
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-slate-500">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}