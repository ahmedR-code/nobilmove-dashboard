import React, { useState, useMemo } from 'react'
import { Plus, Search, Eye, MoreVertical, Shield, UserCheck, User } from 'lucide-react'
import { toast } from 'sonner'

interface SystemUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'operator'
  status: 'active' | 'suspended'
  date: string
  avatar: string
}

interface UsersViewProps {
  isArabic: boolean
}

const systemUsers: SystemUser[] = [
  {
    id: 'USR101',
    name: 'أحمد محمد',
    email: 'ahmed@nobilmove.com',
    role: 'admin',
    status: 'active',
    date: '12/01/2024',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'USR102',
    name: 'سارة العتيبي',
    email: 'sarah@nobilmove.com',
    role: 'manager',
    status: 'active',
    date: '15/02/2024',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'USR103',
    name: 'خالد الحربي',
    email: 'khalid@nobilmove.com',
    role: 'operator',
    status: 'suspended',
    date: '10/03/2024',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: 'USR104',
    name: 'نورة السديري',
    email: 'noura@nobilmove.com',
    role: 'operator',
    status: 'active',
    date: '22/04/2024',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
]

export const UsersView: React.FC<UsersViewProps> = ({ isArabic }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState<'all' | 'admin' | 'manager' | 'operator'>('all')

  // Helpers
  const translateRole = (role: string) => {
    switch (role) {
      case 'admin':
        return isArabic ? 'مدير النظام' : 'System Admin'
      case 'manager':
        return isArabic ? 'مدير عام' : 'General Manager'
      case 'operator':
      default:
        return isArabic ? 'موظف تشغيل' : 'Operations Staff'
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400'
      case 'manager':
        return 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400'
      case 'operator':
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
    }
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') {
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-600 dark:bg-green-950/40 dark:text-green-400">
          {isArabic ? 'نشط' : 'Active'}
        </span>
      )
    }
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400">
        {isArabic ? 'موقوف' : 'Suspended'}
      </span>
    )
  }

  // Filter
  const filteredUsers = useMemo(() => {
    return systemUsers.filter((u) => {
      const matchesSearch = 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
      
      if (!matchesSearch) return false

      if (roleFilter === 'all') return true
      return u.role === roleFilter
    })
  }, [searchQuery, roleFilter])

  // Count summaries
  const userStats = useMemo(() => {
    return {
      total: systemUsers.length,
      active: systemUsers.filter(u => u.status === 'active').length,
      admins: systemUsers.filter(u => u.role === 'admin').length,
    }
  }, [])

  const handleAddUser = () => {
    toast.info(isArabic ? 'إضافة مستخدم جديد قريباً!' : 'Add User form coming soon!')
  }

  return (
    <div className="space-y-6">
      
      {/* Metric Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500">
            <User size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'إجمالي المستخدمين' : 'Total System Users'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{userStats.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-500">
            <UserCheck size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'المستخدمين النشطين' : 'Active Users'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{userStats.active}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-500">
            <Shield size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold">{isArabic ? 'مسؤولي النظام (Admins)' : 'System Admins'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{userStats.admins}</p>
          </div>
        </div>
      </section>

      {/* Directory Table */}
      <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden">
        
        {/* Controls */}
        <div className="p-6 border-b border-slate-50 dark:border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          <div className="relative w-64 max-w-full group">
            <Search className="absolute start-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder={isArabic ? 'بحث عن مستخدم بالاسم أو الإيميل...' : 'Search name, email...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full ps-9 pe-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex p-0.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-bold">
              {([
                { key: 'all', ar: 'الكل', en: 'All' },
                { key: 'admin', ar: 'مدير نظام', en: 'Admins' },
                { key: 'manager', ar: 'مدير عام', en: 'Managers' },
                { key: 'operator', ar: 'موظف تشغيل', en: 'Operators' },
              ] as const).map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setRoleFilter(tab.key)}
                  className={`px-3 py-1 rounded-md transition-all ${
                    roleFilter === tab.key 
                      ? 'bg-orange-500 text-white shadow-sm' 
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-100'
                  }`}
                >
                  {isArabic ? tab.ar : tab.en}
                </button>
              ))}
            </div>

            <button
              onClick={handleAddUser}
              className="flex items-center gap-1.5 bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/15"
            >
              <Plus size={14} />
              <span>{isArabic ? 'إضافة مستخدم' : 'Add User'}</span>
            </button>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-start" dir={isArabic ? 'rtl' : 'ltr'}>
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/30 text-slate-400 text-[11px] font-extrabold border-b border-slate-50 dark:border-slate-800/60 uppercase tracking-wider">
                <th className="px-6 py-3 text-start">{isArabic ? 'الاسم' : 'User'}</th>
                <th className="px-6 py-3 text-start">ID</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'الإيميل' : 'Email'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'الدور الوظيفي' : 'Role'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'تاريخ التسجيل' : 'Registered At'}</th>
                <th className="px-6 py-3 text-start">{isArabic ? 'الحالة' : 'Status'}</th>
                <th className="px-6 py-3 text-center">{isArabic ? 'الإجراء' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors group"
                  >
                    <td className="px-6 py-4 text-xs font-bold text-slate-800 dark:text-slate-100">
                      <div className="flex items-center gap-3 text-start">
                        <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                        <span>{user.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold text-slate-400">
                      {user.id}
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-600 dark:text-slate-300">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${getRoleBadgeColor(user.role)}`}>
                        {translateRole(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400">
                      {user.date}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(user.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button 
                          onClick={() => toast.info(isArabic ? `عرض ملف: ${user.name}` : `Viewing profile: ${user.name}`)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all"
                        >
                          <Eye size={14} />
                        </button>
                        <button 
                          onClick={() => toast.info(isArabic ? `تعديل صلاحيات المستخدم: ${user.name}` : `Modifying options: ${user.name}`)}
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
                    {isArabic ? 'لم يتم العثور على أي مستخدمين' : 'No users found'}
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
