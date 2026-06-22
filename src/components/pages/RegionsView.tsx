import React, { useState, useMemo } from 'react'
import { Plus, Search, MapPin, Users, Activity, Clock, MoreVertical, Compass } from 'lucide-react'
import { toast } from 'sonner'

interface Region {
  id: string
  nameAr: string
  nameEn: string
  providers: number
  activeOrders: number
  status: 'fully_covered' | 'low_supply' | 'out_of_service'
  avgTime: string
}

interface RegionsViewProps {
  isArabic: boolean
}

const regions: Region[] = [
  {
    id: 'REG001',
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    providers: 48,
    activeOrders: 12,
    status: 'fully_covered',
    avgTime: '25 min'
  },
  {
    id: 'REG002',
    nameAr: 'جدة',
    nameEn: 'Jeddah',
    providers: 34,
    activeOrders: 8,
    status: 'fully_covered',
    avgTime: '30 min'
  },
  {
    id: 'REG003',
    nameAr: 'الدمام',
    nameEn: 'Dammam',
    providers: 18,
    activeOrders: 3,
    status: 'low_supply',
    avgTime: '45 min'
  },
  {
    id: 'REG004',
    nameAr: 'مكة المكرمة',
    nameEn: 'Makkah',
    providers: 22,
    activeOrders: 5,
    status: 'fully_covered',
    avgTime: '35 min'
  },
  {
    id: 'REG005',
    nameAr: 'المدينة المنورة',
    nameEn: 'Madinah',
    providers: 6,
    activeOrders: 0,
    status: 'out_of_service',
    avgTime: '--'
  }
]

export const RegionsView: React.FC<RegionsViewProps> = ({ isArabic }) => {
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'fully_covered':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
            {isArabic ? 'تغطية كاملة' : 'Fully Covered'}
          </span>
        )
      case 'low_supply':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-600 dark:bg-yellow-950/40 dark:text-yellow-400">
            {isArabic ? 'نقص مزودين' : 'Low Supply'}
          </span>
        )
      case 'out_of_service':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {isArabic ? 'خارج الخدمة' : 'Out of Service'}
          </span>
        )
    }
  }

  // Filter
  const filteredRegions = useMemo(() => {
    return regions.filter((r) => {
      const query = searchQuery.toLowerCase()
      return (
        r.nameAr.toLowerCase().includes(query) ||
        r.nameEn.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query)
      )
    })
  }, [searchQuery])

  const summary = useMemo(() => {
    return {
      total: regions.length,
      fullyCovered: regions.filter(r => r.status === 'fully_covered').length,
      activeOrders: regions.reduce((sum, r) => sum + r.activeOrders, 0)
    }
  }, [])

  return (
    <div className="space-y-6">
      
      {/* Metric Summaries */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Compass size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'إجمالي المناطق' : 'Total Coverage Areas'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{summary.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-500">
            <MapPin size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'المناطق المغطاة بالكامل' : 'Fully Covered Regions'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{summary.fullyCovered}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-500">
            <Activity size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'الطلبات الجارية بالمناطق' : 'Total Active Orders'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{summary.activeOrders}</p>
          </div>
        </div>
      </section>

      {/* Control Filters */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden">
        
        {/* Controls */}
        <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative w-64 max-w-full group">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث عن منطقة...' : 'Search region...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          <button
            onClick={() => toast.info(isArabic ? 'إضافة منطقة جديدة قريباً!' : 'Coverage area onboarding coming soon!')}
            className="flex items-center gap-1.5 bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/15"
          >
            <Plus size={14} />
            <span>{isArabic ? 'تغطية منطقة جديدة' : 'Add Region'}</span>
          </button>
        </div>

        {/* Regions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start" dir={isArabic ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-[11px] font-extrabold border-b border-slate-50 dark:border-slate-800/60 uppercase tracking-wider">
                <th className="px-6 py-3 text-start">ID</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'المنطقة' : 'Region'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'عدد المزودين' : 'Providers Density'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'الطلبات النشطة' : 'Active Orders'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'متوسط زمن الاستجابة' : 'Avg response latency'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'حالة التغطية' : 'Coverage Status'}</th>
                <th className="px-6 py-3 text-center">{isArabic ? 'الإجراء' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredRegions.length > 0 ? (
                filteredRegions.map((region) => (
                  <tr 
                    key={region.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                      {region.id}
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-2 text-start">
                        <MapPin size={14} className="text-orange-500" />
                        <span>{isArabic ? region.nameAr : region.nameEn}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-slate-400" />
                        <span>{region.providers}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <Activity size={12} className="text-slate-400" />
                        <span>{region.activeOrders}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-slate-400" />
                        <span>{region.avgTime}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(region.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => toast.info(isArabic ? `تعديل إعدادات تغطية ${region.nameAr}` : `Modifying coverage: ${region.nameEn}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all"
                        >
                          <Compass size={14} />
                        </button>
                        <button 
                          onClick={() => toast.info(isArabic ? `خيارات إضافية لمنطقة ${region.nameAr}` : `More actions: ${region.nameEn}`)}
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
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
                    {isArabic ? 'لم يتم العثور على أي مناطق مغطاة' : 'No covered regions found'}
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
