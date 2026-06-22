import React, { useState, useMemo, useEffect } from 'react'
import { DollarSign, FileText, AlertCircle, Search, TrendingUp, CreditCard, ChevronRight, ChevronLeft, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import { useOutletContext } from 'react-router-dom'
import api from '../../lib/api'
import { LineChart } from '../DashboardCharts'

interface Transaction {
  _id: string
  id?: string
  customer?: any
  customerName?: string
  amount: number
  method: string
  createdAt?: string
  date?: string
  status: string
}

interface RevenueData {
  totalRevenue: number
  totalTransactions: number
  vat: number
  profit: number
  pendingPayments: number
}

interface FinancialSummary {
  orders: {
    total: number
    completed: number
    cancelled: number
    completionRate: number
  }
  revenue: {
    total: number
    profit: number
    tax: number
  }
}

export const FinancialReportsView: React.FC = () => {
  const { isArabic } = useOutletContext<{ isArabic: boolean }>()

  const [revenueData, setRevenueData] = useState<RevenueData | null>(null)
  const [summaryData, setSummaryData] = useState<FinancialSummary | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [metricsLoading, setMetricsLoading] = useState(true)

  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchMetrics = async () => {
    try {
      setMetricsLoading(true)
      const [revRes, sumRes] = await Promise.all([
        api.get('/admin/reports/revenue'),
        api.get('/admin/reports/financial-summary')
      ])
      setRevenueData(revRes.data)
      setSummaryData(sumRes.data)
    } catch (error) {
      console.error('Error fetching financial metrics:', error)
      toast.error(isArabic ? 'فشل في تحميل البيانات المالية الإجمالية' : 'Failed to load financial summary metrics')
    } finally {
      setMetricsLoading(false)
    }
  }

  const fetchTransactions = async () => {
    try {
      setLoading(true)
      const params: any = {
        page,
        limit: 10
      }
      
      if (searchQuery) {
        params.search = searchQuery
      }
      
      if (statusFilter !== 'all') {
        params.status = statusFilter
      }

      const response = await api.get('/admin/reports/transactions', { params })
      setTransactions(response.data.data || [])
      setTotalPages(response.data.pages || 1)
    } catch (error) {
      console.error('Error fetching transactions:', error)
      toast.error(isArabic ? 'فشل في تحميل العمليات المالية' : 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }

  // Load metrics once on mount
  useEffect(() => {
    fetchMetrics()
  }, [])

  // Load transactions when filters or page changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTransactions()
    }, 300)
    return () => clearTimeout(timer)
  }, [page, searchQuery, statusFilter])

  // Reset to first page when search or filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter])

  // Chart data calculation
  const totalRev = revenueData?.totalRevenue ?? 0
  const chartData = useMemo(() => [
    { label: isArabic ? 'يناير' : 'Jan', value: Math.round(totalRev * 0.4) },
    { label: isArabic ? 'فبراير' : 'Feb', value: Math.round(totalRev * 0.6) },
    { label: isArabic ? 'مارس' : 'Mar', value: Math.round(totalRev * 0.75) },
    { label: isArabic ? 'أبريل' : 'Apr', value: Math.round(totalRev * 0.9) },
    { label: isArabic ? 'مايو' : 'May', value: totalRev },
  ], [totalRev, isArabic])

  const getStatusBadge = (status: string) => {
    if (!status) return null
    const norm = status.toLowerCase()
    switch (norm) {
      case 'paid':
      case 'success':
      case 'completed':
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

  const getMethodName = (method: string) => {
    if (!method) return ''
    const norm = method.toLowerCase()
    if (norm.includes('mada')) return isArabic ? 'مدى (Mada)' : 'Mada Card'
    if (norm.includes('visa')) return isArabic ? 'فيزا (Visa)' : 'Visa Card'
    if (norm.includes('apple')) return isArabic ? 'أبل باي (Apple Pay)' : 'Apple Pay'
    if (norm.includes('cash')) return isArabic ? 'نقداً' : 'Cash'
    return method
  }

  return (
    <div className="space-y-6">
      
      {/* Metric summaries */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between text-start group">
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'إجمالي المبيعات' : 'Total Revenue'}</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {metricsLoading ? '...' : `${isArabic ? 'ر.س' : 'SAR'} ${(revenueData?.totalRevenue ?? 0).toLocaleString()}`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500">
            <DollarSign size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between text-start group">
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'صافي الأرباح' : 'Net Profit'}</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {metricsLoading ? '...' : `${isArabic ? 'ر.س' : 'SAR'} ${(revenueData?.profit ?? 0).toLocaleString()}`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-500">
            <FileText size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between text-start group">
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'ضريبة القيمة المضافة المقدرة' : 'Estimated VAT'}</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {metricsLoading ? '...' : `${isArabic ? 'ر.س' : 'SAR'} ${(revenueData?.vat ?? 0).toLocaleString()}`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-500">
            <AlertCircle size={18} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between text-start group">
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'مدفوعات الشركاء المعلقة' : 'Pending Provider Payouts'}</p>
            <p className="text-xl font-black text-slate-800 dark:text-slate-100 mt-1">
              {metricsLoading ? '...' : `${isArabic ? 'ر.س' : 'SAR'} ${(revenueData?.pendingPayments ?? 0).toLocaleString()}`}
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-500">
            <CreditCard size={18} />
          </div>
        </div>
      </section>

      {/* Order Summary Stats Panel */}
      {summaryData && (
        <section className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-start">
            <div className="p-1 rounded bg-blue-100 dark:bg-blue-950/20 text-blue-500">
              <BarChart3 size={16} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
              {isArabic ? 'إحصائيات عمليات الطلبات' : 'Order Operation Statistics'}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-start p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <p className="text-xs text-slate-400 font-bold">{isArabic ? 'إجمالي الطلبات' : 'Total Orders'}</p>
              <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-1">
                {summaryData.orders?.total ?? 0}
              </p>
            </div>
            <div className="text-start p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <p className="text-xs text-slate-400 font-bold">{isArabic ? 'الطلبات المكتملة' : 'Completed Orders'}</p>
              <p className="text-lg font-black text-green-600 dark:text-green-400 mt-1">
                {summaryData.orders?.completed ?? 0}
              </p>
            </div>
            <div className="text-start p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <p className="text-xs text-slate-400 font-bold">{isArabic ? 'الطلبات الملغاة' : 'Cancelled Orders'}</p>
              <p className="text-lg font-black text-red-600 dark:text-red-400 mt-1">
                {summaryData.orders?.cancelled ?? 0}
              </p>
            </div>
            <div className="text-start p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl">
              <p className="text-xs text-slate-400 font-bold">{isArabic ? 'معدل إكمال الطلبات' : 'Completion Rate'}</p>
              <p className="text-lg font-black text-blue-600 dark:text-blue-400 mt-1">
                {Math.round(summaryData.orders?.completionRate ?? 0)}%
              </p>
            </div>
          </div>
        </section>
      )}

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

          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
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
                <th className="px-6 py-3 text-start">{isArabic ? 'رقم العملية' : 'TXN ID'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'العميل' : 'Customer'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'المبلغ' : 'Amount'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'وسيلة الدفع' : 'Payment Method'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'التاريخ' : 'Date'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-3 text-center">{isArabic ? 'تفاصيل' : 'Details'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
                    {isArabic ? 'جاري التحميل...' : 'Loading...'}
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((txn, idx) => (
                  <tr 
                    key={txn._id || txn.id || idx} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-400 text-xs">
                      {txn._id || txn.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 text-xs">
                      {typeof txn.customer === 'object' && txn.customer ? txn.customer.name : txn.customer || txn.customerName || '-'}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 dark:text-slate-100 text-xs">
                      {isArabic ? 'ر.س' : 'SAR'} {txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {getMethodName(txn.method)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                      {txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : txn.date || ''}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(txn.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => toast.info(isArabic ? `عرض الفاتورة لـ ${txn._id || txn.id}` : `Viewing invoice for: ${txn._id || txn.id}`)}
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

        {/* Pagination Footer */}
        {!loading && totalPages > 1 && (
          <div className="p-4 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {isArabic ? 'صفحة' : 'Page'} <span className="font-bold text-slate-800 dark:text-slate-200">{page}</span> {isArabic ? 'من' : 'of'} <span className="font-bold text-slate-800 dark:text-slate-200">{totalPages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                {isArabic ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </button>
              <button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                {isArabic ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
              </button>
            </div>
          </div>
        )}
      </section>

    </div>
  )
}
