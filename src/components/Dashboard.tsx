import React, { useState, useEffect } from 'react'
import { supabase, Transaction } from '../lib/supabase'
import Header from './Header'
import TransactionForm from './TransactionForm'
import TransactionChart from './TransactionChart'
import TransactionList from './TransactionList'
import AdminPanel from './AdminPanel'
import { User } from '@supabase/supabase-js'
import { Shield } from 'lucide-react'

interface DashboardProps {
  user: User
}

export default function Dashboard({ user }: DashboardProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showAdmin, setShowAdmin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAdminStatus()
    fetchTransactions()
  }, [])

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase
        .from('admins')
        .select('id')
        .eq('user_id', user.id)
        .single()

      if (!error && data) {
        setIsAdmin(true)
      }
    } catch (error) {
      // User is not an admin
    } finally {
      setLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      setTransactions(data || [])
    } catch (error) {
      console.error('Error fetching transactions:', error)
    }
  }

  if (showAdmin) {
    return <AdminPanel onBack={() => setShowAdmin(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Header 
        userEmail={user.email} 
        isAdmin={isAdmin}
        onAdminClick={() => setShowAdmin(true)}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            <TransactionForm onTransactionAdded={fetchTransactions} />
            <TransactionChart transactions={transactions} />
          </div>

          {/* Right Column */}
          <div>
            <TransactionList 
              transactions={transactions} 
              onTransactionDeleted={fetchTransactions} 
            />
          </div>
        </div>
      </main>
    </div>
  )
}