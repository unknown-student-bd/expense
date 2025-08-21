import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'
import { Transaction } from '../lib/supabase'
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react'

ChartJS.register(ArcElement, Tooltip, Legend)

interface TransactionChartProps {
  transactions: Transaction[]
}

export default function TransactionChart({ transactions }: TransactionChartProps) {
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const balance = totalIncome - totalExpenses

  const data = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(239, 68, 68, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
        borderWidth: 2,
        hoverBackgroundColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(239, 68, 68, 1)',
        ],
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e2e8f0',
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        borderColor: '#475569',
        borderWidth: 1,
        callbacks: {
          label: function(context: any) {
            return `${context.label}: $${context.raw.toFixed(2)}`
          },
        },
      },
    },
    cutout: '70%',
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount)
  }

  if (totalIncome === 0 && totalExpenses === 0) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-emerald-400" />
          <span>Financial Overview</span>
        </h2>
        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
          <BarChart3 className="w-16 h-16 mb-4 opacity-50" />
          <p className="text-lg">No transactions yet</p>
          <p className="text-sm">Add your first income or expense to see the chart</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 rounded-2xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center space-x-2">
        <BarChart3 className="w-5 h-5 text-emerald-400" />
        <span>Financial Overview</span>
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-400 text-sm font-medium">Total Income</p>
              <p className="text-white text-xl font-bold">{formatCurrency(totalIncome)}</p>
            </div>
            <TrendingUp className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-400 text-sm font-medium">Total Expenses</p>
              <p className="text-white text-xl font-bold">{formatCurrency(totalExpenses)}</p>
            </div>
            <TrendingDown className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className={`border rounded-lg p-4 ${
          balance >= 0 
            ? 'bg-emerald-500/10 border-emerald-500/20' 
            : 'bg-red-500/10 border-red-500/20'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-sm font-medium ${
                balance >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>Balance</p>
              <p className="text-white text-xl font-bold">{formatCurrency(balance)}</p>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              balance >= 0 ? 'bg-emerald-500/20' : 'bg-red-500/20'
            }`}>
              <span className={`text-2xl ${
                balance >= 0 ? 'text-emerald-400' : 'text-red-400'
              }`}>
                {balance >= 0 ? '+' : '-'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        <Doughnut data={data} options={options} />
      </div>
    </div>
  )
}