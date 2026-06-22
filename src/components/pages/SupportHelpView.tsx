import React, { useState, useMemo } from 'react'
import { Plus, Search, Eye, MoreVertical, MessageSquare, AlertCircle, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'

interface Ticket {
  id: string
  customer: string
  subject: string
  priority: 'high' | 'medium' | 'low'
  date: string
  status: 'open' | 'in_progress' | 'resolved'
}

interface SupportHelpViewProps {
  isArabic: boolean
}

export const SupportHelpView: React.FC<SupportHelpViewProps> = ({ isArabic }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all')

  const tickets: Ticket[] = useMemo(() => [
    {
      id: '#TCK4401',
      customer: 'محمد علي',
      subject: isArabic ? 'تأخر وصول سائق النقل عن الموعد' : 'Relocation driver delayed past scheduled time',
      priority: 'high',
      date: '25/05/2024',
      status: 'open',
    },
    {
      id: '#TCK4402',
      customer: 'سارة أحمد',
      subject: isArabic ? 'استفسار عن إمكانية الدفع نقداً عند التوصيل' : 'Inquiry about cash on delivery payment option',
      priority: 'low',
      date: '24/05/2024',
      status: 'resolved',
    },
    {
      id: '#TCK4403',
      customer: 'علي خالد',
      subject: isArabic ? 'طلب استرداد الرسوم لطلب ملغي' : 'Refund request for cancelled order',
      priority: 'medium',
      date: '22/05/2024',
      status: 'in_progress',
    },
    {
      id: '#TCK4404',
      customer: 'فاطمة سعيد',
      subject: isArabic ? 'تعديل موقع التنزيل بعد حجز الطلب' : 'Modify delivery drop location after confirmation',
      priority: 'high',
      date: '20/05/2024',
      status: 'resolved',
    },
  ], [isArabic])

  const stats = useMemo(() => {
    return {
      open: tickets.filter(t => t.status === 'open').length,
      inProgress: tickets.filter(t => t.status === 'in_progress').length,
      resolved: tickets.filter(t => t.status === 'resolved').length,
    }
  }, [tickets])

  const translatePriority = (priority: string) => {
    switch (priority) {
      case 'high':
        return isArabic ? 'عالية' : 'High'
      case 'medium':
        return isArabic ? 'متوسطة' : 'Medium'
      case 'low':
      default:
        return isArabic ? 'منخفضة' : 'Low'
    }
  }

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400'
      case 'medium':
        return 'bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400'
      case 'low':
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
            {isArabic ? 'جديدة' : 'Open'}
          </span>
        )
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-600 dark:bg-orange-950/40 dark:text-orange-400">
            {isArabic ? 'قيد المعالجة' : 'In Progress'}
          </span>
        )
      case 'resolved':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
            {isArabic ? 'محلولة' : 'Resolved'}
          </span>
        )
    }
  }

  // Filter
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch = 
        t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.subject.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (!matchesSearch) return false
      if (statusFilter === 'all') return true
      return t.status === statusFilter
    })
  }, [tickets, searchQuery, statusFilter])

  const handleCreateTicket = () => {
    toast.info(isArabic ? 'إنشاء تذكرة دعم قريباً!' : 'Create ticket form coming soon!')
  }

  return (
    <div className="space-y-6">
      
      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-500">
            <AlertCircle size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'تذاكر جديدة/مفتوحة' : 'Open Tickets'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{stats.open}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-orange-50 dark:bg-orange-950/20 text-orange-500">
            <MessageSquare size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'تذاكر قيد المعالجة' : 'Under Review'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{stats.inProgress}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-500">
            <CheckCircle size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'تذاكر محلولة' : 'Resolved Helpdesk'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{stats.resolved}</p>
          </div>
        </div>
      </section>

      {/* Ticket List table */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden">
        
        {/* Controls */}
        <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative w-64 max-w-full group">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث باسم العميل، برقم التذكرة...' : 'Search customer, ticket ID...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">
              {([
                { key: 'all', ar: 'الكل', en: 'All' },
                { key: 'open', ar: 'جديدة', en: 'Open' },
                { key: 'in_progress', ar: 'قيد المعالجة', en: 'In Progress' },
                { key: 'resolved', ar: 'محلولة', en: 'Resolved' },
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
              onClick={handleCreateTicket}
              className="flex items-center gap-1.5 bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/15"
            >
              <Plus size={14} />
              <span>{isArabic ? 'فتح تذكرة' : 'Open Ticket'}</span>
            </button>
          </div>
        </div>

        {/* Tickets table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start" dir={isArabic ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-[11px] font-extrabold border-b border-slate-50 dark:border-slate-800/60 uppercase tracking-wider">
                <th className="px-6 py-3 text-start">Ticket ID</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'العميل' : 'Customer'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'موضوع التذكرة' : 'Issue'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'الأولوية' : 'Priority'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'تاريخ التقديم' : 'Date Created'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-3 text-center">{isArabic ? 'الإجراء' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 font-semibold text-slate-400 text-xs">
                      {ticket.id}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100 text-xs">
                      {ticket.customer}
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-300 max-w-xs truncate">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${getPriorityBadgeColor(ticket.priority)}`}>
                        {translatePriority(ticket.priority)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {ticket.date}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => toast.info(isArabic ? `عرض التذكرة: ${ticket.id}` : `Viewing ticket: ${ticket.id}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => toast.info(isArabic ? `خيارات التذكرة: ${ticket.id}` : `Ticket options: ${ticket.id}`)}
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
                    {isArabic ? 'لم يتم العثور على أي تذاكر دعم' : 'No tickets found'}
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
