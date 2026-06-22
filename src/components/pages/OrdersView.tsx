import React, { useState, useMemo, useEffect } from 'react'
import { Plus, Search, Eye, MoreVertical, ShoppingBag, CheckCircle, AlertCircle, XCircle, ChevronRight, ChevronLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useOutletContext } from 'react-router-dom'
import api from '../../lib/api'
import { OrderDetailsModal } from '../OrderDetailsModal'
import { ManageOrderModal } from '../ManageOrderModal'

interface Order {
  _id: string
  id?: string
  service: string
  customer: any
  provider?: any
  region: string
  date: string
  createdAt?: string
  status: string
  price: number
  totalPrice?: number
}

export const OrdersView: React.FC = () => {
  const { isArabic } = useOutletContext<{ isArabic: boolean }>()
  
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalOrders, setTotalOrders] = useState(0)
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [manageOrderId, setManageOrderId] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchOrders = async () => {
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

      const response = await api.get('/admin/orders', { params })
      setOrders(response.data.data || [])
      setTotalPages(response.data.pages || 1)
      setTotalOrders(response.data.total || 0)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error(isArabic ? 'فشل في تحميل الطلبات' : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  // Fetch orders when page, search, or status changes
  // Note: For search, a debounce would be ideal, but for simplicity we rely on the search button or enter key if needed, or just fetch on every stroke if the API is fast.
  useEffect(() => {
    // Reset to page 1 if search or status changes
    const timer = setTimeout(() => {
      fetchOrders()
    }, 300)
    return () => clearTimeout(timer)
  }, [page, searchQuery, statusFilter])

  // Helper translations
  const translateService = (val: string) => {
    if (!val) return ''
    const mapping: Record<string, string> = {
      'نقل أثاث': 'Furniture Moving',
      'سحب سيارة': 'Car Towing',
      'مكافحة حشرات': 'Pest Control',
      'تنظيف منازل': 'Home Cleaning',
      'نقل بضائع': 'Goods Transport',
    }
    return isArabic ? val : (mapping[val] || val)
  }

  const translateRegion = (val: string) => {
    if (!val) return ''
    const mapping: Record<string, string> = {
      'الرياض': 'Riyadh',
      'جدة': 'Jeddah',
      'الدمام': 'Dammam',
      'مكة المكرمة': 'Makkah',
      'المدينة المنورة': 'Madinah',
    }
    return isArabic ? val : (mapping[val] || val)
  }

  const translateStatus = (val: string, toArabic = false) => {
    if (!val) return ''
    const norm = val.toLowerCase()
    
    if (toArabic) {
      if (norm === 'in_progress' || norm === 'in progress') return 'قيد التنفيذ'
      if (norm === 'completed') return 'مكتمل'
      if (norm === 'cancelled') return 'ملغي'
      if (norm === 'pending') return 'قيد الانتظار'
      if (norm === 'accepted') return 'مقبول'
      return val
    }
    
    if (norm === 'قيد التنفيذ') return 'In Progress'
    if (norm === 'مكتمل') return 'Completed'
    if (norm === 'ملغي') return 'Cancelled'
    if (norm === 'قيد الانتظار') return 'Pending'
    if (norm === 'مقبول') return 'Accepted'
    
    // Capitalize first letter
    return val.charAt(0).toUpperCase() + val.slice(1)
  }

  const getStatusBadge = (status: string) => {
    const norm = translateStatus(status, false).toLowerCase()
    
    switch (norm) {
      case 'in progress':
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            {isArabic ? 'قيد التنفيذ' : 'In Progress'}
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
            {isArabic ? 'مكتمل' : 'Completed'}
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {isArabic ? 'ملغي' : 'Cancelled'}
          </span>
        )
      case 'accepted':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400">
            {isArabic ? 'مقبول' : 'Accepted'}
          </span>
        )
      case 'pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {isArabic ? 'قيد الانتظار' : 'Pending'}
          </span>
        )
    }
  }

  // Sub-metrics counts based on current page (since we paginate)
  const subMetrics = useMemo(() => {
    const counts = { total: totalOrders, active: 0, completed: 0, revenue: 0 }
    orders.forEach((o) => {
      const norm = translateStatus(o.status, false).toLowerCase()
      if (norm === 'in progress' || norm === 'pending' || norm === 'in_progress' || norm === 'accepted') counts.active++
      if (norm === 'completed') counts.completed++
      if (norm !== 'cancelled') counts.revenue += (o.totalPrice || o.price || 0)
    })
    return counts
  }, [orders, totalOrders])

  return (
    <div className="space-y-6">
      
      {/* Mini metric summaries */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            <ShoppingBag size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'إجمالي الطلبات' : 'Total Orders'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{subMetrics.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-500">
            <AlertCircle size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'الطلبات النشطة' : 'Active Orders'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{subMetrics.active}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-500">
            <CheckCircle size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'الطلبات المكتملة' : 'Completed'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{subMetrics.completed}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-500">
            <XCircle size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'حجم المبيعات' : 'Order Revenue'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">
              {isArabic ? 'ر.س' : 'SAR'} {subMetrics.revenue.toLocaleString()}
            </p>
          </div>
        </div>
      </section>

      {/* Main Table Segment */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden">
        
        {/* Controls Panel */}
        <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Left search */}
          <div className="relative w-64 max-w-full group">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث عن طلب، عميل...' : 'Search order, customer...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Right tab filters & action */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
              {([
                { key: 'all', ar: 'الكل', en: 'All' },
                { key: 'in_progress', ar: 'قيد التنفيذ', en: 'In Progress' },
                { key: 'completed', ar: 'مكتمل', en: 'Completed' },
                { key: 'cancelled', ar: 'ملغي', en: 'Cancelled' },
                { key: 'pending', ar: 'قيد الانتظار', en: 'Pending' },
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

            <button
              onClick={() => toast.info(isArabic ? 'يجب إنشاء الطلبات من قبل العملاء عبر التطبيق.' : 'Orders must be created by customers via the app.')}
              className="flex items-center gap-1.5 bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/15"
            >
              <Plus size={14} />
              <span>{isArabic ? 'طلب جديد' : 'New Order'}</span>
            </button>
          </div>
        </div>

        {/* Table body */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start" dir={isArabic ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-[11px] font-extrabold border-b border-slate-50 dark:border-slate-800/60 uppercase tracking-wider">
                <th className="px-6 py-3 text-start">#</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'رقم الطلب' : 'Order No.'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'نوع الخدمة' : 'Service Type'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'العميل' : 'Customer'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'المنطقة' : 'Region'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'تاريخ الطلب' : 'Order Date'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'السعر' : 'Price'}</th>
                <th className="px-6 py-3 text-center">{isArabic ? 'الإجراء' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
                    {isArabic ? 'جاري التحميل...' : 'Loading...'}
                  </td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((order, idx) => (
                  <tr 
                    key={order._id || order.id || idx} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-400 text-xs">
                      {(page - 1) * 10 + idx + 1}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 text-xs">
                      {order._id || order.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-xs">
                      {translateService(order.service)}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 text-xs">
                      {typeof order.customer === 'object' && order.customer ? order.customer.name : order.customer || '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {translateRegion(order.region)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                      {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : order.date}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 dark:text-slate-100 text-xs">
                      {isArabic ? 'ر.س' : 'SAR'} {(order.totalPrice ?? order.price ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => setSelectedOrderId(order._id || order.id || null)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => setManageOrderId(order._id || order.id || null)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                          <MoreVertical size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
                    {isArabic ? 'لم يتم العثور على أي نتائج تطابق البحث' : 'No matching results found'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {totalPages > 1 && (
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

      <OrderDetailsModal
        isOpen={!!selectedOrderId}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
        isArabic={isArabic}
      />

      <ManageOrderModal
        isOpen={!!manageOrderId}
        onClose={() => setManageOrderId(null)}
        orderId={manageOrderId}
        isArabic={isArabic}
        onSuccess={fetchOrders}
      />
    </div>
  )
}
