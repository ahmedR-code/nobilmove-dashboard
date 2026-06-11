import React, { useState, useMemo } from 'react'
import { 
  Box, 
  Bell, 
  Maximize, 
  Menu, 
  ChevronDown, 
  Globe,
  Settings,
  HelpCircle,
  FileSpreadsheet,
  MapPin,
  UserCheck,
  ShoppingBag,
  Users,
  Sun,
  Moon
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { AddOrderModal } from './AddOrderModal'

// Sub-pages imports
import { DashboardView } from './pages/DashboardView'
import { OrdersView } from './pages/OrdersView'
import { UsersView } from './pages/UsersView'
import { ServiceProvidersView } from './pages/ServiceProvidersView'
import { RegionsView } from './pages/RegionsView'
import { FinancialReportsView } from './pages/FinancialReportsView'
import { NotificationsView } from './pages/NotificationsView'
import { SupportHelpView } from './pages/SupportHelpView'

// Define Order interface
interface Order {
  id: string
  service: string
  customer: string
  region: string
  date: string
  status: string
  price: number
}

// Initial dashboard metrics
const initialStats = {
  totalOrders: 1254,
  todayOrders: 87,
  totalRevenue: 125450,
  totalCustomers: 45320
}

// Sidebar configuration list
const sidebarItems = [
  { id: 'dashboard', labelAr: 'لوحة التحكم', labelEn: 'Dashboard', icon: Box },
  { id: 'orders', labelAr: 'الطلبات', labelEn: 'Orders', icon: ShoppingBag },
  { id: 'users', labelAr: 'المستخدمين', labelEn: 'Users', icon: Users },
  { id: 'service_providers', labelAr: 'مزودي الخدمة', labelEn: 'Service Providers', icon: UserCheck },
  { id: 'regions', labelAr: 'المناطق', labelEn: 'Regions', icon: MapPin },
  { id: 'financial', labelAr: 'التقارير المالية', labelEn: 'Financial Reports', icon: FileSpreadsheet },
  { id: 'notifications', labelAr: 'الإشعارات', labelEn: 'Notifications', icon: Bell },
  { id: 'support', labelAr: 'الدعم والمساعدة', labelEn: 'Support & Help', icon: HelpCircle },
  { id: 'settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: Settings },
]

export const Dashboard: React.FC = () => {
  const [isArabic, setIsArabic] = useState(true)
  const [activeItem, setActiveItem] = useState('dashboard')
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Orders list state
  const [orders, setOrders] = useState<Order[]>([
    {
      id: '#1258',
      service: 'نقل أثاث',
      customer: 'محمد علي',
      region: 'الرياض',
      date: '25/05/2024',
      status: 'قيد التنفيذ',
      price: 650,
    },
    {
      id: '#1257',
      service: 'سحب سيارة',
      customer: 'سارة أحمد',
      region: 'جدة',
      date: '25/05/2024',
      status: 'مكتمل',
      price: 650,
    },
    {
      id: '#1256',
      service: 'مكافحة حشرات',
      customer: 'علي خالد',
      region: 'الدمام',
      date: '19/05/2024',
      status: 'ملغي',
      price: 200,
    },
    {
      id: '#1255',
      service: 'نقل أثاث',
      customer: 'فاطمة سعيد',
      region: 'مكة المكرمة',
      date: '20/05/2024',
      status: 'قيد الانتظار',
      price: 756,
    },
  ])



  // Calculate dynamic metrics based on initial states + any added orders
  const stats = useMemo(() => {
    // Number of new orders added (i.e. beyond the initial 4)
    const newOrders = orders.filter(o => !['#1258', '#1257', '#1256', '#1255'].includes(o.id))
    
    const totalOrdersCount = initialStats.totalOrders + newOrders.length
    const todayOrdersCount = initialStats.todayOrders + newOrders.filter(o => o.status !== 'ملغي').length
    
    const extraRevenue = newOrders.reduce((sum, o) => o.status !== 'ملغي' ? sum + o.price : sum, 0)
    const totalRevenueSum = initialStats.totalRevenue + extraRevenue

    // Calculate net profit as a percentage of total revenue (35%)
    const netProfitSum = Math.round(totalRevenueSum * 0.35)

    return {
      totalOrders: totalOrdersCount,
      todayOrders: todayOrdersCount,
      totalRevenue: totalRevenueSum,
      netProfit: netProfitSum,
      totalCustomers: initialStats.totalCustomers + Math.round(newOrders.length * 0.8)
    }
  }, [orders])

  // Custom data points for the line chart based on time filter
  const lineChartData = useMemo(() => {
    switch (timeRange) {
      case 'day':
        return [
          { label: isArabic ? '00:00' : '12 AM', value: 12000 },
          { label: isArabic ? '04:00' : '4 AM', value: 24000 },
          { label: isArabic ? '08:00' : '8 AM', value: 45000 },
          { label: isArabic ? '12:00' : '12 PM', value: 38000 },
          { label: isArabic ? '16:00' : '4 PM', value: 54000 },
          { label: isArabic ? '20:00' : '8 PM', value: 68000 },
          { label: isArabic ? '24:00' : '11 PM', value: 85000 },
        ]
      case 'week':
        return [
          { label: isArabic ? 'السبت' : 'Sat', value: 18000 },
          { label: isArabic ? 'الأحد' : 'Sun', value: 22000 },
          { label: isArabic ? 'الإثنين' : 'Mon', value: 34000 },
          { label: isArabic ? 'الثلاثاء' : 'Tue', value: 31000 },
          { label: isArabic ? 'الأربعاء' : 'Wed', value: 46000 },
          { label: isArabic ? 'الخميس' : 'Thu', value: 58000 },
          { label: isArabic ? 'الجمعة' : 'Fri', value: 72000 },
        ]
      case 'year':
        return [
          { label: isArabic ? '2020' : '2020', value: 600000 },
          { label: isArabic ? '2021' : '2021', value: 850000 },
          { label: isArabic ? '2022' : '2022', value: 1200000 },
          { label: isArabic ? '2023' : '2023', value: 1540000 },
          { label: isArabic ? '2024' : '2024', value: 1950000 },
        ]
      case 'month':
      default:
        return [
          { label: isArabic ? 'مايو 19' : 'May 19', value: 18000 },
          { label: isArabic ? 'مايو 20' : 'May 20', value: 27000 },
          { label: isArabic ? 'مايو 21' : 'May 21', value: 42000 },
          { label: isArabic ? 'مايو 22' : 'May 22', value: 33000 },
          { label: isArabic ? 'مايو 23' : 'May 23', value: 45000 },
          { label: isArabic ? 'مايو 24' : 'May 24', value: 35000 },
          { label: isArabic ? 'مايو 25' : 'May 25', value: 52000 },
          { label: isArabic ? 'مايو 26' : 'May 26', value: 67000 },
        ]
    }
  }, [timeRange, isArabic])

  // Donut chart status breakdown
  const donutChartSlices = useMemo(() => {
    const counts = { inProgress: 0, completed: 0, cancelled: 0, pending: 0 }
    orders.forEach((o) => {
      if (o.status === 'قيد التنفيذ' || o.status === 'In Progress') counts.inProgress++
      else if (o.status === 'مكتمل' || o.status === 'Completed') counts.completed++
      else if (o.status === 'ملغي' || o.status === 'Cancelled') counts.cancelled++
      else counts.pending++
    })

    const total = orders.length
    const getPercent = (count: number) => total > 0 ? Math.round((count / total) * 100) : 25

    return [
      { label: isArabic ? 'قيد التنفيذ' : 'In Progress', percentage: getPercent(counts.inProgress), color: '#f97316' },
      { label: isArabic ? 'مكتمل' : 'Completed', percentage: getPercent(counts.completed), color: '#eab308' },
      { label: isArabic ? 'ملغي' : 'Cancelled', percentage: getPercent(counts.cancelled), color: '#22c55e' },
      { label: isArabic ? 'قيد الانتظار' : 'Pending', percentage: getPercent(counts.pending), color: '#475569' },
    ]
  }, [orders, isArabic])

  // Add order callback
  const handleAddOrder = (newOrder: Order) => {
    // Translate service and region back if added in English
    const finalOrder = {
      ...newOrder,
      service: isArabic ? newOrder.service : translateService(newOrder.service, true),
      region: isArabic ? newOrder.region : translateRegion(newOrder.region, true),
      status: isArabic ? newOrder.status : translateStatus(newOrder.status, true),
    }
    setOrders([finalOrder, ...orders])
    toast.success(isArabic ? 'تم إضافة الطلب بنجاح!' : 'Order added successfully!')
  }

  // Helper translations
  const translateService = (val: string, toArabic = false) => {
    const mapping: Record<string, string> = {
      'نقل أثاث': 'Furniture Moving',
      'سحب سيارة': 'Car Towing',
      'مكافحة حشرات': 'Pest Control',
      'تنظيف منازل': 'Home Cleaning',
      'نقل بضائع': 'Goods Transport',
    }
    if (toArabic) {
      return Object.keys(mapping).find(key => mapping[key] === val) || val
    }
    return mapping[val] || val
  }

  const translateRegion = (val: string, toArabic = false) => {
    const mapping: Record<string, string> = {
      'الرياض': 'Riyadh',
      'جدة': 'Jeddah',
      'الدمام': 'Dammam',
      'مكة المكرمة': 'Makkah',
      'المدينة المنورة': 'Madinah',
    }
    if (toArabic) {
      return Object.keys(mapping).find(key => mapping[key] === val) || val
    }
    return mapping[val] || val
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



  // Render navigation-based content
  const renderContent = () => {
    switch (activeItem) {
      case 'dashboard':
        return (
          <DashboardView
            isArabic={isArabic}
            stats={stats}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            lineChartData={lineChartData}
            donutChartSlices={donutChartSlices}
          />
        )
      case 'orders':
        return (
          <OrdersView
            isArabic={isArabic}
            orders={orders}
            setIsModalOpen={setIsModalOpen}
          />
        )
      case 'users':
        return <UsersView isArabic={isArabic} />
      case 'service_providers':
        return <ServiceProvidersView isArabic={isArabic} />
      case 'regions':
        return <RegionsView isArabic={isArabic} />
      case 'financial':
        return <FinancialReportsView isArabic={isArabic} stats={stats} />
      case 'notifications':
        return <NotificationsView isArabic={isArabic} />
      case 'support':
        return <SupportHelpView isArabic={isArabic} />
      case 'settings':
      default:
        return (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-center">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-2">
              {isArabic ? 'إعدادات النظام' : 'System Settings'}
            </h3>
            <p className="text-sm text-slate-400">
              {isArabic ? 'إعدادات المنصة وخيارات التحكم بالبيانات.' : 'Configure portal settings and details.'}
            </p>
          </div>
        )
    }
  }

  // Get active menu label for breadcrumbs
  const activeLabel = useMemo(() => {
    const matched = sidebarItems.find(item => item.id === activeItem)
    if (!matched) return isArabic ? 'لوحة التحكم' : 'Dashboard'
    return isArabic ? matched.labelAr : matched.labelEn
  }, [activeItem, isArabic])

  return (
    <div className={`flex min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-[#f8f9fa] text-slate-800'}`}>
      <Toaster position="top-center" richColors />
      
      {/* Sidebar - Left Fixed Panel */}
      <aside 
        className="w-64 flex-shrink-0 bg-[#18191c] text-white flex flex-col justify-between border-e border-slate-800"
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-800/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-orange-400 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Box size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-white to-slate-200 bg-clip-text text-transparent">
                NobilMove
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">نوبيل موف</p>
            </div>
          </div>

          {/* Navigation Link Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[70vh]">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = activeItem === item.id
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveItem(item.id)
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md shadow-orange-500/10' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'} />
                  <span>{isArabic ? item.labelAr : item.labelEn}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* User profile section at the bottom */}
        <div className="p-4 border-t border-slate-800/60 bg-slate-900/40">
          <div className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/30 cursor-pointer transition-colors group">
            <div className="flex items-center gap-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Avatar" 
                  className="w-9 h-9 rounded-full object-cover border border-slate-700 group-hover:border-orange-500 transition-colors"
                />
                <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-green-400 ring-2 ring-slate-900"></span>
              </div>
              <div className="text-start">
                <p className="text-xs font-bold text-slate-200 group-hover:text-white transition-colors">
                  {isArabic ? 'أحمد محمد' : 'Ahmed Mohamed'}
                </p>
                <p className="text-[10px] text-slate-400">
                  {isArabic ? 'مدير النظام' : 'System Admin'}
                </p>
              </div>
            </div>
            <ChevronDown size={14} className="text-slate-400 group-hover:text-white transition-colors" />
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 flex flex-col min-w-0" dir={isArabic ? 'rtl' : 'ltr'}>
        
        {/* Header - Navigation & Control */}
        <header className="h-16 flex-shrink-0 flex items-center justify-between px-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors z-20">
          {/* Left panel: Burger */}
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Menu size={20} />
            </button>
          </div>

          {/* Right panel: Alerts, fullscreen, lang toggle, profile dropdown */}
          <div className="flex items-center gap-3">
            {/* Dark/Light mode selector */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* Language toggle selector */}
            <button 
              onClick={() => {
                setIsArabic(!isArabic)
                toast.success(isArabic ? 'Switched to English' : 'تم التحويل إلى اللغة العربية')
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-slate-100 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 transition-all"
            >
              <Globe size={14} />
              <span>{isArabic ? 'English' : 'العربية'}</span>
            </button>

            {/* Screen expand */}
            <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors hidden md:block">
              <Maximize size={18} />
            </button>

            {/* Notifications Alert */}
            <div className="relative">
              <button 
                onClick={() => setActiveItem('notifications')}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 end-1.5 block h-4 w-4 text-[10px] font-bold text-center leading-4 text-white bg-orange-500 rounded-full">5</span>
              </button>
            </div>

            {/* Separator line */}
            <div className="h-6 w-px bg-slate-100 dark:bg-slate-800"></div>

            {/* Profile widget */}
            <div className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                alt="Avatar" 
                className="w-8 h-8 rounded-full object-cover border border-slate-100 dark:border-slate-700"
              />
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Inner Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Breadcrumb page title */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">
                {activeLabel}
              </h2>
              <p className="text-xs text-slate-400 font-semibold mt-1">
                <span>{isArabic ? 'الرئيسية' : 'Home'}</span>
                <span className="mx-1.5">/</span>
                <span className="text-orange-500">{activeLabel}</span>
              </p>
            </div>
          </div>

          {/* Renders active sub-page view */}
          {renderContent()}

        </div>
      </main>

      {/* Dynamic Modal Dialog */}
      <AddOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddOrder}
        isArabic={isArabic}
      />
    </div>
  )
}
