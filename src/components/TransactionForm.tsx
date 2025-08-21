import React, { useState } from 'react'
import { supabase } from '../lib/supabase'
import { Plus, DollarSign, Calendar, Tag, FileText } from 'lucide-react'

interface TransactionFormProps {
  onTransactionAdded: () => void
}

const incomeCategories = [
  'Salary',
  'Freelance',
  'Business',
  'Investment',
  'Rental',
  'Gift',
  'Other'
]

const expenseCategories = [
  'Food',
  'Transportation',
  'Housing',
  'Entertainment',
  'Healthcare',
  'Shopping',
  'Utilities',
  'Education',
  'Travel',
  'Other'
]

export default function TransactionForm({ onTransactionAdded }: TransactionFormProps) {
  const [type, setType] = useState<'income' | 'expense'>('income')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!amount || !category) return

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          type,
          amount: parseFloat(amount),
          category,
          description,
          date,
        })

      if (error) throw error

      // Reset form
      setAmount('')
      setCategory('')
      setDescription('')
      setDate(new Date().toISOString().split('T')[0])
      
      onTransactionAdded()
    } catch (error: any) {
      console.error('Error adding transaction:', error)
    } finally {
      setLoading(false)
    }
  }

  const categories = type === 'income' ? incomeCategories : expenseCategories

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
        <Plus className="w-5 h-5 text-emerald-400" />
        <span>Add Transaction</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Selection */}
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              type === 'income'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
              type === 'expense'
                ? 'bg-red-600 text-white'
                : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Expense
          </button>
        </div>

        {/* Amount */}
        <div className="relative">
          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="number"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Amount"
            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            required
          />
        </div>

        {/* Category */}
        <div className="relative">
          <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all appearance-none"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat} className="bg-slate-700">
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="relative">
          <FileText className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)"
            rows={2}
            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none"
          />
        </div>

        {/* Date */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading || !amount || !category}
          className={`w-full font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed ${
            type === 'income'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white'
              : 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white'
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Plus className="w-5 h-5" />
              <span>Add {type === 'income' ? 'Income' : 'Expense'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}