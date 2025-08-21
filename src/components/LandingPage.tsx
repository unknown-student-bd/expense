import React, { useState } from 'react'
import { Wallet, TrendingUp, Shield, Users, Heart, Smartphone } from 'lucide-react'
import Auth from './Auth'

interface LandingPageProps {
  onAuthSuccess: () => void
}

export default function LandingPage({ onAuthSuccess }: LandingPageProps) {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | null>(null)
  const [showDonation, setShowDonation] = useState(false)

  if (authMode) {
    return <Auth onAuthSuccess={onAuthSuccess} onBack={() => setAuthMode(null)} initialMode={authMode} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Finance Tracker</h1>
                <p className="text-sm text-slate-400">Your personal finance companion</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowDonation(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-lg transition-all"
              >
                <Heart className="w-4 h-4" />
                <span>Donate</span>
              </button>
              <button
                onClick={() => setAuthMode('login')}
                className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-lg transition-all"
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthMode('signup')}
                className="px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg transition-all"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Take Control of Your
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent"> Finances</span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Track your income and expenses with beautiful charts, smart categorization, 
            and powerful insights. Completely free forever - start your journey to financial freedom today.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setAuthMode('signup')}
              className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
            >
              Get Started - It's Free!
            </button>
            <button
              onClick={() => setShowDonation(true)}
              className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-xl transition-all"
            >
              Support Us
            </button>
            <button
              onClick={() => setAuthMode('login')}
              className="px-8 py-4 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-white font-semibold rounded-xl transition-all"
            >
              Sign In
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Everything You Need - Completely Free
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Powerful features designed to make financial tracking simple and insightful - no hidden costs, no subscriptions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: TrendingUp,
              title: 'Smart Analytics',
              description: 'Beautiful charts and insights that help you understand your spending patterns and financial trends. Upload receipts to keep track of your expenses.'
            },
            {
              icon: Shield,
              title: 'Secure & Private',
              description: 'Your financial data is encrypted and secure. We never share your information with third parties. Always free.'
            },
            {
              icon: Users,
              title: 'Easy to Use',
              description: 'Intuitive interface designed for everyone. Start tracking in minutes, not hours. No payment required.'
            }
          ].map((feature, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-3 rounded-lg w-fit mb-4">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-emerald-600/10 to-teal-600/10 border border-emerald-500/20 rounded-3xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Finances for Free?
          </h2>
          <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who have taken control of their financial future with our completely free tracker. No credit card required.
          </p>
          <button
            onClick={() => setAuthMode('signup')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            Start Free - No Credit Card
          </button>
        </div>
      </section>

      {/* Donation Modal */}
      {showDonation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-8 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="bg-gradient-to-r from-pink-600 to-rose-600 p-3 rounded-lg w-fit mx-auto mb-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Support Our Project</h3>
              <p className="text-slate-400">Help us keep this service free for everyone</p>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-pink-500/20 p-2 rounded-lg">
                      <Smartphone className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">bKash</p>
                      <p className="text-slate-400 text-sm">Mobile Payment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono">01533131873</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="bg-orange-500/20 p-2 rounded-lg">
                      <Smartphone className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">Nagad</p>
                      <p className="text-slate-400 text-sm">Mobile Payment</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-mono">01533131873</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-slate-400 text-sm mb-4">
                Every donation helps us improve and maintain this free service
              </p>
              <button
                onClick={() => setShowDonation(false)}
                className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-800/50 backdrop-blur-xl border-t border-slate-700">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-2 rounded-lg">
                <Wallet className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-semibold">Finance Tracker</span>
            </div>
            <p className="text-slate-400">
              © 2025 Finance Tracker. Made with ❤️ for better financial management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}