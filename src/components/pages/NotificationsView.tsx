import React, { useState, useMemo } from 'react'
import { Bell, Search, CheckCircle, Trash2, MailOpen, Mail, ShieldAlert, Award, Truck } from 'lucide-react'
import { toast } from 'sonner'

interface AppNotification {
  id: string
  title: string
  body: string
  type: 'system' | 'order' | 'driver'
  time: string
  unread: boolean
}

interface NotificationsViewProps {
  isArabic: boolean
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({ isArabic }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread' | 'system' | 'order' | 'driver'>('all')

  const [notifications, setNotifications] = useState<AppNotification[]>([
    {
      id: 'NOTIF01',
      title: isArabic ? 'طلب جديد وارد' : 'New Order Received',
      body: isArabic ? 'تم إنشاء طلب نقل أثاث جديد برقم #1258 في الرياض.' : 'A new furniture moving request #1258 was created in Riyadh.',
      type: 'order',
      time: isArabic ? 'منذ دقيقتين' : '2 mins ago',
      unread: true,
    },
    {
      id: 'NOTIF02',
      title: isArabic ? 'توثيق سائق جديد' : 'New Driver Verification',
      body: isArabic ? 'قام ياسر القحطاني برفع مستندات الهوية للتسجيل كشريك خدمة.' : 'Yasser Al-Qahtani uploaded verification documents for registration.',
      type: 'driver',
      time: isArabic ? 'منذ ١٠ دقائق' : '10 mins ago',
      unread: true,
    },
    {
      id: 'NOTIF03',
      title: isArabic ? 'عملية دفع ناجحة' : 'Successful Payment Recieved',
      body: isArabic ? 'تم استلام دفعة بقيمة 650 ر.س للطلب #1257 بواسطة فيزا.' : 'Payment of 650 SAR for order #1257 was captured via Visa.',
      type: 'system',
      time: isArabic ? 'منذ ساعة' : '1 hour ago',
      unread: false,
    },
    {
      id: 'NOTIF04',
      title: isArabic ? 'فشل عملية الدفع' : 'Payment Authorization Failed',
      body: isArabic ? 'فشلت عملية سداد الرسوم للطلب #1256 عبر مدى بسبب رصيد غير كافٍ.' : 'Payment authorization failed for order #1256 on Mada card.',
      type: 'system',
      time: isArabic ? 'منذ يوم' : '1 day ago',
      unread: false,
    },
  ])

  // Count unread
  const unreadCount = useMemo(() => {
    return notifications.filter(n => n.unread).length
  }, [notifications])

  // Filters
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesSearch = 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.body.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (!matchesSearch) return false

      if (filter === 'all') return true
      if (filter === 'unread') return n.unread
      return n.type === filter
    })
  }, [notifications, searchQuery, filter])

  // Actions
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n))
    toast.success(isArabic ? 'تم تعيين الإشعار كمقروء' : 'Notification marked as read')
  }

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    toast.success(isArabic ? 'تم تعيين جميع الإشعارات كمقروءة' : 'All notifications marked as read')
  }

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
    toast.error(isArabic ? 'تم حذف الإشعار' : 'Notification deleted')
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Truck size={14} className="text-orange-500" />
      case 'driver':
        return <Award size={14} className="text-blue-500" />
      case 'system':
      default:
        return <ShieldAlert size={14} className="text-purple-500" />
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Metrics Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            <Bell size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'إجمالي الإشعارات' : 'Total Notifications'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{notifications.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-500">
            <Mail size={16} className="animate-bounce" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'إشعارات غير مقروءة' : 'Unread Alerts'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{unreadCount}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-500">
            <CheckCircle size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'إشعارات مقروءة' : 'Read History'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{notifications.length - unreadCount}</p>
          </div>
        </div>
      </section>

      {/* Main Alert List */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden">
        
        {/* Controls */}
        <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative w-64 max-w-full group">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث في التنبيهات...' : 'Search alerts...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          {/* Filtering buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold">
              {([
                { key: 'all', ar: 'الكل', en: 'All' },
                { key: 'unread', ar: 'غير مقروءة', en: 'Unread' },
                { key: 'system', ar: 'تنبيهات النظام', en: 'System' },
                { key: 'order', ar: 'الطلبات', en: 'Orders' },
                { key: 'driver', ar: 'شركاء العمل', en: 'Drivers' },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    filter === tab.key 
                      ? 'bg-orange-500 text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                  }`}
                >
                  {isArabic ? tab.ar : tab.en}
                </button>
              ))}
            </div>

            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllRead}
                className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-950/20 text-orange-600 dark:text-orange-400 px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-100 transition-colors"
              >
                <MailOpen size={14} />
                <span>{isArabic ? 'قراءة الكل' : 'Mark all read'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Custom Lists Layout */}
        <div className="divide-y divide-slate-100 dark:divide-slate-850/40">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-5 flex items-start justify-between gap-4 transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/10 ${
                  notif.unread ? 'bg-orange-50/10 dark:bg-orange-950/5' : ''
                }`}
              >
                {/* Left content details */}
                <div className="flex items-start gap-4 text-start">
                  <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs font-bold text-slate-800 dark:text-slate-100">
                        {notif.title}
                      </p>
                      {notif.unread && (
                        <span className="h-1.5 w-1.5 rounded-full bg-orange-500"></span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
                      {notif.body}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-2 font-semibold">
                      {notif.time}
                    </p>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex items-center gap-1">
                  {notif.unread && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      title={isArabic ? 'تعيين كمقروء' : 'Mark as Read'}
                      className="p-2 text-slate-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-950/20 rounded-lg transition-all"
                    >
                      <MailOpen size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notif.id)}
                    title={isArabic ? 'حذف الإشعار' : 'Delete'}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
              {isArabic ? 'لم يتم العثور على أي إشعارات' : 'No notifications found'}
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
