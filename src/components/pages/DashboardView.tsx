import React from 'react'
import { 
  Box, 
  Truck, 
  DollarSign, 
  FileText, 
  Users, 
  TrendingUp, 
  Activity, 
  ArrowUpRight 
} from 'lucide-react'
import { LineChart, DonutChart } from '../DashboardCharts'

interface LineChartDataPoint {
  label: string
  value: number
}

interface DonutSlice {
  label: string
  percentage: number
  color: string
}

interface DashboardViewProps {
  isArabic: boolean
  stats: {
    totalOrders: number
    todayOrders: number
    totalRevenue: number
    netProfit: number
    totalCustomers: number
  }
  timeRange: 'day' | 'week' | 'month' | 'year'
  setTimeRange: (range: 'day' | 'week' | 'month' | 'year') => void
  lineChartData: LineChartDataPoint[]
  donutChartSlices: DonutSlice[]
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  isArabic,
  stats,
  timeRange,
  setTimeRange,
  lineChartData,
  donutChartSlices,
}) => {

  const activities = isArabic 
    ? [
        { id: 1, text: 'تم تسجيل مزود خدمة جديد (أحمد علي) في الرياض', time: 'منذ دقيقتين', type: 'user' },
        { id: 2, text: 'تم إكمال الطلب #1257 بنجاح', time: 'منذ ١٥ دقيقة', type: 'order' },
        { id: 3, text: 'طلب جديد #1258 قيد التنفيذ حالياً', time: 'منذ ساعة', type: 'order' },
        { id: 4, text: 'انضمام 5 مزودي خدمة جدد في جدة خلال 24 ساعة الماضية', time: 'منذ ٣ ساعات', type: 'providers' },
      ]
    : [
        { id: 1, text: 'New service provider (Ahmed Ali) registered in Riyadh', time: '2 mins ago', type: 'user' },
        { id: 2, text: 'Order #1257 completed successfully', time: '15 mins ago', type: 'order' },
        { id: 3, text: 'New order #1258 is currently in progress', time: '1 hour ago', type: 'order' },
        { id: 4, text: '5 new service providers joined in Jeddah over the past 24 hours', time: '3 hours ago', type: 'providers' },
      ]

  return (
    <div className="space-y-6">
      
      {/* KPI Summary Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Card 1: Total Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
          <div className="space-y-2 text-start">
            <span className="text-[11px] font-bold text-slate-400 block">
              {isArabic ? 'إجمالي الطلبات' : 'Total Orders'}
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-orange-500 transition-colors">
              {stats.totalOrders.toLocaleString()}
            </span>
            <span className="text-[10px] text-green-500 font-bold block">
              +12.5% {isArabic ? 'من الشهر الحالي' : 'from current month'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
            <Box size={22} />
          </div>
        </div>

        {/* Card 2: Today's Orders */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
          <div className="space-y-2 text-start">
            <span className="text-[11px] font-bold text-slate-400 block">
              {isArabic ? 'الطلبات اليوم' : "Today's Orders"}
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-green-500 transition-colors">
              {stats.todayOrders.toLocaleString()}
            </span>
            <span className="text-[10px] text-green-500 font-bold block">
              +8.2% {isArabic ? 'من أمس' : 'from yesterday'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-green-50 dark:bg-green-950/20 flex items-center justify-center text-green-500 group-hover:scale-110 transition-transform">
            <Truck size={22} />
          </div>
        </div>

        {/* Card 3: Total Revenue */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
          <div className="space-y-2 text-start">
            <span className="text-[11px] font-bold text-slate-400 block">
              {isArabic ? 'إجمالي الإيرادات' : 'Total Revenue'}
            </span>
            <span className="text-xl font-black text-slate-800 dark:text-slate-100 group-hover:text-blue-500 transition-colors whitespace-nowrap">
              {isArabic ? 'ر.س' : 'SAR'} {stats.totalRevenue.toLocaleString()}
            </span>
            <span className="text-[10px] text-green-500 font-bold block">
              +15.3% {isArabic ? 'من الشهر الحالي' : 'from current month'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/20 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
            <DollarSign size={22} />
          </div>
        </div>

        {/* Card 4: Net Profit */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
          <div className="space-y-2 text-start">
            <span className="text-[11px] font-bold text-slate-400 block">
              {isArabic ? 'صافي الأرباح' : 'Net Profit'}
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-purple-500 transition-colors">
              {isArabic ? 'ر.س' : 'SAR'} {stats.netProfit.toLocaleString()}
            </span>
            <span className="text-[10px] text-red-500 font-bold block">
              -3.6% {isArabic ? 'من الشهر الحالي' : 'from current month'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
            <FileText size={22} />
          </div>
        </div>

        {/* Card 5: Total Customers */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow group">
          <div className="space-y-2 text-start">
            <span className="text-[11px] font-bold text-slate-400 block">
              {isArabic ? 'إجمالي العملاء' : 'Total Customers'}
            </span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 group-hover:text-yellow-500 transition-colors">
              {stats.totalCustomers.toLocaleString()}
            </span>
            <span className="text-[10px] text-green-500 font-bold block">
              +18.7% {isArabic ? 'من الشهر الحالي' : 'from current month'}
            </span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-yellow-50 dark:bg-yellow-950/20 flex items-center justify-center text-yellow-500 group-hover:scale-110 transition-transform">
            <Users size={22} />
          </div>
        </div>
      </section>

      {/* Charts Row - Line Trend & Donut Status */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Box: Line chart */}
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
              <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold">
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
                    {r === 'day' ? (isArabic ? 'اليوم' : 'Day') :
                     r === 'week' ? (isArabic ? 'الأسبوع' : 'Week') :
                     r === 'month' ? (isArabic ? 'الشهر' : 'Month') :
                     (isArabic ? 'السنة' : 'Year')}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <LineChart data={lineChartData} color="#f97316" />
        </div>

        {/* Right Box: Donut distribution */}
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
                <span 
                  className="h-2 w-2 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: slice.color }}
                ></span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold truncate">
                  {slice.label}
                </span>
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 ms-auto">
                  {slice.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Insights Activity Section */}
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
          {activities.map((act) => (
            <div key={act.id} className="flex items-center justify-between p-3.5 rounded-xl border border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
              <div className="flex items-center gap-3 text-start">
                <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                  <Activity size={14} className="animate-pulse text-orange-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    {act.text}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {act.time}
                  </p>
                </div>
              </div>
              
              <button className="p-1 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all">
                <ArrowUpRight size={14} />
              </button>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
