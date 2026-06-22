import React, { useState, useEffect, useMemo } from 'react'
import { Plus, Search, Eye, Shield, UserCheck, User, RefreshCw, X, Mail, Calendar, Hash } from 'lucide-react'
import { toast } from 'sonner'
import { useOutletContext } from 'react-router-dom'
import api from '../../lib/api'
import { RegisterAdminModal } from '../RegisterAdminModal'

interface SystemUser {
  _id?: string
  id?: string
  name: string
  email: string
  role?: string
  status?: string
  createdAt?: string
}

export const UsersView: React.FC = () => {
  const context = useOutletContext<{ isArabic: boolean }>()
  const isArabic = context?.isArabic ?? true

  const [admins, setAdmins] = useState<SystemUser[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  // Register Admin modal state
  const [isRegisterOpen, setIsRegisterOpen] = useState(false)

  // Details Modal state
  const [selectedAdmin, setSelectedAdmin] = useState<SystemUser | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Fetch Admins from API
  const fetchAdmins = async () => {
    try {
      setLoading(true)
      const response = await api.get('/admin/getAllAdmins')
      // The API returns an array directly or inside a data field
      const data = Array.isArray(response.data) ? response.data : (response.data.data || [])
      setAdmins(data)
    } catch (error) {
      console.error('Error fetching admins:', error)
      toast.error(isArabic ? 'فشل في تحميل المشرفين' : 'Failed to load system admins')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAdmins()
  }, [])

  // Filter
  const filteredUsers = useMemo(() => {
    return admins.filter((u) => {
      const name = u.name || ''
      const email = u.email || ''
      const id = u.id || u._id || ''
      return (
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })
  }, [admins, searchQuery])

  // Count summaries
  const userStats = useMemo(() => {
    return {
      total: admins.length,
      active: admins.length, // All returned admins are active system users
      admins: admins.length,
    }
  }, [admins])

  // Helpers
  const translateRole = (role?: string) => {
    const r = (role || 'admin').toLowerCase()
    if (r === 'admin') {
      return isArabic ? 'مدير النظام' : 'System Admin'
    }
    return isArabic ? 'مشرف' : 'Admin'
  }

  const getRoleBadgeColor = () => {
    return 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400'
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
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'إجمالي المستخدمين' : 'Total System Users'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{loading ? '...' : userStats.total}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-green-50 dark:bg-green-950/20 text-green-500">
            <UserCheck size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'المستخدمين النشطين' : 'Active Users'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{loading ? '...' : userStats.active}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex items-center gap-3 text-start">
          <div className="p-2.5 rounded-lg bg-purple-50 dark:bg-purple-950/20 text-purple-500">
            <Shield size={16} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold">{isArabic ? 'مسؤولي النظام (Admins)' : 'System Admins'}</p>
            <p className="text-base font-black text-slate-800 dark:text-slate-100 mt-0.5">{loading ? '...' : userStats.admins}</p>
          </div>
        </div>
      </section>

      {/* Directory Controls */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <div className="relative w-64 max-w-full group">
          <Search className="absolute start-3 top-2.5 h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
          <input
            type="text"
            placeholder={isArabic ? 'بحث عن مشرف بالاسم أو البريد...' : 'Search name, email...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full ps-9 pe-4 py-1.5 text-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 rounded-xl text-slate-700 dark:text-slate-200 focus:outline-none focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsRegisterOpen(true)}
            className="flex items-center gap-1.5 bg-orange-500 text-white px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:bg-orange-600 transition-colors shadow-sm shadow-orange-500/15"
          >
            <Plus size={14} />
            <span>{isArabic ? 'إضافة مشرف' : 'Add Admin'}</span>
          </button>
        </div>
      </div>

      {/* User Table */}
      {loading ? (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 p-12 flex flex-col items-center justify-center text-slate-400">
          <RefreshCw className="animate-spin mb-4" size={28} />
          <p className="text-sm font-semibold">{isArabic ? 'جاري تحميل المشرفين...' : 'Loading admins...'}</p>
        </div>
      ) : (
        <section className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800/80 shadow-sm overflow-hidden text-start">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 font-bold border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="px-6 py-4">{isArabic ? 'الاسم' : 'User'}</th>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">{isArabic ? 'البريد الإلكتروني' : 'Email'}</th>
                  <th className="px-6 py-4">{isArabic ? 'الدور الوظيفي' : 'Role'}</th>
                  <th className="px-6 py-4">{isArabic ? 'تاريخ التسجيل' : 'Registered At'}</th>
                  <th className="px-6 py-4 text-center">{isArabic ? 'الإجراءات' : 'Actions'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => {
                    const userId = user._id || user.id || ''
                    const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=f97316&color=fff&size=64&font-size=0.35`
                    return (
                      <tr 
                        key={userId} 
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors"
                      >
                        <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">
                          <div className="flex items-center gap-3">
                            <img src={avatarUrl} alt={user.name} className="w-8 h-8 rounded-full object-cover border border-slate-100" />
                            <span>{user.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-400">
                          {userId}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                          {user.email}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${getRoleBadgeColor()}`}>
                            {translateRole(user.role)}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString(isArabic ? 'ar-EG' : 'en-US') : '—'}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button 
                            onClick={() => {
                              setSelectedAdmin(user)
                              setIsDetailsOpen(true)
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all"
                            title={isArabic ? 'عرض التفاصيل' : 'View Details'}
                          >
                            <Eye size={14} />
                          </button>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-semibold">
                      {isArabic ? 'لم يتم العثور على أي مشرفين' : 'No admins found'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Register Admin Modal */}
      <RegisterAdminModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        isArabic={isArabic}
        onSuccess={fetchAdmins}
      />

      {/* Admin Details Modal */}
      {isDetailsOpen && selectedAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-2xl border border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden transform transition-all text-start">
            <div className="px-6 py-4 border-b border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
              <h3 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                <Shield size={16} className="text-orange-500" />
                <span>{isArabic ? 'تفاصيل المشرف' : 'Admin Details'}</span>
              </h3>
              <button
                onClick={() => {
                  setSelectedAdmin(null)
                  setIsDetailsOpen(false)
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="flex flex-col items-center justify-center pb-4 border-b border-slate-50 dark:border-slate-800/40">
                <img 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(selectedAdmin.name)}&background=f97316&color=fff&size=128`} 
                  alt={selectedAdmin.name} 
                  className="w-16 h-16 rounded-full border border-slate-100 shadow-sm object-cover mb-2"
                />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">{selectedAdmin.name}</h4>
                <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">{translateRole(selectedAdmin.role)}</p>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <Hash size={14} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">{isArabic ? 'المعرف' : 'ID'}</p>
                    <p className="text-slate-700 dark:text-slate-350 font-semibold">{selectedAdmin._id || selectedAdmin.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">{isArabic ? 'البريد الإلكتروني' : 'Email Address'}</p>
                    <p className="text-slate-700 dark:text-slate-350 font-semibold">{selectedAdmin.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar size={14} className="text-slate-400" />
                  <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase">{isArabic ? 'تاريخ التسجيل' : 'Registered On'}</p>
                    <p className="text-slate-700 dark:text-slate-350 font-semibold">
                      {selectedAdmin.createdAt ? new Date(selectedAdmin.createdAt).toLocaleString(isArabic ? 'ar-EG' : 'en-US') : '—'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800/60 flex justify-end">
                <button
                  onClick={() => {
                    setSelectedAdmin(null)
                    setIsDetailsOpen(false)
                  }}
                  className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 px-4 py-2 rounded-xl font-bold transition-colors"
                >
                  {isArabic ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
