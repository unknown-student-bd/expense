import React, { useState, useEffect } from 'react'
import { supabase, Donation, Admin } from '../lib/supabase'
import { Plus, Trash2, Users, DollarSign, Smartphone, Calendar, UserPlus, Shield } from 'lucide-react'

interface AdminPanelProps {
  onBack: () => void
}

export default function AdminPanel({ onBack }: AdminPanelProps) {
  const [donations, setDonations] = useState<Donation[]>([])
  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddDonation, setShowAddDonation] = useState(false)
  const [showAddAdmin, setShowAddAdmin] = useState(false)

  // Add donation form state
  const [donorName, setDonorName] = useState('')
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'bkash' | 'nagad'>('bkash')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Add admin form state
  const [adminEmail, setAdminEmail] = useState('')
  const [addingAdmin, setAddingAdmin] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [donationsResult, adminsResult] = await Promise.all([
        supabase.from('donations').select('*').order('created_at', { ascending: false }),
        supabase.from('admins').select('*').order('created_at', { ascending: false })
      ])

      if (donationsResult.error) throw donationsResult.error
      if (adminsResult.error) throw adminsResult.error

      setDonations(donationsResult.data || [])
      setAdmins(adminsResult.data || [])
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddDonation = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!donorName || !amount || !phoneNumber) return

    setSubmitting(true)
    try {
      const { error } = await supabase
        .from('donations')
        .insert({
          donor_name: donorName,
          amount: parseFloat(amount),
          payment_method: paymentMethod,
          phone_number: phoneNumber,
        })

      if (error) throw error

      // Reset form
      setDonorName('')
      setAmount('')
      setPhoneNumber('')
      setShowAddDonation(false)
      fetchData()
    } catch (error) {
      console.error('Error adding donation:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteDonation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('donations')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting donation:', error)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!adminEmail) return

    setAddingAdmin(true)
    try {
      // First, get the user by email
      const { data: users, error: userError } = await supabase.auth.admin.listUsers()
      if (userError) throw userError

      const user = users.users.find(u => u.email === adminEmail)
      if (!user) {
        alert('User not found. Make sure the user has signed up first.')
        return
      }

      const { error } = await supabase
        .from('admins')
        .insert({
          user_id: user.id,
        })

      if (error) throw error

      setAdminEmail('')
      setShowAddAdmin(false)
      fetchData()
    } catch (error) {
      console.error('Error adding admin:', error)
      alert('Error adding admin. Make sure you have admin privileges.')
    } finally {
      setAddingAdmin(false)
    }
  }

  const handleDeleteAdmin = async (id: string) => {
    try {
      const { error } = await supabase
        .from('admins')
        .delete()
        .eq('id', id)

      if (error) throw error
      fetchData()
    } catch (error) {
      console.error('Error deleting admin:', error)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const totalDonations = donations.reduce((sum, donation) => sum + Number(donation.amount), 0)

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-xl border-b border-slate-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-2 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Panel</h1>
                <p className="text-sm text-slate-400">Manage donations and administrators</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white rounded-lg transition-all"
            >
              Back to App
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-400 text-sm font-medium">Total Donations</p>
                <p className="text-white text-2xl font-bold">{formatCurrency(totalDonations)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-400" />
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-400 text-sm font-medium">Total Donors</p>
                <p className="text-white text-2xl font-bold">{donations.length}</p>
              </div>
              <Users className="w-8 h-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-400 text-sm font-medium">Administrators</p>
                <p className="text-white text-2xl font-bold">{admins.length}</p>
              </div>
              <Shield className="w-8 h-8 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Donations Management */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <DollarSign className="w-5 h-5 text-emerald-400" />
                <span>Donations</span>
              </h2>
              <button
                onClick={() => setShowAddDonation(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add Donation</span>
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {donations.map((donation) => (
                <div key={donation.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <div className={`p-2 rounded-lg ${
                          donation.payment_method === 'bkash' ? 'bg-pink-500/20' : 'bg-orange-500/20'
                        }`}>
                          <Smartphone className={`w-4 h-4 ${
                            donation.payment_method === 'bkash' ? 'text-pink-400' : 'text-orange-400'
                          }`} />
                        </div>
                        <div>
                          <p className="text-white font-semibold">{donation.donor_name}</p>
                          <p className="text-emerald-400 font-bold">{formatCurrency(Number(donation.amount))}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4 text-slate-400 text-sm">
                        <span className="capitalize">{donation.payment_method}</span>
                        <span>{donation.phone_number}</span>
                        <span>{formatDate(donation.created_at)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteDonation(donation.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {donations.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <DollarSign className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No donations yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Admin Management */}
          <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-400" />
                <span>Administrators</span>
              </h2>
              <button
                onClick={() => setShowAddAdmin(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Add Admin</span>
              </button>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {admins.map((admin) => (
                <div key={admin.id} className="bg-slate-700/50 border border-slate-600 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="bg-purple-500/20 p-2 rounded-lg">
                        <Shield className="w-4 h-4 text-purple-400" />
                      </div>
                      <div>
                        <p className="text-white font-semibold">Admin User</p>
                        <p className="text-slate-400 text-sm">{formatDate(admin.created_at)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteAdmin(admin.id)}
                      className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
              {admins.length === 0 && (
                <div className="text-center py-8 text-slate-400">
                  <Shield className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No administrators</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Add Donation Modal */}
      {showAddDonation && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Add Donation</h3>
            <form onSubmit={handleAddDonation} className="space-y-4">
              <input
                type="text"
                value={donorName}
                onChange={(e) => setDonorName(e.target.value)}
                placeholder="Donor Name"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                required
              />
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                required
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value as 'bkash' | 'nagad')}
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
              >
                <option value="bkash">bKash</option>
                <option value="nagad">Nagad</option>
              </select>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="Phone Number"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
                required
              />
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Donation'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddDonation(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-800/90 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-4">Add Administrator</h3>
            <form onSubmit={handleAddAdmin} className="space-y-4">
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                placeholder="Admin Email"
                className="w-full px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                required
              />
              <p className="text-slate-400 text-sm">
                The user must have signed up first before being added as an admin.
              </p>
              <div className="flex space-x-3">
                <button
                  type="submit"
                  disabled={addingAdmin}
                  className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-all disabled:opacity-50"
                >
                  {addingAdmin ? 'Adding...' : 'Add Admin'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddAdmin(false)}
                  className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}