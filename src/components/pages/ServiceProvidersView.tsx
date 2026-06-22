import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Star, Award, Navigation, CheckCircle2, ChevronRight, ChevronLeft, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useOutletContext } from 'react-router-dom'
import api from '../../lib/api'
import { ProviderDetailsModal } from '../ProviderDetailsModal'

interface Provider {
  _id: string
  id?: string
  name: string
  email?: string
  phoneNumber?: string
  serviceType: string
  status: string
  rating?: number
  trips?: number
  city?: string
  region?: string
  imageProfile?: string
  avatar?: string
  verified?: boolean
}

interface ServiceProvidersViewProps {
  isArabic?: boolean
}

export const ServiceProvidersView: React.FC<ServiceProvidersViewProps> = ({ isArabic: propIsArabic }) => {
  const context = useOutletContext<{ isArabic: boolean }>()
  const isArabic = propIsArabic !== undefined ? propIsArabic : (context?.isArabic ?? true)

  const [providers, setProviders] = useState<Provider[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProviders, setTotalProviders] = useState(0)

  const [searchQuery, setSearchQuery] = useState('')
  const [serviceFilter, setServiceFilter] = useState<'all' | 'moving' | 'towing' | 'pest'>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Fetch Providers list from API
  const fetchProviders = async () => {
    try {
      setLoading(true)
      const params: any = {
        page,
        limit: 8 // limit to 8 for grid layout to fit nicely
      }

      if (searchQuery) {
        params.search = searchQuery
      }

      if (serviceFilter !== 'all') {
        const mapping: Record<string, string> = {
          moving: 'نقل أثاث',
          towing: 'سحب سيارة',
          pest: 'مكافحة حشرات',
        }
        params.serviceType = mapping[serviceFilter]
      }

      if (statusFilter !== 'all') {
        params.status = statusFilter
      }

      const response = await api.get('/admin/providers', { params })
      const resData = response.data
      setProviders(resData.data || [])
      setTotalPages(resData.pages || 1)
      setTotalProviders(resData.total || 0)
    } catch (error) {
      console.error('Error fetching providers:', error)
      toast.error(isArabic ? 'فشل في تحميل مزودي الخدمة' : 'Failed to load service providers')
    } finally {
      setLoading(false)
    }
  }

  // Reload when page, search query, or filters change
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProviders()
    }, 300)
    return () => clearTimeout(timer)
  }, [page, searchQuery, serviceFilter, statusFilter])

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1)
  }, [searchQuery, serviceFilter, statusFilter])

  // Helper Translation
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

  const getStatusBadge = (status: string) => {
    const s = (status || '').toLowerCase()
    switch (s) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
            {isArabic ? 'متصل' : 'Online'}
          </span>
        )
      case 'in_trip':
      case 'in progress':
      case 'in_progress':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
            {isArabic ? 'في مهمة' : 'In Trip'}
          </span>
        )
      case 'approved':
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
            {isArabic ? 'مقبول / نشط' : 'Approved'}
          </span>
        )
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
            {isArabic ? 'قيد المراجعة' : 'Pending'}
          </span>
        )
      case 'suspended':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
            {isArabic ? 'موقوف' : 'Suspended'}
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
            {isArabic ? 'مرفوض' : 'Rejected'}
          </span>
        )
      case 'offline':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            <span className="h-1.5 w-1.5 rounded-full bg-slate-400"></span>
            {isArabic ? 'غير متصل' : 'Offline'}
          </span>
        )
    }
  }

  // Sub-metrics derived from current state and total
  const statsCount = useMemo(() => {
    return {
      total: totalProviders,
      active: providers.filter(p => p.status === 'approved' || p.status === 'active' || p.status === 'online').length,
      pending: providers.filter(p => p.status === 'pending').length,
    }
  }, [providers, totalProviders])

  return (
    <div className="space-y-6">
      
      {/* Metric summaries */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Navigation size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'إجمالي المزودين' : 'Total Service Providers'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{statsCount.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-500">
            <Award size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'المزودين النشطين (الصفحة الحالية)' : 'Active Providers (Current Page)'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{statsCount.active}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/20 text-amber-500">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'طلبات الانضمام المعلقة' : 'Pending Registrations'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{statsCount.pending}</p>
          </div>
        </div>
      </section>

      {/* Control filters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* Search bar */}
          <div className="relative w-64 max-w-full group">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث باسم المزود أو الهاتف...' : 'Search provider, phone...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Status selector filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          >
            <option value="all">{isArabic ? 'كل الحالات' : 'All Statuses'}</option>
            <option value="approved">{isArabic ? 'مقبول / نشط' : 'Approved'}</option>
            <option value="pending">{isArabic ? 'قيد المراجعة' : 'Pending'}</option>
            <option value="suspended">{isArabic ? 'موقوف' : 'Suspended'}</option>
            <option value="rejected">{isArabic ? 'مرفوض' : 'Rejected'}</option>
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
            {([
              { key: 'all', ar: 'الكل', en: 'All' },
              { key: 'moving', ar: 'نقل أثاث', en: 'Moving' },
              { key: 'towing', ar: 'سحب سيارة', en: 'Towing' },
              { key: 'pest', ar: 'مكافحة حشرات', en: 'Pest Control' },
            ] as const).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setServiceFilter(tab.key)}
                className={`px-3 py-1 rounded-md transition-all ${
                  serviceFilter === tab.key 
                    ? 'bg-orange-500 text-white shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                }`}
              >
                {isArabic ? tab.ar : tab.en}
              </button>
            ))}
          </div>

          <button
            onClick={() => toast.info(isArabic ? 'المزودين يسجلون من خلال تطبيق الهاتف فقط' : 'Providers onboarding happens via the mobile app only')}
            className="flex items-center gap-1.5 bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/15"
          >
            <Plus size={14} />
            <span>{isArabic ? 'إضافة مزود' : 'Add Provider'}</span>
          </button>
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-12 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw className="animate-spin mb-4" size={28} />
          <p className="text-sm font-semibold">{isArabic ? 'جاري تحميل مزودي الخدمة...' : 'Loading providers...'}</p>
        </div>
      ) : (
        <>
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {providers.length > 0 ? (
              providers.map((prov) => (
                <div 
                  key={prov._id || prov.id} 
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group text-start relative overflow-hidden"
                >
                  <div>
                    {/* Status pin badge */}
                    <div className="absolute top-4 end-4">
                      {getStatusBadge(prov.status)}
                    </div>

                    {/* Profile detail */}
                    <div className="flex items-center gap-3.5 mb-4">
                      <div className="relative">
                        <img 
                          src={prov.imageProfile || prov.avatar || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'} 
                          alt={prov.name} 
                          className="w-12 h-12 rounded-full object-cover border border-slate-100 group-hover:border-orange-500 transition-colors" 
                        />
                        {prov.status === 'approved' && (
                          <span className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border border-white ring-1 ring-blue-500/50">
                            <Award size={10} />
                          </span>
                        )}
                      </div>
                      <div className="truncate pr-8">
                        <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                          {prov.name}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">ID: {prov._id || prov.id}</p>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="space-y-2.5 my-4">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">{isArabic ? 'الخدمة' : 'Service'}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                          {translateService(prov.serviceType)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">{isArabic ? 'المدينة' : 'City'}</span>
                        <span className="font-bold text-slate-700 dark:text-slate-200">
                          {translateRegion(prov.city || prov.region || '')}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">{isArabic ? 'التقييم' : 'Customer Rating'}</span>
                        <span className="font-extrabold text-orange-500 flex items-center gap-1">
                          <Star size={12} fill="#f97316" stroke="none" />
                          {(prov.rating ?? 5.0).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="border-t border-slate-50 dark:border-slate-800/60 pt-4 flex gap-2">
                    <button 
                      onClick={() => {
                        const messageText = isArabic 
                          ? `رقم هاتف المزود ${prov.name} هو: ${prov.phoneNumber || 'غير متوفر'}` 
                          : `Provider ${prov.name} phone number is: ${prov.phoneNumber || 'Not Available'}`;
                        toast.info(messageText)
                      }}
                      className="flex-1 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    >
                      {isArabic ? 'اتصال' : 'Call'}
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedProviderId(prov._id || prov.id || null)
                        setIsDetailsOpen(true)
                      }}
                      className="flex-1 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm shadow-orange-500/10"
                    >
                      {isArabic ? 'التفاصيل' : 'Details'}
                    </button>
                  </div>

                </div>
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-slate-400 dark:text-slate-500 font-semibold bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
                {isArabic ? 'لم يتم العثور على أي مزودي خدمة' : 'No service providers found'}
              </div>
            )}
          </section>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-4" dir={isArabic ? 'rtl' : 'ltr'}>
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
        </>
      )}

      {/* Details modal */}
      <ProviderDetailsModal
        isOpen={isDetailsOpen}
        onClose={() => {
          setIsDetailsOpen(false)
          setSelectedProviderId(null)
        }}
        providerId={selectedProviderId}
        isArabic={isArabic}
        onSuccess={fetchProviders}
      />

    </div>
  )
}
