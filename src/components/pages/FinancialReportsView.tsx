import React, { useState, useMemo } from 'react'
import { DollarSign, FileText, AlertCircle, Search, TrendingUp, CreditCard } from 'lucide-react'
import { toast } from 'sonner'
import { LineChart } from '../DashboardCharts'

interface Transaction {
  id: string
  customer: string
  amount: number
  method: string
  date: string
  status: 'paid' | 'pending' | 'failed'
}

interface FinancialReportsViewProps {
  isArabic: boolean
  stats: {
    totalRevenue: number
    netProfit: number
  }
}

export const FinancialReportsView: React.FC<FinancialReportsViewProps> = ({ isArabic, stats }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all')

  const transactions: Transaction[] = useMemo(() => [
    {
      id: '#TXN9901',
      customer: 'محمد علي',
      amount: 650,
      method: isArabic ? 'مدى (Mada)' : 'Mada Card',
      date: '25/05/2024',
      status: 'paid',
    },
    {
      id: '#TXN9902',
      customer: 'سارة أحمد',
      amount: 650,
      method: isArabic ? 'فيزا (Visa)' : 'Visa Card',
      date: '25/05/2024',
      status: 'paid',
    },
    {
      id: '#TXN9903',
      customer: 'علي خالد',
      amount: 200,
      method: isArabic ? 'أبل باي (Apple Pay)' : 'Apple Pay',
      date: '19/05/2024',
      status: 'failed',
    },
    {
      id: '#TXN9904',
      customer: 'فاطمة سعيد',
      amount: 756,
      method: isArabic ? 'مدى (Mada)' : 'Mada Card',
      date: '20/05/2024',
      status: 'pending',
    },
  ], [isArabic])

  // Dynamic calculations
  const summary = useMemo(() => {
    const vat = Math.round(stats.totalRevenue * 0.15) // 15% VAT
    const payout = Math.round(stats.netProfit * 0.8) // Simulated pending payout
    return { vat, payout }
  }, [stats])

  const chartData = [
    { label: isArabic ? 'يناير' : 'Jan', value: 34000 },
    { label: isArabic ? 'فبراير' : 'Feb', value: 45000 },
    { label: isArabic ? 'مارس' : 'Mar', value: 68000 },
    { label: isArabic ? 'أبريل' : 'Apr', value: 89000 },
    { label: isArabic ? 'مايو' : 'May', value: stats.totalRevenue },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
            {isArabic ? 'مدفوع' : 'Paid'}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            {isArabic ? 'قيد الانتظار' : 'Pending'}
          </span>
        )
      case 'failed':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {isArabic ? 'فشل الدفع' : 'Failed'}
          </span>
        )
    }
  }

  // Filter
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch = 
        t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.method.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (!matchesSearch) return false
      if (statusFilter === 'all') return true
      return t.status === statusFilter
    })
  }, [transactions, searchQuery, statusFilter])

  return (
    <div className="space-y-6">
      
      {/* Metric summaries */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between text-start group">
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'إجمالي المبيعات' : 'Total Revenue'}</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {isArabic ? 'ر.س' : 'SAR'} {stats.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500">
            <DollarSign size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between text-start group">
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'صافي الأرباح (٣٥٪)' : 'Net Profit (35%)'}</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {isArabic ? 'ر.س' : 'SAR'} {stats.netProfit.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-500">
            <FileText size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between text-start group">
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'ضريبة القيمة المضافة (١٥٪)' : 'Estimated VAT (15%)'}</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {isArabic ? 'ر.س' : 'SAR'} {summary.vat.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-500">
            <AlertCircle size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between text-start group">
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'مدفوعات الشركاء المعلقة' : 'Pending Provider Payouts'}</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {isArabic ? 'ر.س' : 'SAR'} {summary.payout.toLocaleString()}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-500">
            <CreditCard size={18} />
          </div>
        </div>
      </section>

      {/* Line Chart Trend */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-2 mb-6 text-start">
          <div className="p-1 rounded bg-orange-100 dark:bg-orange-950/20 text-orange-500">
            <TrendingUp size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {isArabic ? 'منحنى نمو الإيرادات السنوي' : 'Annual Growth & Cashflow Curve'}
          </h3>
        </div>
        <LineChart data={chartData} color="#f97316" />
      </section>

      {/* Transaction Table */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden">
        
        {/* Controls */}
        <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative w-64 max-w-full group">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث برقم العملية أو العميل...' : 'Search transaction, client...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold">
            {([
              { key: 'all', ar: 'الكل', en: 'All' },
              { key: 'paid', ar: 'مقبولة', en: 'Paid' },
              { key: 'pending', ar: 'معلقة', en: 'Pending' },
              { key: 'failed', ar: 'فاشلة', en: 'Failed' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1 rounded-md transition-all ${
                  statusFilter === tab.key 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                }`}
              >
                {isArabic ? tab.ar : tab.en}
              </button>
            ))}
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start" dir={isArabic ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-[11px] font-extrabold border-b border-slate-50 dark:border-slate-800/60 uppercase tracking-wider">
                <th className="px-6 py-3 text-start">TXN ID</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'العميل' : 'Customer'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'المبلغ' : 'Amount'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'وسيلة الدفع' : 'Payment Method'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'التاريخ' : 'Date'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-3 text-center">{isArabic ? 'تفاصيل' : 'Details'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((txn) => (
                  <tr 
                    key={txn.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-400 text-xs">
                      {txn.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 text-xs">
                      {txn.customer}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 dark:text-slate-100 text-xs">
                      {isArabic ? 'ر.س' : 'SAR'} {txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {txn.method}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {txn.date}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(txn.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toast.info(isArabic ? `عرض الفاتورة لـ ${txn.id}` : `Viewing invoice for: ${txn.id}`)}
                        className="text-xs text-orange-500 font-semibold hover:text-orange-600"
                      >
                        {isArabic ? 'عرض الفاتورة' : 'View Invoice'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
                    {isArabic ? 'لم يتم العثور على أي عمليات مالية' : 'No transactions found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  )
}
