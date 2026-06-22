import React, { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { 
  Box, 
  Truck, 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp, 
  Activity 
} from 'lucide-react'
import { LineChart, DonutChart } from '../DashboardCharts'
import api from '../../lib/api'
import { toast } from 'sonner'

interface LineChartDataPoint {
  label: string
  value: number
}

interface DonutSlice {
  label: string
  percentage: number
  color: string
}

export const DashboardView: React.FC = () => {
  const { isArabic } = useOutletContext<{ isArabic: boolean }>()

  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalProviders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    profit: 0
  })

  const [donutChartSlices, setDonutChartSlices] = useState<DonutSlice[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month')

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true)
        console.log('[DashboardView] Fetching dashboard data...')
        const [statsRes, statusRes, activitiesRes] = await Promise.all([
          api.get('/admin/dashboard/stats'),
          api.get('/admin/dashboard/orders-by-status'),
          api.get('/admin/dashboard/activities')
        ])

        console.log('[DashboardView] statsRes:', statsRes.status, statsRes.data)
        console.log('[DashboardView] statusRes:', statusRes.status, statusRes.data)
        console.log('[DashboardView] activitiesRes:', activitiesRes.status, activitiesRes.data)

        setStats(statsRes.data)
        
        // Map status to donut slices
        if (statusRes.data && statusRes.data.data) {
          const mappedSlices = statusRes.data.data.map((item: any) => {
            let color = '#475569' // default grey
            let label = item.status
            if (item.status === 'قيد التنفيذ' || item.status === 'In Progress' || item.status === 'in_progress') {
               color = '#f97316'
               label = isArabic ? 'قيد التنفيذ' : 'In Progress'
            } else if (item.status === 'مكتمل' || item.status === 'Completed' || item.status === 'completed') {
               color = '#eab308'
               label = isArabic ? 'مكتمل' : 'Completed'
            } else if (item.status === 'ملغي' || item.status === 'Cancelled' || item.status === 'cancelled') {
               color = '#22c55e'
               label = isArabic ? 'ملغي' : 'Cancelled'
            } else if (item.status === 'قيد الانتظار' || item.status === 'Pending' || item.status === 'pending') {
               label = isArabic ? 'قيد الانتظار' : 'Pending'
            }

            const total = Number(statusRes.data.total) || 1
            const count = Number(item.count) || 0
            const percentage = item.percentage !== undefined ? Number(item.percentage) : Math.round((count / total) * 100)

            return {
              label,
              percentage,
              color
            }
          })
          setDonutChartSlices(mappedSlices)
        }

        if (activitiesRes.data) {
          setActivities(activitiesRes.data)
        }

      } catch (error) {
        console.error('Error fetching dashboard data:', error)
        toast.error(isArabic ? 'فشل تحميل بيانات لوحة التحكم' : 'Failed to load dashboard data')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [isArabic])

  // Mock line chart data since there's no endpoint for it
  const lineChartData: LineChartDataPoint[] = (() => {
    switch (timeRange) {
      case 'day': return [ { label: '12 AM', value: 12000 }, { label: '4 AM', value: 24000 }, { label: '8 AM', value: 45000 }, { label: '12 PM', value: 38000 } ]
      case 'week': return [ { label: 'Sat', value: 18000 }, { label: 'Sun', value: 22000 }, { label: 'Mon', value: 34000 } ]
      case 'year': return [ { label: '2020', value: 600000 }, { label: '2021', value: 850000 }, { label: '2022', value: 1200000 } ]
      case 'month':
      default:
        return [ { label: 'May 19', value: 18000 }, { label: 'May 20', value: 27000 }, { label: 'May 21', value: 42000 }, { label: 'May 22', value: 33000 } ]
    }
  })()

  if (isLoading) {
    return <div className="p-8 text-center text-slate-500">{isArabic ? 'جاري التحميل...' : 'Loading...'}</div>
  }

  return (
    <div className="space-y-6">
      
      {/* KPI Summary Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
          <div className="space-y-2 text-start">
            <span className="text-[11px] font-bold text-slate-400 block">
              {isArabic ? 'إجمالي الطلبات' : 'Total Orders'}
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-orange-500 transition-colors">
              {stats.totalOrders?.toLocaleString() || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
            <Box size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
          <div className="space-y-2 text-start">
            <span className="text-[11px] font-bold text-slate-400 block">
              {isArabic ? 'الطلبات اليوم' : "Today's Orders"}
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-green-500 transition-colors">
              {stats.todayOrders?.toLocaleString() || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
            <Truck size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
          <div className="space-y-2 text-start">
            <span className="text-[11px] font-bold text-slate-400 block">
              {isArabic ? 'إجمالي الإيرادات' : 'Total Revenue'}
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-500 transition-colors whitespace-nowrap">
              {isArabic ? 'ر.س' : 'SAR'} {stats.totalRevenue?.toLocaleString() || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <DollarSign size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
          <div className="space-y-2 text-start">
            <span className="text-[11px] font-bold text-slate-400 block">
              {isArabic ? 'صافي الأرباح' : 'Net Profit'}
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-purple-500 transition-colors">
              {isArabic ? 'ر.س' : 'SAR'} {stats.profit?.toLocaleString() || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
            <FileText size={22} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
          <div className="space-y-2 text-start">
            <span className="text-[11px] font-bold text-slate-400 block">
              {isArabic ? 'إجمالي العملاء' : 'Total Customers'}
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-yellow-500 transition-colors">
              {stats.totalCustomers?.toLocaleString() || 0}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
            <Users size={22} />
          </div>
        </div>
      </section>

      {/* Charts Row */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-start">
              <div className="p-1 rounded-md bg-orange-100 dark:bg-orange-950/20 text-orange-500">
                <TrendingUp size={16} />
              </div>
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                {isArabic ? 'إحصائيات الطلبات وعائد الإيرادات' : 'Order Stats & Revenue Flow'}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
                {(['day', 'week', 'month', 'year'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setTimeRange(r)}
                    className={`px-3 py-1 rounded-md transition-all ${
                      timeRange === r 
                        ? 'bg-orange-500 text-white shadow-sm' 
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                    }`}
                  >
                    {r === 'day' ? (isArabic ? 'اليوم' : 'Day') : r === 'week' ? (isArabic ? 'الأسبوع' : 'Week') : r === 'month' ? (isArabic ? 'الشهر' : 'Month') : (isArabic ? 'السنة' : 'Year')}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <LineChart data={lineChartData} color="#f97316" />
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-6 text-start">
              {isArabic ? 'توزيع الطلبات حسب الحالة' : 'Status Distribution'}
            </h3>
            <DonutChart slices={donutChartSlices} totalCount={stats.totalOrders} />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            {donutChartSlices.map((slice, index) => (
              <div key={index} className="flex items-center gap-2 text-start p-1.5 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-lg transition-colors">
                <span className="h-2 w-2 rounded-full flex-shrink-0" style={{ backgroundColor: slice.color }}></span>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold truncate">{slice.label}</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ms-auto">{slice.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Activities Section */}
      <section className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-1.5 rounded-lg bg-orange-100 dark:bg-orange-950/20 text-orange-500">
            <Activity size={18} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 text-start">
            {isArabic ? 'أحدث نشاطات النظام' : 'Recent System Activities'}
          </h3>
        </div>

        <div className="space-y-4">
          {activities.length > 0 ? activities.map((act, index) => (
            <div key={index} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3 text-start">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Activity size={14} className="animate-pulse text-orange-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {act.message || act.description || act.text || 'نشاط في النظام'}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {new Date(act.createdAt || Date.now()).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          )) : (
            <div className="text-center text-sm text-slate-500 py-4">
              {isArabic ? 'لا توجد نشاطات حديثة' : 'No recent activities'}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
