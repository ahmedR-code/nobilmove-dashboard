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
  Shield,
  Sun,
  Moon
} from 'lucide-react'
import { toast, Toaster } from 'sonner'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { AddOrderModal } from './AddOrderModal'
import { AdminProfileModal } from './AdminProfileModal'
// Sub-pages imports are now loaded via react-router Outlet in App.tsx

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

// Sidebar configuration list
const sidebarItems = [
  { id: 'dashboard', path: '/dashboard', labelAr: 'لوحة التحكم', labelEn: 'Dashboard', icon: Box },
  { id: 'orders', path: '/orders', labelAr: 'الطلبات', labelEn: 'Orders', icon: ShoppingBag },
  { id: 'customers', path: '/customers', labelAr: 'العملاء', labelEn: 'Customers', icon: Users },
  { id: 'users', path: '/users', labelAr: 'المستخدمين', labelEn: 'Users', icon: Shield },
  { id: 'service_providers', path: '/service-providers', labelAr: 'مزودي الخدمة', labelEn: 'Service Providers', icon: UserCheck },
  { id: 'regions', path: '/regions', labelAr: 'المناطق', labelEn: 'Regions', icon: MapPin },
  { id: 'financial', path: '/financial', labelAr: 'التقارير المالية', labelEn: 'Financial Reports', icon: FileSpreadsheet },
  { id: 'notifications', path: '/notifications', labelAr: 'الإشعارات', labelEn: 'Notifications', icon: Bell },
  { id: 'support', path: '/support', labelAr: 'الدعم والمساعدة', labelEn: 'Support & Help', icon: HelpCircle },
  { id: 'settings', path: '/settings', labelAr: 'الإعدادات', labelEn: 'Settings', icon: Settings },
]

export const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { admin, logout } = useAuthStore()

  const [isArabic, setIsArabic] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
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



  // Get active menu label for breadcrumbs
  const activeLabel = useMemo(() => {
    const matched = sidebarItems.find(item => location.pathname.startsWith(item.path))
    if (!matched) return isArabic ? 'لوحة التحكم' : 'Dashboard'
    return isArabic ? matched.labelAr : matched.labelEn
  }, [location.pathname, isArabic])

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
              <p className="text-xs text-slate-400 font-medium">نوبيل موف</p>
            </div>
          </div>

          {/* Navigation Link Items */}
          <nav className="p-4 space-y-1.5 overflow-y-auto max-h-[70vh]">
            {sidebarItems.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname.startsWith(item.path)
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    navigate(item.path)
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
          <div 
            onClick={() => setIsProfileOpen(true)}
            className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-800/30 cursor-pointer transition-colors group"
          >
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
                  {admin?.name || (isArabic ? 'مدير النظام' : 'Admin')}
                </p>
                <p className="text-xs text-slate-400">
                  {admin?.email || 'admin@nobilmove.com'}
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
                onClick={() => navigate('/notifications')}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell size={18} />
                <span className="absolute top-1.5 end-1.5 block h-4 w-4 text-xs font-bold text-center leading-4 text-white bg-orange-500 rounded-full">5</span>
              </button>
            </div>

            {/* Separator line */}
            <div className="h-6 w-px bg-slate-100 dark:bg-slate-800"></div>

            {/* Profile widget */}
            <div className="relative group">
              <div className="flex items-center gap-2 cursor-pointer p-1 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full object-cover border border-slate-100 dark:border-slate-700"
                />
                <ChevronDown size={14} className="text-slate-400" />
              </div>
              
              {/* Dropdown Menu */}
              <div className="absolute end-0 top-full mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{admin?.name}</p>
                  <p className="text-xs text-slate-400 truncate">{admin?.email}</p>
                </div>
                <div className="p-1 border-b border-slate-100 dark:border-slate-800/60">
                  <button 
                    onClick={() => setIsProfileOpen(true)}
                    className="w-full text-start px-3 py-2 text-xs font-semibold text-slate-650 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    {isArabic ? 'الملف الشخصي' : 'Profile Settings'}
                  </button>
                </div>
                <div className="p-1">
                  <button 
                    onClick={() => {
                      logout()
                      navigate('/login')
                    }}
                    className="w-full text-start px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                  >
                    {isArabic ? 'تسجيل الخروج' : 'Logout'}
                  </button>
                </div>
              </div>
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

          {/* Renders active sub-page view via Outlet */}
          <Outlet context={{ isArabic, isDarkMode }} />

        </div>
      </main>

      {/* Dynamic Modal Dialog */}
      <AddOrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddOrder}
        isArabic={isArabic}
      />

      <AdminProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        isArabic={isArabic}
      />
    </div>
  )
}
