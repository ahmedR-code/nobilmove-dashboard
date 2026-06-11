import React, { useState, useMemo } from 'react'
import { Plus, Search, Star, Award, Navigation, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

interface Provider {
  id: string
  name: string
  email: string
  serviceType: string
  status: 'online' | 'in_trip' | 'offline'
  rating: number
  trips: number
  region: string
  avatar: string
  verified: boolean
}

interface ServiceProvidersViewProps {
  isArabic: boolean
}

const providers: Provider[] = [
  {
    id: 'PROV01',
    name: 'ياسر القحطاني',
    email: 'yasser@nobilmove.com',
    serviceType: 'نقل أثاث',
    status: 'online',
    rating: 4.9,
    trips: 124,
    region: 'الرياض',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    verified: true
  },
  {
    id: 'PROV02',
    name: 'فيصل الزهراني',
    email: 'faisal@nobilmove.com',
    serviceType: 'سحب سيارة',
    status: 'in_trip',
    rating: 4.7,
    trips: 85,
    region: 'جدة',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    verified: true
  },
  {
    id: 'PROV03',
    name: 'طارق الشهري',
    email: 'tariq@nobilmove.com',
    serviceType: 'مكافحة حشرات',
    status: 'offline',
    rating: 4.8,
    trips: 42,
    region: 'الدمام',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    verified: false
  },
  {
    id: 'PROV04',
    name: 'عمر الغامدي',
    email: 'omar@nobilmove.com',
    serviceType: 'نقل أثاث',
    status: 'online',
    rating: 5.0,
    trips: 210,
    region: 'مكة المكرمة',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    verified: true
  }
]

export const ServiceProvidersView: React.FC<ServiceProvidersViewProps> = ({ isArabic }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [serviceFilter, setServiceFilter] = useState<'all' | 'moving' | 'towing' | 'pest'>('all')

  // Helper Translation
  const translateService = (val: string) => {
    const mapping: Record<string, string> = {
      'نقل أثاث': 'Furniture Moving',
      'سحب سيارة': 'Car Towing',
      'مكافحة حشرات': 'Pest Control',
    }
    return isArabic ? val : (mapping[val] || val)
  }

  const translateRegion = (val: string) => {
    const mapping: Record<string, string> = {
      'الرياض': 'Riyadh',
      'جدة': 'Jeddah',
      'الدمام': 'Dammam',
      'مكة المكرمة': 'Makkah',
    }
    return isArabic ? val : (mapping[val] || val)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-ping"></span>
            {isArabic ? 'متصل' : 'Online'}
          </span>
        )
      case 'in_trip':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
            {isArabic ? 'في مهمة' : 'In Trip'}
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

  // Filter
  const filteredProviders = useMemo(() => {
    return providers.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase())

      if (!matchesSearch) return false

      if (serviceFilter === 'all') return true
      if (serviceFilter === 'moving') return p.serviceType === 'نقل أثاث'
      if (serviceFilter === 'towing') return p.serviceType === 'سحب سيارة'
      if (serviceFilter === 'pest') return p.serviceType === 'مكافحة حشرات'

      return true
    })
  }, [searchQuery, serviceFilter])

  const statsCount = useMemo(() => {
    return {
      total: providers.length,
      active: providers.filter(p => p.status === 'online' || p.status === 'in_trip').length,
      verified: providers.filter(p => p.verified).length,
    }
  }, [])

  return (
    <div className="space-y-6">
      
      {/* Metric summaries */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Navigation size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'إجمالي المزودين' : 'Total Service Providers'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{statsCount.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-500">
            <Award size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'المزودين النشطين' : 'Active Providers'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{statsCount.active}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-blue-50 dark:bg-blue-950/20 text-blue-500">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'المزودين الموثقين' : 'Verified Providers'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{statsCount.verified}</p>
          </div>
        </div>
      </section>

      {/* Control filters */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="relative w-64 max-w-full group">
          <Search className="absolute start-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder={isArabic ? 'بحث باسم المزود، المنطقة...' : 'Search provider, region...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold">
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
            onClick={() => toast.info(isArabic ? 'تسجيل مزود جديد قريباً!' : 'Provider onboarding form coming soon!')}
            className="flex items-center gap-1.5 bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/15"
          >
            <Plus size={14} />
            <span>{isArabic ? 'إضافة مزود' : 'Add Provider'}</span>
          </button>
        </div>
      </div>

      {/* Grid List */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProviders.length > 0 ? (
          filteredProviders.map((prov) => (
            <div 
              key={prov.id} 
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
                    <img src={prov.avatar} alt={prov.name} className="w-12 h-12 rounded-full object-cover border border-slate-100 group-hover:border-orange-500 transition-colors" />
                    {prov.verified && (
                      <span className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-0.5 border border-white ring-1 ring-blue-500/50">
                        <Award size={10} />
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                      {prov.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">ID: {prov.id}</p>
                  </div>
                </div>

                {/* Categories */}
                <div className="space-y-2.5 my-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">{isArabic ? 'الخدمة' : 'Service'}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded">
                      {translateService(prov.serviceType)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">{isArabic ? 'المنطقة النشطة' : 'Active Region'}</span>
                    <span className="font-bold text-slate-700 dark:text-slate-200">
                      {translateRegion(prov.region)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-semibold">{isArabic ? 'التقييم' : 'Customer Rating'}</span>
                    <span className="font-extrabold text-orange-500 flex items-center gap-1">
                      <Star size={12} fill="#f97316" stroke="none" />
                      {prov.rating.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="border-t border-slate-50 dark:border-slate-850/60 pt-4 flex gap-2">
                <button 
                  onClick={() => toast.info(isArabic ? `مراسلة المزود: ${prov.name}` : `Messaging provider: ${prov.name}`)}
                  className="flex-1 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  {isArabic ? 'مراسلة' : 'Message'}
                </button>
                <button 
                  onClick={() => toast.info(isArabic ? `تفاصيل المزود: ${prov.name}` : `Viewing details: ${prov.name}`)}
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

    </div>
  )
}
