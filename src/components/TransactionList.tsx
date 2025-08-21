import React, { useState } from 'react'
import { Transaction } from '../lib/supabase'
import { supabase } from '../lib/supabase'
import { 
  Trash2, 
  Calendar, 
  DollarSign, 
  Tag,
  FileText,
  Filter,
  TrendingUp,
  TrendingDown
} from 'lucide-react'

interface TransactionListProps {
  transactions: Transaction[]
  onTransactionDeleted: () => void
}

export default function TransactionList({ transactions, onTransactionDeleted }: TransactionListProps) {
  const [filter, setFilter] = useState<'all' | 'income' | 'expense'>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id)

      if (error) throw error
      onTransactionDeleted()
    } catch (error) {
      console.error('Error deleting transaction:', error)
    } finally {
      setDeletingId(null)
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true
    return transaction.type === filter
  })

  const sortedTransactions = filteredTransactions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  )

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
    })
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
          <FileText className="w-5 h-5 text-emerald-400" />
          <span>Transaction History</span>
        </h2>

        {/* Filter Buttons */}
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <div className="flex space-x-1">
            {[
              { key: 'all', label: 'All' },
              { key: 'income', label: 'Income' },
              { key: 'expense', label: 'Expense' },
            ].map((option) => (
              <button
                key={option.key}
                onClick={() => setFilter(option.key as any)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                  filter === option.key
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-700/50 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {sortedTransactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <FileText className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg">No transactions found</p>
          <p className="text-sm">
            {filter === 'all' 
              ? 'Add your first transaction to get started'
              : `No ${filter} transactions found`
            }
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                transaction.type === 'income'
                  ? 'bg-emerald-500/5 border-emerald-500/20 hover:border-emerald-500/30'
                  : 'bg-red-500/5 border-red-500/20 hover:border-red-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className={`p-2 rounded-lg ${
                      transaction.type === 'income'
                        ? 'bg-emerald-500/10'
                        : 'bg-red-500/10'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className={`font-semibold text-lg ${
                          transaction.type === 'income' ? 'text-emerald-400' : 'text-red-400'
                        }`}>
                          {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount))}
                        </span>
                        <span className="text-slate-300 font-medium">
                          {transaction.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 mt-1 text-slate-400 text-sm">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(transaction.date)}</span>
                        </div>
                        {transaction.description && (
                          <div className="flex items-center space-x-1">
                            <FileText className="w-3 h-3" />
                            <span className="truncate max-w-xs">{transaction.description}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(transaction.id)}
                  disabled={deletingId === transaction.id}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                >
                  {deletingId === transaction.id ? (
                    <div className="w-4 h-4 border-2 border-slate-400/30 border-t-slate-400 rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}