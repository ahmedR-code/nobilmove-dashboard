import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Eye, ShieldAlert, Users, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useOutletContext } from 'react-router-dom'
import api from '../../lib/api'
import { CustomerDetailsModal } from '../CustomerDetailsModal'

interface Customer {
  _id: string
  id?: string
  name: string
  userName?: string
  username?: string
  email?: string
  phoneNumber?: string
  imageProfile?: string
  avatar?: string
  status: string
  createdAt?: string
}

interface CustomersViewProps {
  isArabic?: boolean
}

export const CustomersView: React.FC<CustomersViewProps> = ({ isArabic: propIsArabic }) => {
  const context = useOutletContext<{ isArabic: boolean }>()
  const isArabic = propIsArabic !== undefined ? propIsArabic : (context?.isArabic ?? true)

  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCustomers, setTotalCustomers] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'suspended'>('all')

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Fetch Customers list from API
  const fetchCustomers = async () => {
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

      const response = await api.get('/admin/customers', { params })
      const resData = response.data
      setCustomers(resData.data || [])
      setTotalPages(resData.pages || 1)
      setTotalCustomers(resData.total || 0)
    } catch (error) {
      console.error('Error fetching customers:', error)
      toast.error(isArabic ? 'فشل في تحميل العملاء' : 'Failed to load customers')
    } finally {
      setLoading(false)
    }
  }

  // Reload when page, search query, or status filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCustomers()
    }, 300)
    return () => clearTimeout(timer)
  }, [page, searchQuery, statusFilter])

  // Reset page when filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, statusFilter])

  const statsCount = useMemo(() => {
    return {
      total: totalCustomers,
      suspended: customers.filter(c => c.status === 'suspended').length,
      active: customers.filter(c => c.status !== 'suspended').length
    }
  }, [customers, totalCustomers])

  return (
    <div className="space-y-6">
      
      {/* Metric summaries */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Users size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'إجمالي العملاء' : 'Total Customers'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{statsCount.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-500">
            <CheckCircle2Icon size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'النشطين (الصفحة الحالية)' : 'Active (Current Page)'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{statsCount.active}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500">
            <ShieldAlert size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'الموقوفين (الصفحة الحالية)' : 'Suspended (Current Page)'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{statsCount.suspended}</p>
          </div>
        </div>
      </section>

      {/* Control filters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative w-64 max-w-full group">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث باسم العميل أو رقم الهاتف...' : 'Search customer, phone...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Status filter selection */}
          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === 'all' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
              }`}
            >
              {isArabic ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setStatusFilter('suspended')}
              className={`px-3 py-1 rounded-md transition-all ${
                statusFilter === 'suspended' 
                  ? 'bg-orange-500 text-white shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
              }`}
            >
              {isArabic ? 'الموقوفين' : 'Suspended'}
            </button>
          </div>
        </div>

        <button
          onClick={() => toast.info(isArabic ? 'العملاء يسجلون من خلال التطبيق فقط' : 'Customers registration is handled via mobile app only')}
          className="flex items-center gap-1.5 bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/15"
        >
          <Plus size={14} />
          <span>{isArabic ? 'إضافة عميل' : 'Add Customer'}</span>
        </button>
      </div>

      {/* Table view */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-12 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw className="animate-spin mb-4" size={28} />
          <p className="text-sm font-semibold">{isArabic ? 'جاري تحميل العملاء...' : 'Loading customers...'}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden text-start">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">{isArabic ? 'العميل' : 'Customer'}</th>
                  <th className="px-6 py-4">{isArabic ? 'اسم المستخدم' : 'Username'}</th>
                  <th className="px-6 py-4">{isArabic ? 'رقم الهاتف' : 'Phone'}</th>
                  <th className="px-6 py-4">{isArabic ? 'تاريخ التسجيل' : 'Registered On'}</th>
                  <th className="px-6 py-4">{isArabic ? 'الحالة' : 'Status'}</th>
                  <th className="px-6 py-4 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {customers.length > 0 ? (
                  customers.map((c) => (
                    <tr key={c._id || c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img
                          src={c.imageProfile || c.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'}
                          alt={c.name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-100 dark:border-slate-750"
                        />
                        <div className="font-semibold text-slate-800 dark:text-slate-100">{c.name}</div>
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-500 dark:text-slate-400">{c.userName || c.username || '-'}</td>
                      <td className="px-6 py-4 font-semibold" dir="ltr">{c.phoneNumber || '-'}</td>
                      <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                        {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-bold ${
                          c.status === 'suspended'
                            ? 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
                            : 'bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400'
                        }`}>
                          {c.status === 'suspended' ? (isArabic ? 'موقوف' : 'Suspended') : (isArabic ? 'نشط' : 'Active')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => {
                            setSelectedCustomerId(c._id || c.id || null)
                            setIsDetailsOpen(true)
                          }}
                          className="p-1 text-slate-400 hover:text-orange-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors inline-flex items-center gap-1 font-semibold"
                        >
                          <Eye size={16} />
                          <span>{isArabic ? 'التفاصيل' : 'Details'}</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
                      {isArabic ? 'لم يتم العثور على أي عملاء' : 'No customers found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-4" dir={isArabic ? 'rtl' : 'ltr'}>
              <button
                onClick={() => setPage(p => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-slate-900"
              >
                {isArabic ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                <span>{isArabic ? 'السابق' : 'Previous'}</span>
              </button>

              <span className="text-xs font-bold text-slate-500">
                {isArabic ? `صفحة ${page} من ${totalPages}` : `Page ${page} of ${totalPages}`}
              </span>

              <button
                onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all disabled:opacity-50 disabled:hover:bg-white dark:disabled:hover:bg-slate-900"
              >
                <span>{isArabic ? 'التالي' : 'Next'}</span>
                {isArabic ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Details modal */}
      <CustomerDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedCustomerId(null)
        }}
        customerId={selectedCustomerId}
        isArabic={isArabic}
        onSuccess={fetchCustomers}
      />

    </div>
  )
}

// Small helper component to avoid checkcircle import error
const CheckCircle2Icon: React.FC<{ size?: number }> = ({ size = 16 }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="lucide lucide-check-circle-2"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}
