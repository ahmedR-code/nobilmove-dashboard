import React, { useState, useMemo } from 'react'
import { Plus, Search, Eye, MoreVertical, ShoppingBag, CheckCircle, AlertCircle, XCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Order {
  id: string
  service: string
  customer: string
  region: string
  date: string
  status: string
  price: number
}

interface OrdersViewProps {
  isArabic: boolean
  orders: Order[]
  setIsModalOpen: (open: boolean) => void
}

export const OrdersView: React.FC<OrdersViewProps> = ({
  isArabic,
  orders,
  setIsModalOpen,
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'in_progress' | 'completed' | 'cancelled' | 'pending'>('all')

  // Helper translations
  const translateService = (val: string) => {
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
    const mapping: Record<string, string> = {
      'قيد التنفيذ': 'In Progress',
      'مكتمل': 'Completed',
      'ملغي': 'Cancelled',
      'قيد الانتظار': 'Pending',
    }
    if (toArabic) {
      return Object.keys(mapping).find(key => mapping[key] === val) || val
    }
    return mapping[val] || val
  }

  const getStatusBadge = (status: string) => {
    const norm = translateStatus(status, false) // Normalize to English
    
    switch (norm) {
      case 'In Progress':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            {isArabic ? 'قيد التنفيذ' : 'In Progress'}
          </span>
        )
      case 'Completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
            {isArabic ? 'مكتمل' : 'Completed'}
          </span>
        )
      case 'Cancelled':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {isArabic ? 'ملغي' : 'Cancelled'}
          </span>
        )
      case 'Pending':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            {isArabic ? 'قيد الانتظار' : 'Pending'}
          </span>
        )
    }
  }

  // Filter orders
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      // Search filter
      const matchesSearch = 
        o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.region.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (!matchesSearch) return false

      // Status filter
      const normStatus = translateStatus(o.status, false)
      if (statusFilter === 'all') return true
      if (statusFilter === 'in_progress') return normStatus === 'In Progress'
      if (statusFilter === 'completed') return normStatus === 'Completed'
      if (statusFilter === 'cancelled') return normStatus === 'Cancelled'
      if (statusFilter === 'pending') return normStatus === 'Pending'

      return true
    })
  }, [orders, searchQuery, statusFilter])

  // Sub-metrics counts
  const subMetrics = useMemo(() => {
    const counts = { total: orders.length, active: 0, completed: 0, revenue: 0 }
    orders.forEach((o) => {
      const norm = translateStatus(o.status, false)
      if (norm === 'In Progress' || norm === 'Pending') counts.active++
      if (norm === 'Completed') counts.completed++
      if (norm !== 'Cancelled') counts.revenue += o.price
    })
    return counts
  }, [orders])

  return (
    <div className="space-y-6">
      
      {/* Mini metric summaries */}
      <section className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            <ShoppingBag size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'إجمالي الطلبات' : 'Total Orders'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{subMetrics.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-500">
            <AlertCircle size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'الطلبات النشطة' : 'Active Orders'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{subMetrics.active}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-500">
            <CheckCircle size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'الطلبات المكتملة' : 'Completed'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{subMetrics.completed}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-500">
            <XCircle size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'حجم المبيعات' : 'Order Revenue'}</p>
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
            <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold">
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
              onClick={() => setIsModalOpen(true)}
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
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, idx) => (
                  <tr 
                    key={order.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-400 text-xs">
                      {filteredOrders.length - idx}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 text-xs">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-300 text-xs">
                      {translateService(order.service)}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 text-xs">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">
                      {translateRegion(order.region)}
                    </td>
                    <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs whitespace-nowrap">
                      {order.date}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 font-black text-slate-800 dark:text-slate-100 text-xs">
                      {isArabic ? 'ر.س' : 'SAR'} {order.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => toast.info(isArabic ? `تفاصيل الطلب: ${order.id}` : `Details of order: ${order.id}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => toast.info(isArabic ? `تعديل الطلب: ${order.id}` : `Edit order: ${order.id}`)}
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
      </section>

    </div>
  )
}
